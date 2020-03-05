import { Attributes } from './PawnAttributes'
import { Pawn } from './Pawn'
import { BaseBody } from './Body/BaseBody'
import { Humanoid } from './Body/Humanoid'

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

interface IRollDiceModifiers {
  hitChance: number
  evadeChance: number
  physicalDamageModifier: number
  armorPenetrationHardness: number
}

interface IDamage {
  physical: {
    stab: number
    crush: number
    pierce: number
    burn: number
  }
}

export class PawnBuilder implements PawnBuilder.IPawnBuilder {
  private _firstName = ''
  private _pic: PawnBuilder.Avatars = 'default.svg'
  private _gender: PawnBuilder.Genders = PawnBuilder.Genders['none']
  private _alias: string | null = null
  private _key: string
  private _attributes: Attributes.IAttributes = new Attributes()
  private _modifiers: IRollDiceModifiers = {
    hitChance: 0,
    evadeChance: 0,
    physicalDamageModifier: 0,
    armorPenetrationHardness: 0,
  }
  private _level = 0
  private _exp = 0
  private _hp = 0
  private _mp = 0
  private _fatigue = 0
  private _will = 0
  private _expMultiplier = 0
  private _isUnique = false
  private _isImpressive = false
  private _body: BaseBody | null = null
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

  public SetAlias(alias: string): PawnBuilder {
    this._alias = alias
    return this
  }

  public SetPawnCharacteristics(level: number, hp: number, mp: number, fatigue: number): PawnBuilder {
    this._level = level
    this._hp = hp
    this._mp = mp
    this._fatigue = fatigue
    return this
  }

  public GenerateBody(type: string) {
    switch (type) {
      case 'humanoid':
        this._body = new Humanoid()
        break
      default:
        break
    }
    return this
  }
  private GenerateCharacteristicsFromAttributes() {
    //hp
    const fortitudeHPMultiplier =
      (this.attributes.fortitude / 100) * PawnBuilder.ATTRIBUTES_MULTIPLIER.HP.FORTITUDE * (this._level + 1)
    const strengthHPMultiplier =
      (this.attributes.strength / 100) * PawnBuilder.ATTRIBUTES_MULTIPLIER.HP.STRENGTH * (this._level + 1)

    //fatigue
    const fortitudeFatigueMultiplier =
      (this.attributes.fortitude / 100) * PawnBuilder.ATTRIBUTES_MULTIPLIER.FATIGUE.FORTITUDE * (this._level + 1)
    const willpowerFatigueMultiplier =
      (this.attributes.willpower / 100) * PawnBuilder.ATTRIBUTES_MULTIPLIER.FATIGUE.WILLPOWER * (this._level + 1)

    //will
    const willMultiplier = (this.attributes.willpower / 100) * 100 * (this._level + 1)

    //mp
    const soulMPMultiplier =
      (this.attributes.soul / 100) * PawnBuilder.ATTRIBUTES_MULTIPLIER.MP.SOUL * (this._level + 1)
    const willpowerMPMultiplier =
      (this.attributes.willpower / 100) * PawnBuilder.ATTRIBUTES_MULTIPLIER.MP.WILLPOWER * (this._level + 1)

    //experience gain
    const intelligenceEXPGainMultiplier =
      this.attributes.intelligence * PawnBuilder.ATTRIBUTES_MULTIPLIER.EXP.INTELLIGENCE

    this._expMultiplier = intelligenceEXPGainMultiplier
    this._hp = Math.floor(PawnBuilder.BASE_STAT_VALUES.HP + strengthHPMultiplier + fortitudeHPMultiplier)
    this._fatigue = Math.floor(
      PawnBuilder.BASE_STAT_VALUES.FATIGUE + fortitudeFatigueMultiplier + willpowerFatigueMultiplier,
    )
    this._mp = Math.floor(PawnBuilder.BASE_STAT_VALUES.MP + soulMPMultiplier + willpowerMPMultiplier)
    this._will = Math.floor(PawnBuilder.BASE_STAT_VALUES.WILL + willMultiplier)
  }
  public SetAttributes(attributes: Attributes.IAttributes): PawnBuilder {
    this._attributes = attributes
    return this
  }
  public GenerateModifiersFromAttributes(): PawnBuilder {
    // this._hitChance = Math.floor((this.attributes.strength - 10) / 2)
    // this._evadeChance = Math.floor((this.attributes.quickness - 10) / 2)
    // const baseAtkModifier = Math.floor((this.attributes.strength - 10) * 5)
    return this
  }
  public GenerateAttributes(type: Pawn.PawnTypes): PawnBuilder {
    switch (type) {
      case 'warrior':
        const attributeQuantityValues = Object.values(Attributes.AttributeQuantityChances)
        const attributeQuantityNames = Object.keys(Attributes.AttributeQuantityValues).slice(
          Object.keys(Attributes.AttributeQuantityValues).length / 2,
        )
        const randomizedQuantity: string = weightedRandom(attributeQuantityNames, attributeQuantityValues) as string
        const totalAttributes =
          Attributes.AttributeQuantityValues[randomizedQuantity as keyof typeof Attributes.AttributeQuantityValues]
        const attributes = new Attributes()
        attributes.SetDefaultAttributesByArchetype('warrior')
        const names = Object.keys(PawnBuilder.ARCHETYPES.warrior.attributes)
        const weights = Object.values(PawnBuilder.ARCHETYPES.warrior.attributes)
        // const weights = [30, 20, 15, 10, 10, 10, 10]
        for (let i = 0; i < totalAttributes; i++) {
          const attribute = weightedRandom(names, weights) as Attributes.AttributeNames
          attributes.IncreaseAttribute(attribute)
        }
        this._attributes = attributes
        break
      default:
        break
    }
    this.GenerateUniqueness()
    this.GenerateCharacteristicsFromAttributes()
    return this
  }

  private GenerateUniqueness(): void {
    const isUnique = weightedRandom(['usual', 'unique'], [95, 5]) === 'unique'
    if (isUnique) {
      const uniquenessChances = Object.values(Attributes.UniquesValues)
      const uniquenessNames: Attributes.UniqueTypes[] = Object.keys(
        Attributes.UniquesValues,
      ) as Attributes.UniqueTypes[]

      const uniqueTrait = weightedRandom(uniquenessNames, uniquenessChances)
      if (uniqueTrait) {
        switch (uniqueTrait as Attributes.UniqueTypes) {
          case 'bright_soul':
            this._attributes.soul += Attributes.UniquesValues.bright_soul
            this._isUnique = true
            break
          case 'charming':
            this.attributes.charisma += Attributes.UniquesValues.charming
            this._isImpressive = true
            break
          case 'clever':
            this.attributes.intelligence += Attributes.UniquesValues.clever
            this._isImpressive = true
            break
          case 'connected':
            this.attributes.soul += Attributes.UniquesValues.connected
            this._isImpressive = true
            break
          case 'genius':
            this.attributes.intelligence += Attributes.UniquesValues.genius
            this._isUnique = true
            break
          case 'fabulous':
            this.attributes.charisma += Attributes.UniquesValues.fabulous
            this._isUnique = true
            break
          case 'iron_will':
            this.attributes.willpower += Attributes.UniquesValues.iron_will
            this._isImpressive = true
            break
          case 'mighty':
            this.attributes.strength += Attributes.UniquesValues.mighty - 2
            this.attributes.fortitude += Math.floor(Attributes.UniquesValues.mighty / 2)
            this._isUnique = true
            break
          case 'strong':
            this.attributes.strength += Attributes.UniquesValues.strong - 1
            this.attributes.fortitude += Math.floor(Attributes.UniquesValues.strong / 2)
            this._isImpressive = true
            break
          case 'unbreakable':
            this.attributes.fortitude += Attributes.UniquesValues.unbreakable
            this._isUnique = true
            break
          default:
            break
        }
      }
    }
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
  get attributes() {
    return this._attributes
  }
  get level() {
    return this._level
  }
  get hp() {
    return this._hp
  }
  get mp() {
    return this._mp
  }
  get fatigue() {
    return this._fatigue
  }
  get will() {
    return this._will
  }
  get expMultiplier() {
    return this._expMultiplier
  }
  get exp() {
    return this._exp
  }
  get body() {
    if (this._body) return this._body
    else return new Humanoid()
  }
}

export namespace PawnBuilder {
  export interface IPawnBuilder {
    SetGender(gender?: Genders): PawnBuilder
    SetName(name?: string): PawnBuilder
    SetPic(pic?: Avatars): PawnBuilder
    SetAlias(alias: string): PawnBuilder
    SetAttributes(attributes: Attributes.IAttributes): PawnBuilder
    GenerateAttributes(type: Pawn.PawnTypes): PawnBuilder
    SetPawnCharacteristics(level: number, hp: number, mp: number, fatigue: number): PawnBuilder
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

  export const ATTRIBUTES_MULTIPLIER = {
    HP: {
      STRENGTH: 35,
      FORTITUDE: 100,
    },
    MP: {
      SOUL: 100,
      WILLPOWER: 35,
    },
    FATIGUE: {
      FORTITUDE: 100,
      WILLPOWER: 35,
    },
    EXP: {
      INTELLIGENCE: 1.5,
    },
  }
  export const BASE_STAT_VALUES = {
    HP: 15,
    MP: 10,
    WILL: 5,
    FATIGUE: 15,
  }

  //const attributeNames = ['strength', 'fortitude', 'quickness', 'intelligence', 'willpower', 'charisma', 'soul']
  //const weights = [30, 20, 15, 10, 10, 10, 10]
  const MAIN = 30
  const SUBMAIN = 20
  const ADDITIONAL = 15
  const UNWANTED = 10
  const WASTE = 5

  export const ARCHETYPE_RULES = {
    ATTRIBUTES: {
      EQUAL: 100,
    },
    BASE_ATTRIBUTES: {
      MIN: 16,
      MAX: 24,
    },
  }
  export const ARCHETYPES = {
    warrior: {
      name: 'warrior',
      attributes: {
        strength: MAIN,
        fortitude: SUBMAIN,
        quickness: ADDITIONAL,
        intelligence: UNWANTED,
        willpower: UNWANTED,
        charisma: UNWANTED,
        soul: WASTE,
      },
      base_attributes: {
        strength: 6,
        fortitude: 6,
        quickness: 4,
        intelligence: 2,
        willpower: 2,
        charisma: 2,
        soul: 2,
      },
    },
  }

  function ArchetypeValidator() {
    const archetypes = Object.values(ARCHETYPES)
    for (let i = 0; i < archetypes.length; i++) {
      const attributes = Object.values(archetypes[i].attributes)
      const baseAttributes = Object.values(archetypes[i].base_attributes)
      const attributesCount = attributes.reduce((prev: number, curr: number) => prev + curr, 0)
      const baseAttributesCount = baseAttributes.reduce((prev: number, curr: number) => prev + curr, 0)
      const isValidAttributes = attributesCount === ARCHETYPE_RULES.ATTRIBUTES.EQUAL
      let isValidBaseAttributes =
        baseAttributesCount >= ARCHETYPE_RULES.BASE_ATTRIBUTES.MIN &&
        baseAttributesCount <= ARCHETYPE_RULES.BASE_ATTRIBUTES.MAX
      for (let i = 0; i < baseAttributes.length; i++) {
        if (baseAttributes[i] < 2) {
          isValidBaseAttributes = false
          break
        }
      }

      if (!isValidAttributes || !isValidBaseAttributes)
        throw Error(`Archetype ${archetypes[i].name} violates gameplay rules`)
    }
  }

  if (process.env.NODE_ENV === 'development') ArchetypeValidator()
}
