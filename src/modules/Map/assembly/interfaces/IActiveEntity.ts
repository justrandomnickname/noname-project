export type ActiveEntityTypes = 'DEVELOP'

export interface IRoute {
  nextPositionTick: number[]
  coordinates: number[]
}

export interface IActiveEntity {
  type: ActiveEntityTypes
  position: number[]
  route: IRoute[]
  isActive: boolean
  FollowRouteOnTick: () => void
  EstablishPath: (coordinates: number[]) => void
}
