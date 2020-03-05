import React from 'react'
import Data from '@Core/Data'
import { IController } from './interfaces/IController'
import { MessagesController } from './MessagesController'
import ERROR from '../assembly/Error'
import { Action } from '@Modules/Location/Action'
import { ActionFactory } from '@Modules/Location/ActionFactory'
import { Pawn } from '@Modules/Pawn/Pawn'

export class ActionsController implements ActionsController.IActionController {
  private static _actions: Action.IAction[] = []
  private static _setState: React.Dispatch<React.SetStateAction<Action.IAction[]>> | null = null
  private messagesController: MessagesController
  constructor(setState?: React.Dispatch<React.SetStateAction<Action.IAction[]>>) {
    if (setState) {
      ActionsController._setState = setState
    }
    this.messagesController = new MessagesController()
    // this.EndDialogue = this.EndDialogue.bind(this)
    this.Mount = this.Mount.bind(this)
  }
  get actions() {
    return ActionsController._actions
  }
  set actions(value: Action.IAction[]) {
    ActionsController._actions = value
  }
  public Unmount(): void {
    ActionsController._setState = null
  }
  public Mount(): void {
    if (ActionsController._setState) ActionsController._setState([...this.actions])
    else
      throw new Error(
        new ERROR('ActionsController/setActions', 'Cannot mount state into view - setState is not defined').EVENT(),
      )
  }

  public InjectActions(type: ActionsController.ActionControllerTypes): void {
    switch (type) {
      case 'hideout_basic':
        this.actions = new ActionFactory().CreateActions('HideoutActions').concat(this.actions)
        break
      default:
        break
    }
    this.Mount()
  }

  // private HandleConversation(type: string): void {}

  public Dialogue(type: MessagesController.MessagesControllerTypes, pawn: Pawn.IPawn): void {
    switch (type) {
      case 'start_conversation':
        const isActiveConversation = this.actions.find(action => action._type === 'conversation')
        if (!isActiveConversation) {
          this.SetActive(false)
          this.actions = new ActionFactory()
            .StartDialogue(
              pawn,
              Data.thunkate(() => {
                this.EndDialogue(pawn)
              }),
            )
            .concat(this.actions)
          this.messagesController.CreateMessage(type, pawn)
          this.Mount()
        }
        break
      default:
        break
    }
  }

  private FilterByType(type: ActionsController.ActionControllerTypes) {
    this.actions = this.actions.filter(action => action._type !== type)
  }

  private EndDialogue(pawn: Pawn.IPawn) {
    this.FilterByType('conversation')
    this.messagesController.CreateMessage('end_conversation', pawn)
    this.SetActive(true)
    this.Mount()
  }

  private SetActive(bool: boolean, types?: ActionsController.ActionControllerTypes[]) {
    if (types) {
      types.forEach(type => {
        this.actions.map(action => {
          if (action._type === type) action._isActive = bool
        })
      })
    } else {
      this.actions.map(action => (action._isActive = bool))
    }
  }
}

export namespace ActionsController {
  export interface IActionController extends IController {
    actions: Action.IAction[]
    InjectActions(type: ActionControllerTypes): void
  }

  export type ActionControllerTypes = 'hideout_basic' | 'conversation'
}
