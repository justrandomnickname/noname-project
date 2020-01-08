/* eslint-disable */

import { CanvasPulseBuilder, CanvasPulse, EventType, Event, ControlType } from '../interfaces/CanvasPulseBuilder'

type Events = { [id: string]: Event<Function> }

class Base implements CanvasPulse {
  public width: number
  public height: number
  public canvasWidth: number
  public canvasHeight: number
  public zoom: number = 1
  public ctx: CanvasRenderingContext2D
  private scale: number[] = [1, 1]
  private position: number[] = [0, 0]
  private canvas: HTMLCanvasElement
  private isClicked: boolean = false
  private events: Event<Function>[] = []
  private currentScreen: number[] = [1, 1]
  constructor(canvas: HTMLCanvasElement, payload: CanvasPulseBuilder) {
    this.width = payload.width
    this.height = payload.height
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D
    if (payload.canvasWidth) {
      this.canvasWidth = payload.canvasWidth
      this.scale[0] = payload.canvasWidth / payload.width
    } else {
      this.canvasWidth = payload.width
    }
    if (payload.canvasHeight) {
      this.canvasHeight = payload.canvasHeight
      this.scale[1] = payload.canvasHeight / payload.height
    } else {
      this.canvasHeight = payload.height
    }
  }

  public draw(callback: (ctx: CanvasRenderingContext2D) => void): void {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.ctx.setTransform(
      this.zoom * this.scale[0],
      0,
      0,
      this.zoom * this.scale[1],
      this.position[0] * this.zoom + (-(this.zoom - 1) * this.canvasWidth) / 2,
      this.position[1] * this.zoom + (-(this.zoom - 1) * this.canvasHeight) / 2,
    )
    callback(this.ctx)
  }

  public registerControls(type: ControlType) {
    if (type === 'draggable') {
      this.registerEvent({
        callback: (event: MouseEvent) => {
          this.isClicked = true
          this.currentScreen = [event.screenX, event.screenY]
        },
        type: 'onmousedown',
      })
      this.registerEvent({
        callback: () => {
          this.isClicked = false
        },
        type: 'onmouseup',
      })
      this.registerEvent({
        callback: (event: MouseEvent) => {
          if (this.isClicked) {
            const newPosX = event.screenX - this.currentScreen[0]
            const newPosY = event.screenY - this.currentScreen[1]
            console.log(newPosX, newPosY)
            this.position[0] += newPosX / this.zoom
            this.position[1] += newPosY / this.zoom
            this.currentScreen = [event.screenX, event.screenY]
          }
        },
        type: 'onmousemove',
      })
    }
    if (type === 'zoomable') {
      this.registerEvent({
        callback: (event: MouseWheelEvent) => {
          if (event.deltaY < 0) {
            this.zoom *= 1.1
          }
          if (event.deltaY > 0) {
            this.zoom /= 1.1
          }
        },
        type: 'onwheel',
      })
      return this
    }
  }

  public registerEvent(event: Event<Function>) {
    this.events.push(event)
  }

  public getMousePos(event: MouseEvent) {
    const canvasRect = this.canvas.getBoundingClientRect()
    const mouseX = event.clientX - canvasRect.left
    const mouseY = event.clientY - canvasRect.top
    const panX = this.position[0] * this.zoom + (-(this.zoom - 1) * this.canvasWidth) / 2
    const panY = this.position[1] * this.zoom + (-(this.zoom - 1) * this.canvasHeight) / 2

    const mouseTX = (mouseX - panX) / this.zoom
    const mouseTY = (mouseY - panY) / this.zoom
    return [mouseTX / this.scale[0], mouseTY / this.scale[1]]
  }

  public enableControls() {
    this.canvas.onmousedown = (mouseEvent: MouseEvent) => {
      let i = -1
      let n = this.events.length
      while (++i < n) {
        let event: Event<Function> = this.events[i]
        if (event.type === 'onmousedown') {
          event.callback(mouseEvent)
        }
      }
    }
    this.canvas.onmouseup = (mouseEvent: MouseEvent) => {
      let i = -1
      let n = this.events.length
      while (++i < n) {
        let event: Event<Function> = this.events[i]
        if (event.type === 'onmouseup') {
          event.callback(mouseEvent)
        }
      }
      this.canvas.onmousemove = (mouseEvent: MouseEvent) => {
        let i = -1
        let n = this.events.length
        while (++i < n) {
          let event: Event<Function> = this.events[i]
          if (event.type === 'onmousemove') {
            event.callback(mouseEvent)
          }
        }
      }
      this.canvas.onwheel = (mouseEvent: MouseWheelEvent) => {
        let i = -1
        let n = this.events.length
        while (++i < n) {
          let event: Event<Function> = this.events[i]
          if (event.type === 'onwheel') {
            event.callback(mouseEvent)
          }
        }
      }
    }
  }
}

export default Base
