import Realm from 'realm'
import { Pawn } from './Pawn'

export class Attributes implements Attributes.IAttributes {
  constructor(
    public strength = 0,
    public fortitude = 0,
    public quickness = 0,
    public intelligence = 0,
    public willpower = 0,
    public charisma = 0,
    public soul = 0,
  ) {}
  public SetDefaultAttributesByArchetype(type: Pawn.PawnTypes): void {
    switch (type) {
      case 'warrior':
        this.strength = 6
        this.fortitude = 6
        this.quickness = 4
        this.intelligence = 2
        this.willpower = 3
        this.charisma = 2
        this.soul = 0
        break
      default:
        break
    }
  }
  public IncreaseAttribute(attribute: Attributes.AttributeNames) {
    switch (attribute) {
      case 'strength':
        this.strength++
        break
      case 'fortitude':
        this.fortitude++
        break
      case 'quickness':
        this.quickness++
        break
      case 'intelligence':
        this.intelligence++
        break
      case 'willpower':
        this.willpower++
        break
      case 'charisma':
        this.charisma++
        break
      case 'soul':
        this.soul++
        break
      default:
        break
    }
  }
}
export namespace Attributes {
  export interface IAttributes {
    /**
     * How strong is physical hit
     * How much capacity pawn can carry without slow down
     */
    strength: number
    /**
     * Base HP modifier
     * How much pain pawn can withstand
     */
    fortitude: number
    /**
     * how much actions pawn is able to perform per turn
     */
    quickness: number
    /**
     * How fast pawn grows in xp per every action
     * natural ability to comprehend a lot of skills
     */
    intelligence: number
    /**
     * Resistance against non-physicals threats
     * bravery
     */
    willpower: number
    /**
     * base MP modifier
     * How strong is pawn connected to magick
     * Natural ability to cast powerful spells
     */
    soul: number
    /**
     * Attribute with influence on leadership and natural charm
     * How good pawn is performing social actions
     */
    charisma: number
  }

  export const Schema: Realm.ObjectSchema = {
    name: 'Attributes',
    properties: {
      strength: 'int',
      fortitude: 'int',
      quickness: 'int',
      intelligence: 'int',
      willpower: 'int',
      charisma: 'int',
      soul: 'int',
    },
  }
  export type AttributeNames =
    | 'strength'
    | 'fortitude'
    | 'quickness'
    | 'intelligence'
    | 'willpower'
    | 'charisma'
    | 'soul'

  export const AttributeQuantityChances = {
    extremely_high: 5,
    high: 15,
    medium: 30,
    low: 25,
    extremely_low: 25,
  }

  export enum AttributeQuantityValues {
    'extremely_high' = 22,
    'high' = 20,
    'medium' = 16,
    'low' = 14,
    'extremely_low' = 12,
  }

  export const Uniques = {
    strong: 15,
    mighty: 5,
    clever: 15,
    genius: 5,
    iron_will: 15,
    unbreakable: 5,
    charming: 15,
    fabulous: 5,
    connected: 15,
    bright_soul: 5,
  }
  export type UniqueTypes =
    | 'strong'
    | 'mighty'
    | 'clever'
    | 'genius'
    | 'iron_will'
    | 'unbreakable'
    | 'charming'
    | 'fabulous'
    | 'connected'
    | 'bright_soul'

  export const UniquesValues = {
    strong: 5,
    mighty: 10,
    clever: 5,
    genius: 10,
    iron_will: 5,
    unbreakable: 10,
    charming: 5,
    fabulous: 10,
    connected: 5,
    bright_soul: 10,
  }
}
