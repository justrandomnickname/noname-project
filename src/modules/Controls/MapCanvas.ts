/* eslint-disable prefer-const */
import { MapSchema } from '@Map/interfaces/MapSchema'
import { Delaunay } from 'd3-delaunay'
import { MapControls } from '@Controls/interfaces/MapCanvas'
import Canvas from '@Map/assembly/Canvas'

const getMousePos = (renderer: Canvas, event: MouseEvent): { x: number; y: number } => {
  const canvasRect = renderer.canvas.getBoundingClientRect()
  const mouseX: number = event.clientX - canvasRect.left
  const mouseY = event.clientY - canvasRect.top
  const panX = renderer.position[0] * renderer.zoomfactor + (-(renderer.zoomfactor - 1) * renderer.canvasWidth) / 2
  const panY = renderer.position[1] * renderer.zoomfactor + (-(renderer.zoomfactor - 1) * renderer.canvasHeight) / 2

  const mouseTX = (mouseX - panX) / renderer.zoomfactor
  const mouseTY = (mouseY - panY) / renderer.zoomfactor

  console.log('CURRENT WIDTH', renderer.width)
  console.log('(X)', mouseTX / renderer.scale[0])
  console.log('(Y)', mouseTY / renderer.scale[1])
  return {
    x: mouseTX / renderer.scale[0],
    y: mouseTY / renderer.scale[1],
  }
}

export default function MainMapControls(payload: { renderer: Canvas; map: MapSchema }): MapControls {
  const { renderer, map } = payload
  const { canvas } = renderer
  const delaunay = Delaunay.from(map.points)
  let isClicked = false
  let screenX = 0
  let screenY = 0
  const onClick = (onClickCallback: (point: number) => void): void => {
    canvas.onclick = (event: MouseEvent) => {
      const mousePosition = getMousePos(renderer, event)
      const index = delaunay.find(mousePosition.x, mousePosition.y)
      renderer.testRoutePush([mousePosition.x, mousePosition.y])
      onClickCallback(index)
    }
  }

  canvas.onmousedown = (event: MouseEvent): void => {
    isClicked = true
    screenX = event.screenX
    screenY = event.screenY
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canvas.onmouseup = (event: MouseEvent): void => {
    isClicked = false
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onWheel = (callback: any): void => {
    canvas.onwheel = (event: MouseEvent) => {
      callback(event, { screenX, screenY })
      event.preventDefault()
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onDrag = (callback: any): void => {
    canvas.onmousemove = (event: MouseEvent) => {
      if (isClicked) {
        callback(event, { screenX, screenY })
        screenX = event.screenX
        screenY = event.screenY
      }
    }
  }

  return {
    onClick: onClick,
    onWheel: onWheel,
    onDrag: onDrag,
  }
}
