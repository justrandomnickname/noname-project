import { Guid } from 'guid-typescript'

export class Pawn {
  public id: string
  public name: string
  public age: number
  constructor(name: string, age: number) {
    this.id = Guid.create().toJSON().value
    this.name = name
    this.age = age
  }
}

export namespace Pawn {
  export interface IPawn {
    id: string
    name: string
    age: number
    race: Race
    // appearance: IAppearance
    gender: Gender
    // traits: ITrait[]
    level: number
    exp: number
  }

  export interface IAppearance {
    height: number
    weight: number
  }

  export interface ITrait {
    name: string
  }

  export interface IStats {
    fatigue: number
    magick: number
    health: number
  }

  export enum Gender {
    'Female',
    'Male',
  }

  export enum Race {
    'Human',
  }
}
