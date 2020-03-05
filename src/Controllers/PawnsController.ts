import Realm from 'realm'
import { getConfiguration } from '../../realms/configs'
import { IController } from './interfaces/IController'
import Data from '@Core/Data'
import { Pawn } from '@Modules/Pawn/Pawn'
import { PawnBuilder } from '@Modules/Pawn/PawnBuilder'
import { Attributes } from '@Modules/Pawn/PawnAttributes'

export class PawnsController implements PawnsController.IPawnController {
  private static _pawns: Pawn.IPawn[] = []
  private static _setState: React.Dispatch<React.SetStateAction<Pawn.IPawn[]>> | null
  private static _Schemas: Realm.ObjectSchema[] = []
  constructor(setState?: React.Dispatch<React.SetStateAction<Pawn.IPawn[]>>) {
    if (PawnsController._Schemas.length === 0)
      PawnsController._Schemas = [Pawn.Schema, Attributes.Schema, PawnsController.Schema]
    if (setState) PawnsController._setState = setState
    this.Mount = this.Mount.bind(this)
  }
  get pawns(): Pawn.IPawn[] {
    return PawnsController._pawns
  }
  set pawns(value: Pawn.IPawn[]) {
    PawnsController._pawns = value
  }
  get setState() {
    return PawnsController._setState
  }
  public Mount(): void {
    if (this.setState) this.setState([...this.pawns])
  }
  public Unmount(): void {
    PawnsController._setState = null
  }
  public Save(sessionId: string, path: string): void {
    const realm = new Realm({
      ...getConfiguration(),
      path,
      schema: PawnsController._Schemas,
    })
    realm.write(() => {
      const pawns = []
      for (let i = 0; i < this.pawns.length; i++) {
        const pawn = this.pawns[i]
        const target = realm.create(Pawn.Schema.name, {
          firstName: pawn.firstName,
          pic: pawn.pic,
          gender: pawn.gender,
          alias: pawn.alias,
          key: pawn.key,
          attributes: {
            strength: pawn.attributes.strength,
            fortitude: pawn.attributes.fortitude,
            quickness: pawn.attributes.quickness,
            intelligence: pawn.attributes.intelligence,
            willpower: pawn.attributes.willpower,
            charisma: pawn.attributes.charisma,
            soul: pawn.attributes.soul,
          },
        })
        pawns.push(target)
      }
      realm.create(PawnsController.Schema.name, {
        session_id: sessionId,
        list: pawns,
      })
    })
    realm.close()
  }
  public async Load(sessionId: string, path: string) {
    const realm = new Realm({
      ...getConfiguration(),
      path,
      schema: PawnsController._Schemas,
    })
    const pawns: Pawn.IPawn[] = []
    realm
      .objects('PawnList')
      .filtered('session_id = $0', sessionId)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .forEach((obj: any) =>
        obj.list.forEach((pawn: Pawn.IPawn) => {
          const pawnBulder = new PawnBuilder({
            // firstName: pawn.firstName,
            // pic: pawn.pic,
            // gender: pawn.gender,
            // alias: pawn.alias,
            key: pawn.key,
          })
            .SetGender(pawn.gender)
            .SetName(pawn.firstName)
            .SetPic(pawn.pic)
            .SetAlias(pawn.alias)
            .SetAttributes(pawn.attributes)
          const loadedPawn = new Pawn(pawnBulder)
          pawns.push(loadedPawn)
        }),
      )
    realm.close()
    this.pawns = pawns
    this.Mount()
  }
  public CreatePawns(): void {
    const pawns: Pawn[] = []
    for (let i = 0; i < 10; i++) {
      const builder = new PawnBuilder({ key: Data.GetPublicKey(pawns) })
        .SetGender()
        .SetName()
        .SetPic()
        .GenerateAttributes('warrior')
        .GenerateBody('humanoid')
      const pawn = new Pawn(builder)
      pawns.push(pawn)
    }
    this.pawns = pawns
    console.log('PAWNS IS', this.pawns)
    this.Mount()
  }
}

export namespace PawnsController {
  export interface IPawnController extends IController {
    CreatePawns: () => void
  }

  export const Schema: Realm.ObjectSchema = {
    name: 'PawnList',
    properties: {
      session_id: 'string',
      list: {
        type: 'list',
        objectType: Pawn.Schema.name,
      },
    },
  }
}
