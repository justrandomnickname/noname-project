import React from 'react'
import { Action } from '@Modules/Location/Action'
import { ActionFactory } from '@Modules/Location/ActionFactory'

export class ActionsController implements ActionController.IActionController {
  private static _actions: Action.IAction[] = []
  private _setState: React.Dispatch<React.SetStateAction<Action.IAction[]>>
  constructor(setState: React.Dispatch<React.SetStateAction<Action.IAction[]>>) {
    this._setState = setState
  }
  public injectActions(type: ActionController.ActionControllerTypes): void {
    switch (type) {
      case 'hideout_basic':
        ActionsController._actions = new ActionFactory()
          .CreateActions('HideoutActions')
          .concat(ActionsController._actions)
        break
      default:
        break
    }
    this.setActions()
  }

  private setActions(): void {
    this._setState([...ActionsController._actions])
  }
}

export namespace ActionController {
  export interface IActionController {
    injectActions(type: ActionControllerTypes): void
  }

  export type ActionControllerTypes = 'hideout_basic'
}
