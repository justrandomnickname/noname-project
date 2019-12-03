import { IActiveEntity, ActiveEntityTypes, IRoute } from './interfaces/IActiveEntity'

/**
 * Basic class for providing interactivity to [[Canvas]]. Creates particle which redraws every frame.
 * All entities stores in [[Canvas.ActiveEntities]]
 */
class ActiveEntity implements IActiveEntity {
  public type: ActiveEntityTypes
  public position: number[]
  public route: IRoute[] = []
  public isActive = false

  /**
   *
   * @param type
   * @param position
   */
  constructor(type: ActiveEntityTypes, position: number[]) {
    this.type = type
    this.position = position
  }
  /**
   * Establishes path for active entity on map. Provide actual mapWidth(X), mapHeight(Y) map coordinates to force entity to follow route with it's speed
   * @param coordinates
   */
  public EstablishPath(coordinates: number[]): void {
    // console.log('PATH ESTABLISHED', coordinates)
    // console.log('STARTING POSITION IS', this.position)
    this.isActive = true
    const dx = coordinates[0] - this.position[0]
    const dy = coordinates[1] - this.position[1]
    const dist = Math.hypot(dx, dy)
    const speed: number[] = [dx / dist, dy / dist]
    // console.log('DX / DIST', dx / dist)
    // console.log('DX IS', dx)
    // console.log('DY IS', dy)
    // console.log('DISTANCE IS', dist)
    // console.log('SPEED IS', speed)
    const route = {
      nextPositionTick: speed,
      coordinates,
    }
    this.route.push(route)
  }

  /**
   * closes the path at completion.
   * @private
   */
  private EndPath(): void {
    this.route.shift()
  }

  /**
   * [[Canvas]] will call this method on every frame
   * see [[Canvas.DrawEntities]] for more information
   * @remarks
   * DO NOT call this method itself
   */
  public FollowRouteOnTick(): void {
    const currentRoute = this.route[0]
    const dx = currentRoute.coordinates[0] - this.position[0]
    const dy = currentRoute.coordinates[1] - this.position[1]
    const dist = Math.hypot(dx, dy)
    if (dist > 1) {
      this.position[0] += currentRoute.nextPositionTick[0]
      this.position[1] += currentRoute.nextPositionTick[1]
    } else {
      this.EndPath()
      this.isActive = false
    }
  }
}

export default ActiveEntity
