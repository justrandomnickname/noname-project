import React from 'react'
import { Guid } from 'guid-typescript'
import ERROR from '../assembly/Error'
import Data from '@Core/Data'
import { IController } from './interfaces/IController'
import { Dialogue } from '@Modules/Location/Messages/Dialogue'
import { Description } from '@Modules/Location/Messages/Description'
import { Message } from '@Modules/Location/Messages/Message'
import { Pawn } from '@Modules/Pawn/Pawn'

export class MessagesController implements MessagesController.IMessagesController {
  private static _messages: Message.IMessage[] = []
  private static _setState: React.Dispatch<React.SetStateAction<Message.IMessage[]>> | null
  constructor(setState?: React.Dispatch<React.SetStateAction<Message.IMessage[]>>) {
    if (setState) {
      MessagesController._setState = setState
    }
  }
  get messages() {
    return MessagesController._messages
  }
  set messages(value: Message.IMessage[]) {
    MessagesController._messages = value
  }

  private MountMessage(message: Message.IMessage): void {
    if (!Guid.isGuid(message.key))
      throw Error(new ERROR('@Location/Location', 'Invalid key for message, expected GUID string').VALUE())
    this.messages.push(message)
    this.Mount()
  }

  private async ShowMessagesSmoothly(messages: Message.IMessage[]): Promise<void> {
    for (let i = 0; i < messages.length; i++) {
      this.MountMessage(messages[i])
      await Data.Sleep(1000)
    }
  }
  public Mount() {
    if (MessagesController._setState) MessagesController._setState([...this.messages])
    else
      throw new Error(
        new ERROR('ActionsController/setActions', 'Cannot mount state into view - setState is not defined').EVENT(),
      )
  }
  public Unmount() {
    MessagesController._setState = null
  }

  public CreateMessage(type: MessagesController.MessagesControllerTypes, pawn: Pawn.IPawn) {
    switch (type) {
      case 'start_conversation':
        const message1 = new Dialogue({
          type: 'conversation',
          text: `Hello, i am your pawn. My name is ${pawn.alias}`,
          key: Data.GetPublicKey(this.messages),
          pawn: {
            pic: pawn.pic,
          },
        })
        const message2 = new Dialogue({
          type: 'conversation',
          text: 'What can i do for you?',
          key: Data.GetPublicKey(this.messages),
          pawn: {
            pic: pawn.pic,
          },
        })
        this.ShowMessagesSmoothly([message1, message2])
        break
      case 'end_conversation':
        const message = new Dialogue({
          type: 'conversation',
          text: 'Okay, bye then!',
          key: Data.GetPublicKey(this.messages),
          pawn: {
            pic: pawn.pic,
          },
        })
        this.MountMessage(message)
        break
      default:
        break
    }
  }

  public CreateDescription(type: MessagesController.MessagesControllerDescriptionTypes) {
    const description = new Description({
      type: 'description',
      text: MessagesController.MESSAGES[type as keyof typeof MessagesController.MESSAGES],
      key: Data.GetPublicKey(this.messages),
    })
    this.MountMessage(description)
  }
}

export namespace MessagesController {
  export interface IMessagesController extends IController {
    messages: Message.IMessage[]
  }
  export type MessagesControllerTypes = 'start_conversation' | 'end_conversation'
  export type MessagesControllerDescriptionTypes = 'hideout_description'

  export const MESSAGES = {
    hideout_description: [
      'At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
    ],
  }
}
