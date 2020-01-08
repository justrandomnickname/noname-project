export abstract class Message {
  private _type: Message.MessageTypes
  private _key: string
  protected abstract _tsx: JSX.Element
  constructor(payload: { type: Message.MessageTypes; key: string }) {
    this._type = payload.type
    this._key = payload.key
  }
  public get type() {
    return this._type
  }
  public get key() {
    return this._key
  }
  public get tsx() {
    return this._tsx
  }
  protected abstract CreateTsx(): JSX.Element
}

export namespace Message {
  export interface IMessage {
    type: MessageTypes
    key: string
    tsx: JSX.Element
    // CreateTsx(): JSX.Element
  }

  export type MessageTypes = 'conversation' | 'description' | 'utils'
}
