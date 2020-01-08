import { Action } from './Action'
import { Pawn } from '@Modules/Pawn/Pawn'

export class ActionFactory implements ActionFactory.IActionFactory {
  public CreateActions(type: ActionFactory.BaseActionTypes): Action.IAction[] {
    const actions: Action.IAction[] = []
    switch (type) {
      case 'HideoutActions':
        actions.push(
          new Action({
            type: 'routine',
            mood: 'usual',
            pic: ActionFactory.BASE_ACTIONS.hideout_action_1.pic,
            text: ActionFactory.BASE_ACTIONS.hideout_action_1.text,
            key: 'hideout_action_1',
            callback: () => {},
          }),
        )
        actions.push(
          new Action({
            type: 'routine',
            mood: 'usual',
            pic: ActionFactory.BASE_ACTIONS.hideout_action_2.pic,
            text: ActionFactory.BASE_ACTIONS.hideout_action_2.text,
            key: 'hideout_action_2',
            callback: () => {},
          }),
        )
        actions.push(
          new Action({
            type: 'routine',
            mood: 'anger',
            pic: ActionFactory.BASE_ACTIONS.hideout_anger_action.pic,
            text: ActionFactory.BASE_ACTIONS.hideout_anger_action.text,
            key: 'hideout_anger_action',
            callback: () => {},
          }),
        )
        break
      default:
        break
    }
    return actions
  }

  public StartDialogue(pawn: Pawn, endDialogue: () => void): Action.IAction[] {
    const actions: Action.IAction[] = []
    actions.push(
      new Action({
        type: 'conversation',
        mood: 'usual',
        pic: pawn.pic,
        text: `Hello, ${pawn.alias}`,
        key: 'start_conversation_usual',
        callback: () => {},
      }),
    )
    actions.push(
      new Action({
        type: 'conversation',
        mood: 'usual',
        pic: pawn.pic,
        text: '*Leave Conversation*',
        key: 'end_conversation_usual',
        callback: endDialogue,
      }),
    )
    return actions
  }
}

export namespace ActionFactory {
  export interface IActionFactory {
    CreateActions(type: BaseActionTypes): Action.IAction[]
    StartDialogue(pawn: Pawn, callback: () => void): Action.IAction[]
  }

  export const BASE_ACTIONS = {
    hideout_action_1: {
      text: 'Action 1',
      pic: 'vampire.svg',
    },
    hideout_action_2: {
      text: 'Action 2',
      pic: 'vampire.svg',
    },
    hideout_anger_action: {
      text: 'Anger Action',
      pic: 'spellbook.svg',
    },
  }
  export type BaseActionTypes = 'HideoutActions'
}
