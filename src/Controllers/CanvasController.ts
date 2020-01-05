import Renderer from '@Map/assembly/Renderer'
import { IMapSchema } from '@Map/interfaces/MapSchema'
import CanvasPulse from '../libs/CanvasPulse/src/index'
import { IPolygon } from '@Map/interfaces/Polygon'

interface ICanvasController {
  Run(): void
  Stop(): void
}

class CanvasController implements ICanvasController {
  public canvas: CanvasPulse
  private chosenPolygon: IPolygon | undefined
  private map: IMapSchema
  private requestFrame = 0
  private fps = 1000 / 40 // 60 fps
  constructor(
    map: IMapSchema,
    canvas: HTMLCanvasElement,
    payload: { width: number; height: number; mapWidth: number; mapHeight: number },
  ) {
    this.canvas = new CanvasPulse(canvas, {
      width: payload.mapWidth,
      height: payload.mapHeight,
      canvasWidth: payload.width,
      canvasHeight: payload.height,
    })
    this.map = map
  }
  public Run() {
    Renderer.AddEntity__Dev()
    this.requestFrame = window.setInterval(() => {
      this.RunOnFrame()
    }, 0)
  }
  public Stop() {
    console.log('CANVAS STOPPED')
    clearInterval(this.requestFrame)
  }
  public enableControls(payload: { showPolygonStatistics: (polygon: IPolygon) => void }) {
    this.canvas.registerControls('zoomable')
    this.canvas.registerControls('draggable')
    Renderer.InitDelaunay(this.map)
    this.enablePolygonControls(payload.showPolygonStatistics)
    this.enableEntityControls()
    this.canvas.enableControls()
  }

  private enablePolygonControls(callback: (polygon: IPolygon) => void) {
    this.canvas.registerEvent({
      callback: (event: MouseEvent) => {
        const pose = this.canvas.getMousePos(event)
        const polygon = Renderer.FindPolygon(pose)
        if (polygon) {
          this.chosenPolygon = polygon
          callback(this.chosenPolygon)
        }
      },
      type: 'onmousedown',
    })
  }

  private enableEntityControls() {
    this.canvas.registerEvent({
      callback: () => {
        if (this.chosenPolygon) {
          Renderer.testRoutePush([this.chosenPolygon.coords[0], this.chosenPolygon.coords[1]])
        }
      },
      type: 'onmousedown',
    })
  }
  private RunOnFrame() {
    this.canvas.draw((ctx: CanvasRenderingContext2D) => {
      Renderer.draw(this.map, ctx)
    })
  }
}

export default CanvasController
