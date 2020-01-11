import Realm from 'realm'
import { getConfiguration } from '../../realms/configs'
import { IController } from './interfaces/IController'
import Data from '@Core/Data'
import { Pawn } from '@Modules/Pawn/Pawn'
import { PawnBuilder } from '@Modules/Pawn/PawnBuilder'

export class PawnsController implements PawnsController.IPawnController {
  private static _pawns: Pawn.IPawn[] = []
  private static _setState: React.Dispatch<React.SetStateAction<Pawn.IPawn[]>> | null
  constructor(setState?: React.Dispatch<React.SetStateAction<Pawn.IPawn[]>>) {
    if (setState) PawnsController._setState = setState
    this.Mount = this.Mount.bind(this)
  }
  get pawns() {
    return PawnsController._pawns
  }
  set pawns(value: Pawn.IPawn[]) {
    PawnsController._pawns = value
  }
  get setState() {
    return PawnsController._setState
  }
  public Mount() {
    console.log('MOUNTED!', this.pawns[0])
    if (this.setState) this.setState([...this.pawns])
  }
  public Unmount() {
    PawnsController._setState = null
  }
  public Save(sessionId: string) {
    const realm = new Realm({
      ...getConfiguration(),
      schema: [PawnsController.Schema, Pawn.Schema],
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
        })
        pawns.push(target)
      }
      realm.create(PawnsController.Schema.name, {
        sessionId,
        list: pawns,
      })
    })

    // const ppawns: Pawn.IPawn[] = []
    // realm.objects('PawnList').forEach((obj: any) =>
    //   obj.list.forEach((pawn: any) =>
    //     ppawns.push({
    //       firstName: pawn.firstName,
    //       alias: pawn.firstName,
    //       pic: pawn.pic,
    //       gender: pawn.gender,
    //       key: pawn.key,
    //     }),
    //   ),
    // )
    // console.log('PPAWNS IS', ppawns)
    // console.log('ORIGINAL IS', this.pawns)
    realm.close()
  }
  public Load(sessionId: string) {
    Realm.open({ ...getConfiguration(), schema: [PawnsController.Schema, Pawn.Schema] }).then((realm: Realm) => {
      const pawns: Pawn.IPawn[] = []
      realm
        .objects('PawnList')
        .filtered('sessionId = $0', sessionId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .forEach((obj: any) =>
          obj.list.forEach((pawn: Pawn.IPawn) => {
            pawns.push({
              firstName: pawn.firstName,
              pic: pawn.pic,
              gender: pawn.gender,
              alias: pawn.alias,
              key: pawn.key,
            })
          }),
        )
      this.pawns = pawns
      this.Mount()
    })
  }
  public CreatePawns() {
    const pawns: Pawn[] = []
    for (let i = 0; i < 10; i++) {
      const builder = new PawnBuilder({ key: Data.GetPublicKey(pawns) })
        .SetGender()
        .SetName()
        .SetPic()
      const pawn = new Pawn(builder)
      pawns.push(pawn)
    }
    this.pawns = pawns
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
      sessionId: 'string',
      list: {
        type: 'list',
        objectType: Pawn.Schema.name,
      },
    },
  }
}
