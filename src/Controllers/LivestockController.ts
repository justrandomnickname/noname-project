import { IController } from './interfaces/IController'
import { Livestock } from '@Modules/Location/Livestock'

export class LivestockController implements LivestockController.ILivestockController {
  private static _livestock: Livestock.ILivestock = new Livestock()
  private static _setState: React.Dispatch<React.SetStateAction<Livestock.IResource[]>> | null
  constructor(setState: React.Dispatch<React.SetStateAction<Livestock.IResource[]>>) {
    if (!LivestockController._setState) LivestockController._setState = setState
    this.Mount.bind(this)
  }
  public Mount(): void {
    if (LivestockController._setState) LivestockController._setState([...this.livestock.resources])
  }
  public Unmount(): void {
    LivestockController._setState = null
  }
  get livestock(): Livestock.ILivestock {
    return LivestockController._livestock
  }
}
export namespace LivestockController {
  export interface ILivestockController extends IController {
    livestock: Livestock.ILivestock
  }
}
