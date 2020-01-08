import React from 'react'
import { Pawn } from '@Modules/Pawn/Pawn'
import { PawnListElement, PawnListWrapper } from './styled/index'
import { ActionsController } from '@Controllers/ActionsController'
import UI from '@UI/index'

interface IProps {
  pawns: Pawn[]
  actionController: ActionsController
  playerInAction?: boolean
}

const PawnList: React.FC<IProps> = (props: IProps) => {
  return (
    <PawnListWrapper>
      <UI.Title bordered>
        <span>Present in area</span>
      </UI.Title>
      {props.playerInAction ? (
        <PawnListElement onClick={() => {}}>
          <UI.RegularText>Player</UI.RegularText>
          <img src="inspection.svg" />
        </PawnListElement>
      ) : null}
      {props.pawns.map(pawn => (
        <PawnListElement onClick={() => props.actionController.Dialogue('start_conversation', pawn)} key={pawn.key}>
          <UI.RegularText hoverable>{pawn.alias}</UI.RegularText>
          <img src="inspection.svg" />
        </PawnListElement>
      ))}
    </PawnListWrapper>
  )
}

export default PawnList
