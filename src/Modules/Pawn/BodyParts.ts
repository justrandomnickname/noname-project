export class BodyParts {
  protected _condition: BodyParts.IBaseHumanoidBody
  constructor(bodyType: BodyParts.IBaseHumanoidBody) {
    this._condition = bodyType
  }

  public injury(damageType: BodyParts.InjuryType, bodyPart: BodyParts.BaseHumanoidBodyPartTypes, damage: number) {
    const part = this.condition.base[bodyPart]
    switch (damageType) {
      case 'pierce':
        if (part) {
          part.injuries.pierce.damage -= damage
          part.injuries.pierce.condition = this.getInjuryHeaviness(part.injuries.pierce.damage)
        }
        break
      default:
        break
    }
    this.recalculateBodyPartCapability(bodyPart)
  }

  public getInjuryHeaviness(damage: number): number {
    if (damage >= 1 && damage < 25) return 1
    if (damage >= 25 && damage < 50) return 2
    if (damage >= 50 && damage <= 100) return 3
    else return 0
  }

  public recalculateBodyPartCapability(bodyPart: BodyParts.BaseHumanoidBodyPartTypes): void {
    const part = this.condition.base[bodyPart]
    if (part) {
      const conditions = Object.values(part.injuries)
      const damage = conditions.reduce((currValue: number, prevValue) => currValue + prevValue.damage, 0)
      if (damage >= 0 && damage < 25) part.capability = BodyParts.BodyStateCapability['all_right']
      else if (damage >= 25 && damage < 50) part.capability = BodyParts.BodyStateCapability['damaged']
      else if (damage >= 50 && damage < 75) part.capability = BodyParts.BodyStateCapability['infirm']
      else if (damage >= 75 && damage < 100) part.capability = BodyParts.BodyStateCapability['incapable']
    }
  }

  get basePartCondition(): BodyParts.IInjury {
    return {
      crush: { condition: BodyParts.CrushInjuryEnum['all_right'], damage: 0 },
      pierce: { condition: BodyParts.PierceInjuryEnum['all_right'], damage: 0 },
      burn: { condition: BodyParts.BurnInjuryEnum['all_right'], damage: 0 },
    }
  }

  get condition(): BodyParts.IBaseHumanoidBody {
    return this._condition
  }
}

// export type InjuryType =
//   | 'all_right'
//   | 'crumpled'
//   | 'broken'
//   | 'smitten'
//   | 'slightly_wounded'
//   | 'wounded'
//   | 'heavily_wounded'
//   | 'missing'

export namespace BodyParts {
  export enum BodyStateCapability {
    'all_right',
    'damaged',
    'infirm',
    'incapable',
    'missing',
  }
  export const EQUIPPABLE = {
    TYPE: {
      ARMOR: {
        TORSO: 'torso_armor',
        HELMET: 'helmet',
      },
    },
  }

  export type EquippableTypes = 'none' | 'torso_armor'

  export type BaseHumanoidBodyPartTypes = 'head' | 'leftHand' | 'rightHand' | 'torso' | 'leftLeg' | 'rightLeg'
  export interface IBaseHumanoidBody {
    base: {
      head: {
        equippable: {
          type: EquippableTypes
        }
        type: BaseHumanoidBodyPartTypes
        injuries: IInjury
        capability: BodyStateCapability
      }
      leftHand: {
        type: BaseHumanoidBodyPartTypes
        injuries: IInjury
        capability: BodyStateCapability
      }
      rightHand: {
        type: BaseHumanoidBodyPartTypes
        injuries: IInjury
        capability: BodyStateCapability
      }
      torso: {
        type: BaseHumanoidBodyPartTypes
        injuries: IInjury
        capability: BodyStateCapability
      }
      leftLeg: {
        type: BaseHumanoidBodyPartTypes
        injuries: IInjury
        capability: BodyStateCapability
      }
      rightLeg: {
        type: BaseHumanoidBodyPartTypes
        injuries: IInjury
        capability: BodyStateCapability
      }
    }
    // parts: {

    //   ears: number
    //   eyes: number
    //   teeth: number
    //   nose: number
    // }
    // internals: {
    //   brain: number
    // }
  }

  export enum PierceInjuryEnum {
    'all_right',
    'slightly_wounded',
    'wounded',
    'heavily_wounded',
  }

  export enum CrushInjuryEnum {
    'all_right',
    'crumpled',
    'broken',
    'smitten',
  }

  export enum BurnInjuryEnum {
    'all_right',
    'burn',
    'severe_burn',
    'incinerated',
  }
  export interface IInjury {
    crush: {
      condition: CrushInjuryEnum
      damage: number
    }
    pierce: {
      condition: PierceInjuryEnum
      damage: number
    }
    burn: {
      condition: BurnInjuryEnum
      damage: number
    }
  }

  export type InjuryType = 'crush' | 'pierce' | 'burn'
}
