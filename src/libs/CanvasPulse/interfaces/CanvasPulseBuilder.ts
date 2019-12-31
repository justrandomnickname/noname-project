export interface CanvasPulseBuilder {
  width: number
  height: number
  canvasWidth?: number
  canvasHeight?: number
}

export interface CanvasPulse {
  width: number
  height: number
  canvasWidth: number
  canvasHeight: number
  zoom: number
  ctx: CanvasRenderingContext2D
  draw: (callback: (ctx: CanvasRenderingContext2D) => void) => void
}

export interface Event<T> {
  callback: T
  type: EventType
}

export type ControlType = 'draggable' | 'zoomable'
export type EventType = 'onmousedown' | 'onmouseup' | 'onmousemove' | 'onwheel'
