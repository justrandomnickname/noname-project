// import React from 'react'
// import { Guid } from 'guid-typescript'
// import Data from '@Core/Data'
// import ERROR from '../../assembly/Error'
// import UI from '@UI/index'
// import { DescriptionElement, DialogContainer, DialogAction } from '../Hideout/views/Hideout'
// import { ActionsController } from '@Controllers/ActionsController'

// export class Location implements Location.ILocation {
//   public messages: Location.IMessage[] = []
//   private setState: React.Dispatch<React.SetStateAction<JSX.Element[]>>
//   constructor(setState: React.Dispatch<React.SetStateAction<JSX.Element[]>>) {
//     this.setState = setState
//   }

//   private PushMessage(message: Location.IMessage): void {
//     console.log(message)
//     if (!Guid.isGuid(message.key))
//       throw Error(new ERROR('@Location/Location', 'Invalid key for message, expected GUID string').VALUE())
//     this.messages.push(message)
//     this.setState(state => [...state, message.tsx])
//   }

//   private async ShowMessagesSmoothly(messages: Location.IMessage[]): Promise<void> {
//     for (let i = 0; i < messages.length; i++) {
//       this.PushMessage(messages[i])
//       await Data.Sleep(2000)
//     }
//   }

//   public CreateDescriptionMessage(text: string): void {
//     const key = Data.GetPublicKey(this.messages)
//     const message: Location.IMessage = {
//       type: 'utils',
//       key,
//       tsx: (
//         <DescriptionElement key={key}>
//           <UI.RegularText>{text}</UI.RegularText>
//         </DescriptionElement>
//       ),
//     }
//     this.PushMessage(message)
//   }

//   public StartConversation(text: string, avatar: string, pawn: string): void {
//     const key1 = Data.GetPublicKey(this.messages)
//     const message1: Location.IMessage = {
//       type: 'conversation',
//       key: key1,
//       tsx: (
//         <DescriptionElement key={key1}>
//           <DialogContainer>
//             <img src={avatar} />
//             <DialogAction>
//               <UI.GrandText>{text}</UI.GrandText>
//             </DialogAction>
//           </DialogContainer>
//         </DescriptionElement>
//       ),
//     }
//     const key2 = Data.GetPublicKey(this.messages)
//     const message2: Location.IMessage = {
//       type: 'conversation',
//       key: key2,
//       tsx: (
//         <DescriptionElement key={key2}>
//           <DialogContainer>
//             <img src={avatar} />
//             <DialogAction>
//               <UI.GrandText>{text}</UI.GrandText>
//             </DialogAction>
//           </DialogContainer>
//         </DescriptionElement>
//       ),
//     }

//     this.ShowMessagesSmoothly([message1, message2])
//   }
// }

// export namespace Location {
//   export interface ILocation {
//     messages: IMessage[]
//     CreateDescriptionMessage(text: string): void
//   }

//   export interface IMessage {
//     type: MessageTypes
//     key: string
//     tsx: JSX.Element
//   }

//   export type MessageTypes = 'conversation' | 'description' | 'utils'
// }
