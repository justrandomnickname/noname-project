import React, { useEffect, useRef, useState } from 'react'
import { useWait } from 'react-wait'
import CanvasController from '@Controllers/CanvasController'
import { IMapSchema } from '@Map/interfaces/MapSchema'
import { Wrapper } from '@Map/components/Wrapper'
import UI from '@Core/UI'
import styled from 'styled-components'
import { IPolygon } from '@Map/interfaces/Polygon'

const CanvasElement = styled.canvas`
  width: ${props => props.width + 'px'};
  height: ${props => props.height + 'px'};
  background: ${props => props.theme.primaryColor};
  justify-content: center;
  justify-self: center;
`

interface IProps {
  width: number
  height: number
  map: IMapSchema
}

const Canvas: React.FC<IProps> = (props: IProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [polygon, setPolygon] = useState(props.map.polygons[0])
  const { startWaiting, endWaiting, Wait } = useWait()

  const showPolygonStatistics = (polygon: IPolygon) => {
    setPolygon(polygon)
    endWaiting('polygon')
  }

  useEffect(() => {
    let canvasController: CanvasController
    if (canvasRef.current) {
      const canvas = canvasRef.current
      canvasController = new CanvasController(props.map, canvas, {
        width: props.width,
        height: props.height,
        mapWidth: props.map.width,
        mapHeight: props.map.height,
      })
      startWaiting('polygon')
      canvasController.enableControls({
        showPolygonStatistics,
      })
      canvasController.Run()
    }
    return () => {
      if (canvasController) {
        canvasController.Stop()
      }
    }
  }, [])
  if ('id' in props.map) {
    return (
      <Wrapper>
        <CanvasElement ref={canvasRef} width={props.width} height={props.height} id="canvas"></CanvasElement>
        <Wait on="polygon" fallback={<div></div>}>
          <UI.Title>
            biome: <UI.RegularText>{polygon.type}</UI.RegularText>
          </UI.Title>
          <UI.Title>
            average temp: <UI.RegularText>{polygon.statistics.temp} °C</UI.RegularText>
          </UI.Title>
          <UI.Title>
            current temp: <UI.RegularText>{polygon.statistics.current.temp} °C</UI.RegularText>
          </UI.Title>
          <UI.Title>
            elevation: <UI.RegularText>{polygon.statistics.elevation}</UI.RegularText>
          </UI.Title>
          <UI.Title>
            position:
            <UI.RegularText>
              {polygon.coords[0]} {polygon.coords[1]}
            </UI.RegularText>
          </UI.Title>
        </Wait>
      </Wrapper>
    )
  }
  return <div></div>
}

export default Canvas
