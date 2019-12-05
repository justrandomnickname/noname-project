import Realm from 'realm'
import { getConfiguration } from '../../../../realms/configs'
import { IMapSchema } from '@Map/interfaces/MapSchema'
import { IPolygon } from '@Map/interfaces/Polygon'
import { MapSize } from '@Map/interfaces/Generator'
import RealmConfigs from '../../../assembly/Realm'

class ShapesValue {
  public static Schema: Realm.ObjectSchema = {
    name: 'ShapesValue',
    properties: {
      value: 'int',
    },
  }
}

class Shapes {
  public static Schema: Realm.ObjectSchema = {
    name: 'Shapes',
    properties: {
      value: {
        type: 'list',
        objectType: 'ShapesValue',
      },
    },
  }
}

class Coords {
  public static Schema: Realm.ObjectSchema = {
    name: 'Coords',
    properties: {
      value: 'int',
    },
  }
}

class CurrentStatistics {
  public static Schema: Realm.ObjectSchema = {
    name: 'CurrentStatistics',
    properties: {
      temp: 'int',
    },
  }
}

class Statistics {
  public static Schema: Realm.ObjectSchema = {
    name: 'Statistics',
    properties: {
      temp: 'int',
      elevation: 'int',
      isDiscovered: 'bool',
      current: 'CurrentStatistics',
    },
  }
}

class Polygons {
  public static Schema: Realm.ObjectSchema = {
    name: 'Polygons',
    primaryKey: 'id',
    properties: {
      id: 'string',
      type: 'string',
      fillStyle: 'string',
      strokeStyle: 'string',
      shapes: {
        type: 'list',
        objectType: 'Shapes',
      },
      coords: {
        type: 'list',
        objectType: 'Coords',
      },
      index: 'int',
      statistics: 'Statistics',
    },
  }
}

class PointsValue {
  public static Schema: Realm.ObjectSchema = {
    name: 'PointsValue',
    properties: {
      value: 'int',
    },
  }
}

class Points {
  public static Schema: Realm.ObjectSchema = {
    name: 'Points',
    properties: {
      value: {
        type: 'list',
        objectType: 'PointsValue',
      },
    },
  }
}

class Map implements IMapSchema {
  public static Schema: Realm.ObjectSchema = {
    name: 'Map',
    primaryKey: 'id',
    properties: {
      id: 'string',
      type: 'string',
      size: 'string',
      polygons: {
        type: 'list',
        objectType: 'Polygons',
      },
      points: {
        type: 'list',
        objectType: 'Points',
      },
      width: 'int',
      height: 'int',
    },
  }

  public static realm: Realm = new Realm({
    ...getConfiguration(),
    path: RealmConfigs.Path + RealmConfigs.Map,
    schema: [
      Map.Schema,
      Polygons.Schema,
      Shapes.Schema,
      ShapesValue.Schema,
      Points.Schema,
      PointsValue.Schema,
      Coords.Schema,
      Statistics.Schema,
      CurrentStatistics.Schema,
    ],
  })

  public id: string
  public type: string
  public size: MapSize
  public polygons: IPolygon[]
  public points: Array<number[]>
  public width: number
  public height: number

  constructor(payload: IMapSchema) {
    this.id = payload.id
    this.type = payload.type
    this.size = payload.size
    this.polygons = payload.polygons
    this.points = payload.points
    this.width = payload.width
    this.height = payload.height
  }

  public static adjust(map: Realm.Results<IMapSchema>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fMaps: any = map
    const result: IMapSchema[] = []
    for (const p of fMaps) {
      const polygons: IPolygon[] = []
      const points: Array<number[]> = []
      for (let i = 0; i < p.polygons.length; i++) {
        const polygon = { ...p.polygons[i] }
        const shapes = []
        for (let j = 0; j < polygon.shapes.length; j++) {
          const shape = polygon.shapes[j].value.map((shape: { value: number }) => shape.value)
          shapes.push(shape)
        }
        polygon.shapes = shapes
        polygon.coords = [p.polygons[i].coords[0].value, p.polygons[i].coords[1].value]
        polygons.push(polygon)
      }
      for (let i = 0; i < p.points.length; i++) {
        const point = p.points[i].value.map((point: { value: number }) => point.value)
        points.push(point)
      }
      const map: IMapSchema = {
        id: p.id,
        type: p.type,
        size: p.size,
        polygons: polygons,
        points: points,
        width: p.width,
        height: p.height,
      }
      result.push(map)
    }
    return result
  }

  public get(): IMapSchema[] {
    const maps: Realm.Results<IMapSchema> = Map.realm.objects(Map.Schema.name)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fMaps: any = maps.filtered('id = $0', this.id)
    return Map.adjust(fMaps)
  }

  public static getAll(): Realm.Results<IMapSchema> {
    const maps: Realm.Results<IMapSchema> = Map.realm.objects(Map.Schema.name)
    return maps
  }

  public static getById(sessionId: string): IMapSchema[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map: any = Map.realm.objects(Map.Schema.name).filtered('id = $0', sessionId)
    return this.adjust(map)
  }

  public static getIds(): string[] {
    const maps: Realm.Results<IMapSchema> = Map.realm.objects(Map.Schema.name)
    const ids = maps.map((map: IMapSchema) => map.id)
    console.log(maps)
    return ids
  }

  public inject(): void {
    Map.realm.write(() => {
      const points = []
      const polygons = []

      for (let i = 0; i < this.points.length; i++) {
        const pointsValue1 = Map.realm.create('PointsValue', { value: this.points[i][0] })
        const pointsValue2 = Map.realm.create('PointsValue', { value: this.points[i][1] })
        const point = Map.realm.create('Points', { value: [pointsValue1, pointsValue2] })
        points.push(point)
      }

      for (let i = 0; i < this.polygons.length; i++) {
        const polygon = this.polygons[i]
        const shapes = []
        for (let j = 0; j < polygon.shapes.length; j++) {
          const shape = polygon.shapes[j]
          const shapeValue1 = Map.realm.create('ShapesValue', { value: shape[0] })
          const shapeValue2 = Map.realm.create('ShapesValue', { value: shape[1] })
          const shapeScheme = Map.realm.create('Shapes', { value: [shapeValue1, shapeValue2] })
          shapes.push(shapeScheme)
        }

        const coords_X = Map.realm.create('Coords', { value: polygon.coords[0] })
        const coords_Y = Map.realm.create('Coords', { value: polygon.coords[1] })
        const currentStatistics = Map.realm.create('CurrentStatistics', { temp: polygon.statistics.current.temp })
        const statistics = Map.realm.create('Statistics', {
          temp: polygon.statistics.temp,
          elevation: polygon.statistics.elevation,
          isDiscovered: polygon.statistics.isDiscovered,
          current: currentStatistics,
        })
        const polygonScheme = Map.realm.create('Polygons', {
          id: this.id + 'xxx' + i,
          type: polygon.type,
          fillStyle: polygon.fillStyle,
          strokeStyle: polygon.strokeStyle,
          shapes: shapes,
          coords: [coords_X, coords_Y],
          index: polygon.index,
          statistics: statistics,
        })
        polygons.push(polygonScheme)
      }
      Map.realm.create('Map', {
        id: this.id,
        type: this.type,
        size: this.size,
        points: points,
        polygons: polygons,
        width: this.width,
        height: this.height,
      })
    })
  }
}

// const realm = Realm.open({ schema: [Map.schema] })

export default Map
