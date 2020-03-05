export abstract class BaseBody {
  protected abstract parts: BaseBody.IBody = {}
}

export namespace BaseBody {
  // export type BodyPartType = 'head' | 'right_leg' | 'left_leg' | 'left_arm' | 'right_arm' | 'torso'
  export type BodyType = 'humanoid'
  export enum BodyPartTypeEnum {
    'head',
    'brain',
    'limb',
    'torso',
    'vital',
    'vision',
    'hearing',
    'speech',
    'decoration',
    'entrail',
  }
  export type EquipmentType = 'torso' | 'head' | 'weapon' | 'legs' | 'arms' | 'ear'
  export enum EquipmentEnum {
    'torso',
    'head',
    'weapon',
    'leg',
    'arm',
    'ear',
  }
  export interface IBodyExtra extends IBodyPart {
    involvement: number
  }
  export interface IBodyInternals extends IBodyPart {
    involvement: number
  }
  export interface IBody {
    [key: string]: IBodyPart
  }
  export interface IBodyPart {
    name: string
    type: BodyPartTypeEnum
    condition: {
      hp: number
    }
    baseCondition: {
      readonly hp: number
    }
    equippable: EquipmentEnum[] | 'none'
    extra?: { [key: string]: IBodyPart | IBodyExtra }
    internals?: { [key: string]: IBodyPart | IBodyExtra }
  }
}
