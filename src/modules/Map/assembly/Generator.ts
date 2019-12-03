import CoreMath from '@Core/Math'
import {
  MapGeneratorContract,
  MapSize,
  NumberOfPoints,
  LloydIterations,
  MapHeight,
  MapWidth,
  BorderIterations,
  EquatorExtremums,
} from '@Map/interfaces/Generator'
import { Polygon, FillStyle, StrokeStyle, PolygonTypes } from '@Map/interfaces/Polygon'
import { Delaunay } from 'd3-delaunay'
import { Guid } from 'guid-typescript'

/**
 * the base class for generating Maps
 * @public @sealed
 * @SANITY_UNDER_ATTACK
 */
class Generator implements MapGeneratorContract {
  /**{@inheritdoc} MapGeneratorContract */
  public id = Guid.create().toJSON().value
  public type: string
  public size: MapSize
  public points: Array<number[]> = []
  public polygons: Polygon[] = []
  public width: number
  public height: number
  public delaunay: Delaunay<[]> = new Delaunay([])
  constructor(payload: MapGeneratorContract) {
    this.type = payload.type
    this.size = payload.size
    this.width = MapWidth[payload.size]
    this.height = MapHeight[payload.size]
  }

  /**
   * starts to generate map points depends of preassigned size parameter
   */
  public create() {
    this.generateMapPoints(this.size)
  }

  public createVoronoiAndLloydify(payload: { iterations: number } = { iterations: LloydIterations[this.size] }) {
    for (let i = 0; i < payload.iterations; i++) {
      this.createVoronoiPolygons()
      this.relaxVoronoiPolygons()
    }
    this.defineBorders()
    this.makeSeaCloseToBorders()
  }

  public generatePlots() {
    this.shapeBorders({ iterations: 2 })
    this.createRandomPlots('SEA', { amount: 5, size: 2 })
    this.createRandomPlots('FOREST', { amount: 40, size: 2 })
    this.createRandomPlots('GRASSLAND', { amount: 60, size: 3 })
    this.createRandomPlots('MOUNTAINS', { amount: 20, size: 4 })
    this.shapeBorders({ iterations: 1 })
  }

  public generateTemperature(modifier: number) {
    const n = this.polygons.length
    const [equatorExtMin, equatorExtMax] = CoreMath.getExtremum(this.height, EquatorExtremums.default)
    const [closeToEquatorExtMin, closeToEquatorExtMax] = CoreMath.getExtremum(this.height, EquatorExtremums.closeTo)
    let i = -1
    console.warn('Equator extremums', equatorExtMax, equatorExtMin)
    console.warn('Close to equator extremums', closeToEquatorExtMax, closeToEquatorExtMin)
    while (++i < n) {
      let localModifierMin = 16
      let localModifierMax = 22
      const heightPosition = this.polygons[i].coords[1]
      const isInEquatorExtremum = heightPosition >= equatorExtMax && heightPosition <= equatorExtMin
      const isCloseToEquatorExtremum = heightPosition >= closeToEquatorExtMax && heightPosition <= closeToEquatorExtMin
      if (isInEquatorExtremum) {
        localModifierMin += 7
        localModifierMax += 7
      } else if (!isInEquatorExtremum && isCloseToEquatorExtremum) {
        localModifierMin += 4.5
        localModifierMax += 4.5
      }
      const random = this.maxMin(localModifierMin, localModifierMax) + modifier
      this.polygons[i].statistics.temp = Number.parseFloat(random.toFixed(1))
    }

    i = -1

    while (++i < n) {
      let average = 0
      const polygon = this.polygons[i]
      const neighbors = this.getNeighbors(polygon)
      // for (let index = neighbors.length - 1; index >= 0; index--) {
      //   const newNeighbors = this.getNeighbors(neighbors[index])
      //   neighbors = neighbors.concat(newNeighbors)
      // }
      average = neighbors.reduce((accumulator: number, polygon: Polygon) => accumulator + polygon.statistics.temp, 0)
      average /= neighbors.length
      const random = Number.parseFloat(average.toFixed(1))
      const currentTemp = this.maxMin(random - 20, random + 20)
      polygon.statistics.temp = random
      polygon.statistics.current.temp = Number.parseFloat(currentTemp.toFixed(1))
    }

    i = -1

    while (++i < n) {
      let average = 0
      const polygon = this.polygons[i]
      let neighbors = this.getNeighbors(polygon)
      for (let index = neighbors.length - 1; index >= 0; index--) {
        const newNeighbors = this.getNeighbors(neighbors[index])
        neighbors = neighbors.concat(newNeighbors)
      }
      average = neighbors.reduce(
        (accumulator: number, polygon: Polygon) => accumulator + polygon.statistics.current.temp,
        0,
      )
      average /= neighbors.length
      const random = Number.parseFloat(average.toFixed(1))
      polygon.statistics.current.temp = random
    }

    let totalAverage = this.polygons.reduce(
      (accumulator: number, polygon: Polygon) => accumulator + polygon.statistics.temp,
      0,
    )
    let totalAverageCurrent = this.polygons.reduce(
      (accumulator: number, polygon: Polygon) => accumulator + polygon.statistics.current.temp,
      0,
    )
    totalAverage /= this.polygons.length
    totalAverageCurrent /= this.polygons.length

    console.warn('TOTAL AVERAGE', totalAverage.toFixed(1), '°C')
    console.warn('TOTAL AVERAGE CURRENT', totalAverageCurrent.toFixed(1), '°C')
  }

  public setFillStyles() {
    for (let i = 0; i < this.polygons.length; i++) {
      const type = this.polygons[i].type
      this.polygons[i].fillStyle = FillStyle[type]
      this.polygons[i].strokeStyle = StrokeStyle[type]
    }
  }

  public createRandomPlots(type: PolygonTypes, payload = { amount: 10, size: 1 }) {
    let i = payload.amount
    while (i > 0) {
      const randomPoint = Math.floor(this.maxMin(1, NumberOfPoints[this.size] - 1))
      if (this.polygons[randomPoint].type === 'JUST_CREATED') {
        this.polygons[randomPoint].type = type
        this.polygons[randomPoint].fillStyle = FillStyle[type]
        let neighborArray = this.createPlot(this.polygons[randomPoint], (polygon: Polygon) => {
          if (polygon.type === 'JUST_CREATED') {
            polygon.type = type
          }
          return polygon
        })

        for (let i = 0; i < payload.size - 1; i++) {
          const randomNeighbor = neighborArray[Math.floor(Math.random() * neighborArray.length)]
          const closestPolygon = this.findClosest(
            randomNeighbor,
            this.polygons,
            (polygon: Polygon) => polygon.type === 'JUST_CREATED',
          )
          if (closestPolygon) {
            closestPolygon.type = type
            closestPolygon.fillStyle = FillStyle[type]
            neighborArray = this.createPlot(closestPolygon, (polygon: Polygon) => {
              if (polygon.type === 'JUST_CREATED') {
                polygon.type = type
                polygon.fillStyle = FillStyle[type]
              }
              return polygon
            })
          }
        }
        i--
      }
    }
  }

  private createPlot(position: Polygon, callback: (polygon: Polygon) => Polygon): Polygon[] {
    const dNeighbors = this.delaunay.neighbors(position.index)
    const neighbors: Polygon[] = []
    let done: boolean | undefined = false

    while (!done) {
      const iterator = dNeighbors.next()
      if (iterator.value) {
        const neighbor = this.polygons[iterator.value]
        callback(neighbor)
        neighbors.push(neighbor)
      }
      done = iterator.done
    }

    return neighbors
  }

  private getNeighbors(position: Polygon): Polygon[] {
    const dNeighbors = this.delaunay.neighbors(position.index)
    const neighbors: Polygon[] = []
    let done: boolean | undefined = false
    while (!done) {
      const iterator = dNeighbors.next()
      if (iterator.value) {
        const neighbor = this.polygons[iterator.value]
        neighbors.push(neighbor)
      }
      done = iterator.done
    }
    return neighbors
  }

  private squarify(point1: number[], point2: number[]) {
    return Math.sqrt(Math.pow(point1[0] - point2[0], 2) + Math.pow(point1[1] - point2[1], 2))
  }

  private findClosest(position: Polygon, polygons: Polygon[], callback?: (polygon: Polygon) => boolean) {
    let closest: Polygon = polygons[0]
    let closestDistance = this.squarify(position.coords, closest.coords)
    for (let i = 0; i < polygons.length; i++) {
      const dist = this.squarify(position.coords, polygons[i].coords)
      if (callback && callback(polygons[i]) && dist < closestDistance) {
        closest = polygons[i]
        closestDistance = dist
      } else if (!callback && dist < closestDistance) {
        closest = polygons[i]
        closestDistance = dist
      }
    }
    return closest
  }

  public shapeBorders(payload = { iterations: 2 }) {
    let j = -1
    while (++j < payload.iterations) {
      for (let i = this.polygons.length; i > 0; i--) {
        let chance = 0
        const neighbors = this.delaunay.neighbors(i)
        let done: boolean | undefined = false
        while (!done) {
          const neighbor = neighbors.next()
          if (neighbor.value) {
            const polygon = this.polygons[neighbor.value]
            if (polygon.type === 'SEA') {
              chance += this.maxMin(1 + j, BorderIterations[this.size] + j)
            }
          }
          done = neighbor.done
        }
        if (this.perlin(1, chance) && this.polygons[i].type !== 'CORNER') {
          this.polygons[i].type = 'SEA'
          this.polygons[i].fillStyle = FillStyle.SEA
          this.polygons[i].statistics.elevation = -1
        }
      }
    }
  }

  public perlin(modifier = 0, chance = 0) {
    return Math.random() + modifier <= chance
  }

  public maxMin(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  private generateMapPoints(mapSize: MapSize) {
    const size = NumberOfPoints[mapSize]

    if (mapSize === 'DEVELOP') {
      for (let i = 0; i < size; i++) {
        this.points.push([Math.random() * this.width - 1, Math.random() * this.height - 1])
      }
    } else {
      for (let i = 0; i < size; i++) {
        this.points.push([Math.random() + this.width / 2, Math.random() + this.height / 2])
      }
    }
  }

  private createVoronoiPolygons() {
    this.delaunay = Delaunay.from(this.points)
    const voronoi = this.delaunay.voronoi([0, 0, this.width, this.height])
    const rawPolygons = voronoi.cellPolygons()
    this.polygons = []

    let done: boolean | undefined = false
    let index = 0

    while (!done) {
      const polygon = rawPolygons.next()
      this.polygons.push({
        type: 'JUST_CREATED',
        strokeStyle: StrokeStyle.NORMAL,
        fillStyle: FillStyle.JUST_CREATED,
        shapes: polygon.value as number[][],
        coords: this.points[index],
        index: index++,
        statistics: {
          temp: 0,
          elevation: 0,
          isDiscovered: false,
          current: {
            temp: 0,
          },
        },
      })
      done = polygon.done
    }

    this.polygons = this.polygons.slice(0, -1)
  }

  private relaxVoronoiPolygons() {
    for (let i = 0; i < this.polygons.length - 1; i++) {
      // let centroidX: number, centroidY: number

      // centroidX = this.polygons[i].shapes.reduce((accumulator: number, shape: number[]) => accumulator + shape[0], 0)
      // centroidY = this.polygons[i].shapes.reduce((accumulator: number, shape: number[]) => accumulator + shape[1], 0)
      // centroidX = centroidX / this.polygons[i].shapes.length
      // centroidY = centroidY / this.polygons[i].shapes.length
      // this.points[i] = [centroidX, centroidY]

      this.relaxPolygon(this.polygons[i])
    }
  }

  private relaxPolygon(polygon: Polygon) {
    const n = polygon.shapes.length
    let i = -1,
      x = 0,
      y = 0,
      a,
      b = polygon.shapes[n - 1],
      c = 0,
      k = 0

    while (++i < n) {
      a = b
      b = polygon.shapes[i]
      k += c = a[0] * b[1] - b[0] * a[1]
      x += (a[0] + b[0]) * c
      y += (a[1] + b[1]) * c
    }
    k *= 3
    this.points[polygon.index] = [x / k, y / k]
  }

  public defineBorders() {
    for (let i = this.polygons.length - 1; i >= 0; --i) {
      for (let j = this.polygons[i].shapes.length - 1; j > 0; --j) {
        const coordX = this.polygons[i].shapes[j][0]
        const coordY = this.polygons[i].shapes[j][1]
        if (coordX <= 1 || coordY <= 1 || coordY >= this.height - 1 || coordX >= this.width - 1) {
          this.polygons[i].type = 'CORNER'
          this.polygons[i].fillStyle = FillStyle.CORNER
        }
      }
    }
  }

  private makeSeaCloseToBorders() {
    const delaunay = Delaunay.from(this.points)
    const borders = this.polygons.filter(polygon => polygon.type === 'CORNER')
    for (let i = 0; i < borders.length; i++) {
      const neighbors = delaunay.neighbors(borders[i].index)
      let done: boolean | undefined = false
      while (!done) {
        const neighbor = neighbors.next()
        if (neighbor.value) {
          const polygon = this.polygons[neighbor.value]
          if (polygon.type !== 'CORNER') {
            polygon.type = 'SEA'
            polygon.fillStyle = FillStyle.SEA
          }
        }
        done = neighbor.done
      }
    }
  }
}

export default Generator
