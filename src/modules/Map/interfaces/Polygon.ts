export type PolygonTypes = 'JUST_CREATED' | 'DEVELOP' | 'CORNER' | 'SEA' | 'MOUNTAINS' | 'FOREST' | 'GRASSLAND'

export enum FillStyle {
  'NORMAL' = '#292826',
  'DEVELOP' = 'red',
  'FOREST' = '#228B22',
  'GRASSLAND' = '#C6CC51',
  'JUST_CREATED' = '#CCAE8F',
  'CORNER' = 'transparent',
  'SEA' = '#90ADCD',
  'MOUNTAINS' = '#694d30',
  'HIDDEN' = 'black',
}

export enum StrokeStyle {
  'NORMAL' = '#292826',
  'DEVELOP' = 'red',
  'FOREST' = '#228B22',
  'GRASSLAND' = '#C6CC51',
  'JUST_CREATED' = '#CCAE8F',
  'CORNER' = 'transparent',
  'SEA' = '#90ADCD',
  'MOUNTAINS' = '#694d30',
  'HIDDEN' = 'black',
}

export interface Polygon {
  type: PolygonTypes
  fillStyle: FillStyle
  strokeStyle: StrokeStyle
  shapes: Array<number[]>
  coords: number[]
  index: number
  statistics: {
    temp: number
    elevation: number
    isDiscovered: boolean
    current: {
      temp: number
    }
  }
}
