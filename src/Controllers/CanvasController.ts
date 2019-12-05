import Canvas from '@Map/assembly/Canvas'
import { IMapSchema } from '@Map/interfaces/MapSchema'

interface ICanvasController {
  Run(): void
  Stop(): void
}

class CanvasController implements ICanvasController {
  public canvas: Canvas
  private map: IMapSchema
  private requestFrame = 0
  private fps = 1000 / 60 // 60 fps
  constructor(
    map: IMapSchema,
    canvas: HTMLCanvasElement,
    payload: { width: number; height: number; mapWidth: number; mapHeight: number },
  ) {
    this.canvas = new Canvas(canvas, payload)
    this.map = map
  }
  public Run() {
    this.requestFrame = setInterval(() => {
      this.RunOnFrame()
    }, this.fps)
  }
  public Stop() {
    clearInterval(this.requestFrame)
  }
  private RunOnFrame() {
    this.canvas.draw(this.map)
  }
}

export default CanvasController
