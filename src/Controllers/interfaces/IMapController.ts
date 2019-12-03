import { MapSize } from '@Map/interfaces/Generator'

export interface IMapController {
  CreateMap(payload: { size: MapSize; current: boolean }): void
  RegisterMapById(id: string): void
  Subscribe(stateHandler: any): void
  // HookInstanceToSession(id: string): void
  // SendMessageToWorker(): void
  // RegisterMap(): void
}
