import styles from '@UI/scss/variables.scss'
import { injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class Action implements Action.IAction {
  public _type: Action.ActionTypes
  public _color: Action.ActionColor
  public _pic: string
  public _text: string
  constructor(payload: { type: Action.ActionTypes; pic: string; text: string }) {
    this._type = payload.type
    this._color = Action.ActionColor[payload.type as keyof typeof Action.ActionColor]
    this._pic = payload.pic
    this._text = payload.text
  }
}

export namespace Action {
  export interface IAction {
    _type: ActionTypes
    _color: ActionColor
    _pic: string
    _text: string
  }

  export type ActionTypes = 'usual' | 'anger'
  export enum ActionColor {
    'usual' = 'usual',
    'anger' = 'red',
  }

  export const TYPES = {
      Action: Symbol.for('IAction'),
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(ActionColor as any).usual = `${styles.secondaryColor}`
}
