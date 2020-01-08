import { Delaunay } from 'd3-delaunay'
import { IMapSchema } from '@Map/interfaces/MapSchema'
import { IPolygon } from '@Map/interfaces/Polygon'
import { IActiveEntity } from '../assembly/interfaces/IActiveEntity'
import ActiveEntity from './ActiveEntity'

export class Renderer {
  // public canvas: HTMLCanvasElement
  // public context: CanvasRenderingContext2D
  // public MAP_VIEWPORT = 1
  // public position: number[]
  // public width: number
  // public height: number
  // public canvasWidth: number
  // public canvasHeight: number
  // public scale: number[]
  // public zoomfactor = 1
  private static delaunay: Delaunay<IMapSchema>
  private static MapSchema: IMapSchema
  private static ActiveEntities: IActiveEntity[] = []
  // constructor(
  //   canvas: HTMLCanvasElement,
  //   payload: { width: number; height: number; mapWidth: MapWidth; mapHeight: MapHeight },
  // ) {
  //   const scaleX = payload.width / payload.mapWidth
  //   const scaleY = payload.height / payload.mapHeight
  //   this.scale = [scaleX, scaleY]
  //   this.canvas = canvas
  //   this.context = canvas.getContext('2d') as CanvasRenderingContext2D
  //   this.width = payload.mapWidth
  //   this.height = payload.mapHeight
  //   this.canvasWidth = payload.width
  //   this.canvasHeight = payload.height
  //   this.position = [0, 0]

  //   this.ActiveEntities.push(new ActiveEntity('DEVELOP', [1000, 1000]))
  // }
  public static InitDelaunay(map: IMapSchema) {
    Renderer.MapSchema = map
    Renderer.delaunay = Delaunay.from(map.points)
  }

  public static AddEntity__Dev() {
    Renderer.ActiveEntities.push(new ActiveEntity('DEVELOP', [1000, 1000]))
  }

  public static testRoutePush(coordinates: number[]) {
    Renderer.ActiveEntities[0].EstablishPath(coordinates)
  }

  public static FindPolygon(coordinates: number[]): IPolygon | undefined {
    if (this.delaunay) {
      const i = Renderer.delaunay.find(coordinates[0], coordinates[1])
      const polygon = Renderer.MapSchema.polygons.find(poly => poly.index === i)
      if (polygon) {
        return polygon
      }
    }
  }

  public static draw(map: IMapSchema, ctx: CanvasRenderingContext2D) {
    // const { zoomfactor } = this
    // this.context.clearRect(0, 0, this.width, this.height)
    // this.context.setTransform(
    //   zoomfactor * this.scale[0],
    //   0,
    //   0,
    //   zoomfactor * this.scale[1],
    //   this.position[0] * zoomfactor + (-(zoomfactor - 1) * this.canvasWidth) / 2,
    //   this.position[1] * zoomfactor + (-(zoomfactor - 1) * this.canvasHeight) / 2,
    // )
    ctx.lineWidth = Renderer.ConstantValues.POLYGON_LINE_WIDTH
    let index = map.polygons.length - 1
    do {
      Renderer.DrawPolygon(map.polygons[index], ctx)
    } while (--index >= 0)

    // if (process.env.NODE_ENV === 'development') {
    //   Renderer.drawDevTools()
    // }
    Renderer.DrawEntities(ctx)
  }

  private static DrawPolygon(polygon: IPolygon, ctx: CanvasRenderingContext2D) {
    let index = polygon.shapes.length - 1
    ctx.beginPath()
    ctx.strokeStyle = '#292826'
    ctx.fillStyle = polygon.fillStyle
    ctx.moveTo(polygon.shapes[0][0], polygon.shapes[0][1])
    do {
      ctx.lineTo(polygon.shapes[index][0], polygon.shapes[index][1])
    } while (--index >= 0)
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
  }

  private static DrawEntities(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < Renderer.ActiveEntities.length; i++) {
      const current = Renderer.ActiveEntities[i]
      if (current.isActive) current.FollowRouteOnTick()
      this.DrawEntity(current, ctx)
    }
  }

  private static DrawEntity(entity: IActiveEntity, ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.arc(entity.position[0], entity.position[1], 10, 0, 2 * Math.PI, false)
    ctx.stroke()
    ctx.closePath()
  }

  // public drawDevTools() {
  //   const equatorExtMax = this.height / 2 - (this.height / 100) * EquatorExtremums.default
  //   const equatorExtMin = this.height / 2 + (this.height / 100) * EquatorExtremums.default
  //   const closeToEquatorExtMax = this.height / 2 - (this.height / 100) * EquatorExtremums.closeTo
  //   const closeToEquatorExtMin = this.height / 2 + (this.height / 100) * EquatorExtremums.closeTo

  //   this.context.lineWidth = 4
  //   this.context.strokeStyle = 'black'

  //   // equator
  //   this.context.beginPath()
  //   this.context.moveTo(0, equatorExtMax)
  //   this.context.lineTo(this.width, equatorExtMax)
  //   this.context.stroke()
  //   this.context.closePath()

  //   this.context.beginPath()
  //   this.context.moveTo(0, equatorExtMin)
  //   this.context.lineTo(this.width, equatorExtMin)
  //   this.context.stroke()
  //   this.context.closePath()

  //   this.context.beginPath()
  //   this.context.moveTo(0, closeToEquatorExtMax)
  //   this.context.lineTo(this.width, closeToEquatorExtMax)
  //   this.context.stroke()
  //   this.context.closePath()

  //   this.context.beginPath()
  //   this.context.moveTo(0, closeToEquatorExtMin)
  //   this.context.lineTo(this.width, closeToEquatorExtMin)
  //   this.context.stroke()
  //   this.context.closePath()

  //   // actual center
  //   // this.context.beginPath()
  //   // this.context.arc(this.width / 2, this.height / 2, 100, 0, 2 * Math.PI, false)
  //   // this.context.stroke()
  //   // this.context.closePath()
  // }
}

export namespace Renderer {
  export enum ConstantValues {
    POLYGON_LINE_WIDTH = 4,
  }
}

export default Renderer
