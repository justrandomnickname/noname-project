import { Action } from './Action'

export class ActionFactory implements ActionFactory.IActionFactory {
  public CreateActions(type: ActionFactory.BaseActionTypes): Action.IAction[] {
    const actions: Action.IAction[] = []
    switch (type) {
      case 'HideoutActions':
        actions.push(
          new Action({
            type: 'usual',
            pic: 'vampire.svg',
            text: 'Action 1',
          }),
        )
        actions.push(
          new Action({
            type: 'usual',
            pic: 'vampire.svg',
            text: 'Action 2',
          }),
        )
        actions.push(
          new Action({
            type: 'anger',
            pic: 'spellbook.svg',
            text: 'Anger action',
          }),
        )
        break
      default:
        break
    }
    return actions
  }
}

export namespace ActionFactory {
  export interface IActionFactory {
    CreateActions(type: BaseActionTypes): void
  }
  export type BaseActionTypes = 'HideoutActions'
}
