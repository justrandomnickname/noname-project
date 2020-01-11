import Realm from 'realm'
import { IController } from './interfaces/IController'
import { Livestock } from '@Modules/Location/Livestock'
import { getConfiguration } from '../../realms/configs'

export class LivestockController implements LivestockController.ILivestockController {
  private static _livestock: Livestock.ILivestock = new Livestock()
  private static _setState: React.Dispatch<React.SetStateAction<Livestock.IResource[]>> | null
  constructor(setState?: React.Dispatch<React.SetStateAction<Livestock.IResource[]>>) {
    if (setState) LivestockController._setState = setState
    this.Mount.bind(this)
  }
  public Mount(): void {
    if (LivestockController._setState) LivestockController._setState([...this.livestock.resources])
  }
  public Unmount(): void {
    LivestockController._setState = null
  }
  public Save(sessionId: string): void {
    const realm = new Realm({
      ...getConfiguration(),
      schema: [Livestock.Schema],
    })
    realm.write(() => {
      realm.create(Livestock.Schema.name, {
        session_id: sessionId,
        gold: this.livestock.gold.amount,
        silver: this.livestock.silver.amount,
        gems: this.livestock.gems.amount,
        food: this.livestock.food.amount,
        goods: this.livestock.goods.amount,
        materials: this.livestock.materials.amount,
        weaponsAndArmour: this.livestock.weaponsAndArmour.amount,
        lore: this.livestock.lore.amount,
        crystals: this.livestock.crystals.amount,
      })
    })
    realm.close()
  }
  public Load(sessionId: string): void {
    Realm.open({ ...getConfiguration(), schema: [Livestock.Schema] })
      .then(realm => {
        realm.objects(Livestock.Schema.name).filtered('session_id = $0', sessionId)
        return realm
      })
      .then(realm => realm.close())
  }
  // public Load(): void {}
  get livestock(): Livestock.ILivestock {
    return LivestockController._livestock
  }
}
export namespace LivestockController {
  export interface ILivestockController extends IController {
    livestock: Livestock.ILivestock
  }
}
