import Realm from 'realm'
import { PawnBuilder } from './PawnBuilder'
import { Attributes } from './PawnAttributes'
import { BaseBody } from './Body/BaseBody'

export class Pawn implements Pawn.IPawn {
  protected _firstName: string
  protected _pic: PawnBuilder.Avatars
  protected _gender: PawnBuilder.Genders
  protected _alias: string | null
  protected _key: string
  protected _attributes: Attributes.IAttributes
  protected _level: number
  protected _exp: number
  protected _hp: number
  protected _mp: number
  protected _fatigue: number
  protected _body: BaseBody

  constructor(pawnBuilder: PawnBuilder) {
    this._firstName = pawnBuilder.firstName
    this._pic = pawnBuilder.pic
    this._gender = pawnBuilder.gender
    this._alias = pawnBuilder.alias
    this._key = pawnBuilder.key
    this._level = pawnBuilder.level
    this._exp = pawnBuilder.exp
    this._hp = pawnBuilder.hp
    this._mp = pawnBuilder.mp
    this._fatigue = pawnBuilder.fatigue
    this._attributes = pawnBuilder.attributes
    this._body = pawnBuilder.body
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
  get attributes() {
    return this._attributes
  }
}

export namespace Pawn {
  export interface IPawn {
    firstName: string
    pic: PawnBuilder.Avatars
    gender: PawnBuilder.Genders
    alias: string
    key: string
    attributes: Attributes.IAttributes
  }

  export type PawnTypes = 'warrior' | 'mage' | 'intellectual' | 'archer'

  export const Schema: Realm.ObjectSchema = {
    name: 'Pawn',
    properties: {
      firstName: 'string',
      pic: 'string',
      gender: 'int',
      alias: 'string',
      key: 'string',
      attributes: Attributes.Schema.name,
    },
  }
}
