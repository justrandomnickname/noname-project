import React from 'react'
import UI from '@UI/index'
import { LivestockElement, LivestockContainer } from './styled/index'
import { Livestock } from '@Modules/Location/Livestock'

interface IProps {
  resources: Livestock.IResource[]
}

const LivestockComponent: React.FC<IProps> = (props: IProps) => (
  <LivestockContainer>
    {props.resources.map((resource, index) => (
      <LivestockElement key={index}>
        <UI.RegularText>
          {resource.name}: {resource.amount}
        </UI.RegularText>
      </LivestockElement>
    ))}
  </LivestockContainer>
)

export default LivestockComponent
