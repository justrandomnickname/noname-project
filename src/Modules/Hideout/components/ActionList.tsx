import React from 'react'
import UI from '@UI/index'
import { ActionListElement, ActionListContainer, ActionListWrapper } from './styled/index'
import { Action } from '@Modules/Location/Action'

interface IProps {
  actions: Action.IAction[]
}

const ActionList: React.FC<IProps> = (props: IProps) => {
  return (
    <ActionListContainer>
      <ActionListWrapper>
        {props.actions.map((action, index) => (
          <ActionListElement
            isActive={action._isActive}
            onClick={() => (action._isActive ? action._callback() : () => {})}
            color={action._color}
            key={index}
          >
            <img src={action._pic} />
            <UI.GrandText>{action._text}</UI.GrandText>
          </ActionListElement>
        ))}
      </ActionListWrapper>
    </ActionListContainer>
  )
}

export default ActionList
