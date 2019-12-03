import React, { useEffect, useRef, useState } from 'react'
import { useWait } from 'react-wait'
import CanvasController from '@Controllers/CanvasController'
import { MapSchema } from '@Map/interfaces/MapSchema'
import { Wrapper } from '@Map/components/Wrapper'
import UI from '@Core/UI'
import CanvasRenderer from '@Map/assembly/Canvas'
import Controls from '@Controls/MapCanvas'
import styled from 'styled-components'

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
  map: MapSchema
}

const Canvas: React.FC<IProps> = (props: IProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [polygon, setPolygon] = useState(props.map.polygons[0])
  const { startWaiting, endWaiting, Wait } = useWait()

  const registerControls = (canvas: HTMLCanvasElement, renderer: CanvasRenderer) => {
    const controls = Controls({ renderer, map: props.map })
    controls.onClick((point: number) => {
      const polygon = props.map.polygons.find(polygon => polygon.index === point)
      if (polygon) {
        setPolygon(polygon)
        endWaiting('polygon')
      }
    })
    controls.onWheel((event: MouseWheelEvent) => {
      if (event.deltaY < 0) {
        renderer.zoomfactor *= 1.1
      }
      if (event.deltaY > 0) {
        renderer.zoomfactor /= 1.1
      }

      // console.log('ZOOMFACTOR IS', renderer.zoomfactor)
      // console.log('POSITION IS', renderer.position[0], renderer.position[1])
      // renderer.draw(props.map)
    })
    controls.onDrag((event: MouseEvent, current: { screenX: number; screenY: number }) => {
      const newPosX = event.screenX - current.screenX
      const newPosY = event.screenY - current.screenY
      // console.log('NEWPOSX', renderer.position[0])
      renderer.position[0] += newPosX
      renderer.position[1] += newPosY
      // renderer.draw(props.map)
    })
  }

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const canvasController = new CanvasController(props.map, canvas, {
        width: props.width,
        height: props.height,
        mapWidth: props.map.width,
        mapHeight: props.map.height,
      })
      startWaiting('polygon')
      registerControls(canvas, canvasController.canvas)
      canvasController.Run()
    }
    return () => {}
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
