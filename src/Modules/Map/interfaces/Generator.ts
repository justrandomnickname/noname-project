export type MapSize = 'small' | 'medium' | 'large' | 'DEVELOP'

export enum EquatorExtremums {
  default = 5,
  closeTo = 13.5,
}

export enum NumberOfPoints {
  DEVELOP = 100,
  small = 1500,
  medium = 2750,
  large = 5000,
}

// x4 multiplier
export enum MapHeight {
  DEVELOP = 100,
  small = 2000,
  medium = 3000,
  large = 4000,
}

// x6.5 multiplier
export enum MapWidth {
  DEVELOP = 100,
  small = 3250,
  medium = 4875,
  large = 6500,
}

export interface IMapGeneratorContract {
  type: string
  size: MapSize
}

export enum LloydIterations {
  DEVELOP = 2,
  small = 1500,
  medium = 2750,
  large = 5000,
}

export enum BorderIterations {
  DEVELOP = 1,
  small = 2,
  medium = 3,
  large = 4,
}
