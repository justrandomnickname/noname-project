function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function weightedRandom<T>(list: T[], weight: number[]) {
  const total_weight = weight.reduce((prev: number, curr: number) => prev + curr, 0)
  const random_num = rand(0, total_weight)
  let weight_sum = 0
  for (let i = 0; i < list.length; i++) {
    weight_sum += weight[i]
    weight_sum = +weight_sum.toFixed(2)
    if (random_num <= weight_sum) {
      return list[i]
    }
  }
}

export class PawnBuilder implements PawnBuilder.IPawnBuilder {
  private _firstName = ''
  private _pic: PawnBuilder.Avatars = 'default.svg'
  private _gender: PawnBuilder.Genders = PawnBuilder.Genders['none']
  private _alias: string | null = null
  private _key: string
  constructor(payload: { key: string }) {
    this._key = payload.key
  }

  public SetGender(gender?: PawnBuilder.Genders): PawnBuilder {
    if (gender) this._gender = gender
    else {
      this._gender =
        PawnBuilder.Genders[
          weightedRandom(
            Object.keys(PawnBuilder.GENDER_CHANCES),
            Object.values(PawnBuilder.GENDER_CHANCES),
          ) as keyof typeof PawnBuilder.GENDER_CHANCES
        ]
    }
    return this
  }
  public SetName(name?: string): PawnBuilder {
    if (name) this._firstName = name
    else {
      const names = PawnBuilder.NAMES[PawnBuilder.Genders[this._gender] as keyof typeof PawnBuilder.NAMES]
      const weights: number[] = names.map(() => {
        return 100 / names.length
      })
      if (!names) throw new Error('Gender does not exist!')
      this._firstName = weightedRandom(names, weights) as string
    }
    return this
  }

  public SetPic(pic?: PawnBuilder.Avatars): PawnBuilder {
    if (pic) this._pic = pic
    else {
      if (this._gender === PawnBuilder.Genders['female']) this._pic = 'elf.svg'
      else if (this._gender === PawnBuilder.Genders['male']) this._pic = 'vampire.svg'
      else throw Error('invalid gender!')
    }
    return this
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
  get key() {
    return this._key
  }
  get alias() {
    if (this._alias) return this._alias
    else return null
  }
}

export namespace PawnBuilder {
  export interface IPawnBuilder {
    SetGender(gender?: Genders): PawnBuilder
    SetName(name?: string): PawnBuilder
    SetPic(pic?: Avatars): PawnBuilder
  }

  export enum Genders {
    'none',
    'male',
    'female',
  }

  export type Avatars = 'default.svg' | 'elf.svg' | 'vampire.svg'

  export const GENDER_CHANCES = {
    male: 50,
    female: 50,
  }
  export const NAMES = {
    none: [''],
    male: ['Jack', 'John', 'Alex'],
    female: ['Priscilla', 'Elizabeth', 'Liza'],
  }
}
