import Canvas from '@Map/assembly/Canvas'
import { MapSchema } from '@Map/interfaces/MapSchema'

interface ICanvasController {
  canvas: Canvas
  map: MapSchema
  fps: number
  Run(): void
  Stop(): void
  // SetFps(): void
}

class CanvasController implements ICanvasController {
  public canvas: Canvas
  public map: MapSchema
  public requestFrame = 0
  public fps = 1000 / 60 // 60 fps
  constructor(
    map: MapSchema,
    canvas: HTMLCanvasElement,
    payload: { width: number; height: number; mapWidth: number; mapHeight: number },
  ) {
    this.canvas = new Canvas(canvas, payload)
    this.map = map
  }
  public Run() {
    // this.requestFrame = webkitRequestAnimationFrame(this.RunOnFrame.bind(this))
    this.requestFrame = setInterval(() => {
      this.RunOnFrame()
    }, this.fps)
  }
  public Stop() {
    clearInterval(this.requestFrame)
  }

  public RunOnFrame() {
    this.canvas.draw(this.map)
  }
}

export default CanvasController
