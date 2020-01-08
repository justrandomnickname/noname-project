import styles from '@UI/scss/variables.scss'
import { injectable } from 'inversify'
import 'reflect-metadata'

@injectable()
export class Action implements Action.IAction {
  public _type: Action.ActionTypes
  public _mood: Action.ActionMoods
  public _color: Action.ActionColor
  public _pic: string
  public _text: string
  public _key: string
  public _isActive = true
  public _callback: () => void
  constructor(payload: {
    type: Action.ActionTypes
    mood: Action.ActionMoods
    pic: string
    text: string
    key: string
    callback: () => void
  }) {
    this._type = payload.type
    this._mood = payload.mood
    this._color = Action.ActionColor[payload.mood as keyof typeof Action.ActionColor]
    this._pic = payload.pic
    this._key = payload.key
    this._text = payload.text
    this._callback = payload.callback
  }
}

export namespace Action {
  export interface IAction {
    _type: ActionTypes
    _mood: ActionMoods
    _color: ActionColor
    _pic: string
    _text: string
    _isActive: boolean
    _callback: () => void
  }

  export type ActionMoods = 'usual' | 'anger'
  export type ActionTypes = 'routine' | 'important' | 'conversation'
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
