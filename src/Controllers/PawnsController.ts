import { IController } from './interfaces/IController'
import Data from '@Core/Data'
import { Pawn } from '@Modules/Pawn/Pawn'
import { PawnBuilder } from '@Modules/Pawn/PawnBuilder'

export class PawnsController implements PawnsController.IPawnController {
  private static _pawns: Pawn[] = []
  private static _setState: React.Dispatch<React.SetStateAction<Pawn[]>> | null
  constructor(setState: React.Dispatch<React.SetStateAction<Pawn[]>>) {
    if (!PawnsController._setState) {
      PawnsController._setState = setState
    }
    this.Mount = this.Mount.bind(this)
  }
  get pawns() {
    return PawnsController._pawns
  }
  set pawns(value: Pawn[]) {
    PawnsController._pawns = value
  }
  get setState() {
    return PawnsController._setState
  }
  public Mount() {
    if (this.setState) this.setState([...this.pawns])
  }
  public Unmount() {
    PawnsController._setState = null
  }
  public CreatePawns() {
    const pawns: Pawn[] = []
    for (let i = 0; i < 10; i++) {
      const builder = new PawnBuilder({ key: Data.GetPublicKey([]) })
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
}
