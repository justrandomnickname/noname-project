import { PawnBuilder } from './PawnBuilder'

export class Pawn implements Pawn.IPawn {
  protected _firstName: string
  protected _pic: PawnBuilder.Avatars
  protected _gender: PawnBuilder.Genders
  protected _alias: string | null
  protected _key: string

  constructor(pawnBuilder: PawnBuilder) {
    this._firstName = pawnBuilder.firstName
    this._pic = pawnBuilder.pic
    this._gender = pawnBuilder.gender
    this._alias = pawnBuilder.alias
    this._key = pawnBuilder.key
  }

  get firstName() {
    return this._firstName
  }
  get pic() {
    return this._pic
  }
  get gender() {
    return this._gender
  }
  get alias() {
    if (this._alias) return this._alias
    else return this._firstName
  }
  get key() {
    return this._key
  }
}

export namespace Pawn {
  export interface IPawn {
    firstName: string
    pic: PawnBuilder.Avatars
    gender: PawnBuilder.Genders
    alias: string
    key: string
  }
}
