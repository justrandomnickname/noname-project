import { IMapSchema } from '@Map/interfaces/MapSchema'
import { IPolygon } from '@Map/interfaces/Polygon'
import { MapWidth, MapHeight, EquatorExtremums } from '@Map/interfaces/Generator'
import { IActiveEntity } from '../assembly/interfaces/IActiveEntity'
import ActiveEntity from './ActiveEntity'

class Canvas {
  public canvas: HTMLCanvasElement
  public context: CanvasRenderingContext2D
  public MAP_VIEWPORT = 1
  public position: number[]
  public width: number
  public height: number
  public canvasWidth: number
  public canvasHeight: number
  public scale: number[]
  public zoomfactor = 1
  private ActiveEntities: IActiveEntity[] = []
  constructor(
    canvas: HTMLCanvasElement,
    payload: { width: number; height: number; mapWidth: MapWidth; mapHeight: MapHeight },
  ) {
    const scaleX = payload.width / payload.mapWidth
    const scaleY = payload.height / payload.mapHeight
    this.scale = [scaleX, scaleY]
    this.canvas = canvas
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D
    this.width = payload.mapWidth
    this.height = payload.mapHeight
    this.canvasWidth = payload.width
    this.canvasHeight = payload.height
    this.position = [0, 0]

    this.ActiveEntities.push(new ActiveEntity('DEVELOP', [1000, 1000]))
  }

  public testRoutePush(coordinates: number[]) {
    this.ActiveEntities[0].EstablishPath(coordinates)
  }

  public draw(map: IMapSchema) {
    const { zoomfactor } = this
    this.context.clearRect(0, 0, this.width, this.height)
    this.context.setTransform(
      zoomfactor * this.scale[0],
      0,
      0,
      zoomfactor * this.scale[1],
      this.position[0] * zoomfactor + (-(zoomfactor - 1) * this.canvasWidth) / 2,
      this.position[1] * zoomfactor + (-(zoomfactor - 1) * this.canvasHeight) / 2,
    )
    this.context.lineWidth = 1
    let index = map.polygons.length - 1
    do {
      this.drawPolygon(map.polygons[index])
    } while (--index >= 0)

    if (process.env.NODE_ENV === 'development') {
      this.drawDevTools()
    }
    this.DrawEntities()
  }

  public drawPolygon(polygon: IPolygon) {
    let index = polygon.shapes.length - 1
    this.context.beginPath()
    this.context.strokeStyle = polygon.strokeStyle
    this.context.fillStyle = polygon.fillStyle
    this.context.moveTo(polygon.shapes[0][0], polygon.shapes[0][1])
    do {
      this.context.lineTo(polygon.shapes[index][0], polygon.shapes[index][1])
    } while (--index >= 0)
    this.context.fill()
    this.context.stroke()
    this.context.closePath()
  }

  public DrawEntities() {
    for (let i = 0; i < this.ActiveEntities.length; i++) {
      const current = this.ActiveEntities[i]
      if (current.isActive) current.FollowRouteOnTick()
      this.DrawEntity(current)
    }
  }

  private DrawEntity(entity: IActiveEntity) {
    this.context.beginPath()
    this.context.arc(entity.position[0], entity.position[1], 30, 0, 2 * Math.PI, false)
    this.context.stroke()
    this.context.closePath()
  }

  public drawDevTools() {
    const equatorExtMax = this.height / 2 - (this.height / 100) * EquatorExtremums.default
    const equatorExtMin = this.height / 2 + (this.height / 100) * EquatorExtremums.default
    const closeToEquatorExtMax = this.height / 2 - (this.height / 100) * EquatorExtremums.closeTo
    const closeToEquatorExtMin = this.height / 2 + (this.height / 100) * EquatorExtremums.closeTo

    this.context.lineWidth = 4
    this.context.strokeStyle = 'black'

    // equator
    this.context.beginPath()
    this.context.moveTo(0, equatorExtMax)
    this.context.lineTo(this.width, equatorExtMax)
    this.context.stroke()
    this.context.closePath()

    this.context.beginPath()
    this.context.moveTo(0, equatorExtMin)
    this.context.lineTo(this.width, equatorExtMin)
    this.context.stroke()
    this.context.closePath()

    this.context.beginPath()
    this.context.moveTo(0, closeToEquatorExtMax)
    this.context.lineTo(this.width, closeToEquatorExtMax)
    this.context.stroke()
    this.context.closePath()

    this.context.beginPath()
    this.context.moveTo(0, closeToEquatorExtMin)
    this.context.lineTo(this.width, closeToEquatorExtMin)
    this.context.stroke()
    this.context.closePath()

    // actual center
    // this.context.beginPath()
    // this.context.arc(this.width / 2, this.height / 2, 100, 0, 2 * Math.PI, false)
    // this.context.stroke()
    // this.context.closePath()
  }
}

export default Canvas
