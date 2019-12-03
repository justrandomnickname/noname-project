import { Polygon } from './Polygon'
import { MapWidth, MapHeight, MapSize } from './Generator'

/**
 * @param id `string`
 * @param type `string`
 * @type {Type}
 * @param points `Array<number[]>
 */
export interface MapSchema {
  id: string
  type: string
  size: MapSize
  polygons: Polygon[]
  points: Array<number[]>
  width: MapWidth
  height: MapHeight
}

/**
 * @returns a string with map type depends on process.env.NODE_ENV
 */
export const Type = () => {
  return process.env.NODE_ENV === 'development' ? 'DEVELOP__main' : 'main'
}
