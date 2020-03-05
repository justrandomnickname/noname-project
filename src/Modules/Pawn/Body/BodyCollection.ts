import { BaseBody } from './BaseBody'

export const HumanoidBody: BaseBody.IBody = {
  ['head']: {
    name: 'Head',
    type: BaseBody.BodyPartTypeEnum['head'],
    condition: {
      hp: 100,
    },
    baseCondition: {
      hp: 100,
    },
    equippable: [BaseBody.EquipmentEnum['head']],
    extra: {
      ['left_eye']: {
        name: 'Left eye',
        type: BaseBody.BodyPartTypeEnum['vision'],
        involvement: 50,
        equippable: 'none',
        condition: {
          hp: 100,
        },
        baseCondition: {
          hp: 100,
        },
      },
      ['right_eye']: {
        name: 'Right eye',
        type: BaseBody.BodyPartTypeEnum['vision'],
        involvement: 50,
        equippable: 'none',
        condition: {
          hp: 100,
        },
        baseCondition: {
          hp: 100,
        },
      },
      ['left_ear']: {
        name: 'Left ear',
        type: BaseBody.BodyPartTypeEnum['hearing'],
        involvement: 50,
        equippable: 'none',
        condition: {
          hp: 100,
        },
        baseCondition: {
          hp: 100,
        },
      },
      ['right_ear']: {
        name: 'Right ear',
        type: BaseBody.BodyPartTypeEnum['hearing'],
        involvement: 50,
        equippable: [BaseBody.EquipmentEnum['ear']],
        condition: {
          hp: 100,
        },
        baseCondition: {
          hp: 100,
        },
      },
      ['lips']: {
        name: 'Lips',
        type: BaseBody.BodyPartTypeEnum['speech'],
        involvement: 25,
        equippable: 'none',
        condition: {
          hp: 100,
        },
        baseCondition: {
          hp: 100,
        },
      },
      ['nose']: {
        name: 'Nose',
        type: BaseBody.BodyPartTypeEnum['decoration'],
        involvement: 100,
        equippable: 'none',
        condition: {
          hp: 100,
        },
        baseCondition: {
          hp: 100,
        },
      },
    },
    internals: {
      ['brain']: {
        name: 'Brain',
        type: BaseBody.BodyPartTypeEnum['brain'],
        involvement: 25,
        equippable: 'none',
        condition: {
          hp: 100,
        },
        baseCondition: {
          hp: 100,
        },
      },
    },
  },
}
