//import Registry
import React from 'react'
import { ActionTypes } from '@Loader/model/Loader'
import Registry from '@Map/model/Registry'
import Realm from '@Map/scheme/Map.Realm'
import { IMapController } from './interfaces/IMapController'
import { MapSize } from '@Map/interfaces/Generator'
import { IMapSchema } from '@Map/interfaces/MapSchema'
import Data from '@Core/Data'

class MapController implements IMapController {
  //GetId
  public static Realm = Realm
  public static MapWorker: Worker

  constructor(
    notificationDispatch?: React.Dispatch<{
      type: ActionTypes
      payload?: IterableIterator<string>
    }>,
  ) {
    if (!MapController.MapWorker) {
      this.RegisterMapWorker(notificationDispatch)
    }
  }

  public CreateMap(payload: { size: MapSize; current: boolean }) {
    if (!MapController.MapWorker) throw Error('Cannot create map, worker didnt register properly')
    MapController.MapWorker.postMessage({ size: payload.size, cmd: 'average', current: payload.current })
  }
  public RegisterMapById(id: string, current?: boolean) {
    const map = Realm.getById(id)
    if (map.length > 0) {
      Registry.set(map[0])
      if (current) Registry.setCurrent(map[0].id)
    } else {
      console.warn('No map found with - ID: ', id)
    }
  }

  public SetRandomMap(payload: { current: boolean }): string {
    const ids = MapController.Realm.getIds()
    const random = Math.floor(Math.random() * ids.length - 1)
    const randomId = ids[random]
    const adjustedMap = MapController.Realm.getById(randomId)
    if (adjustedMap.length > 0) {
      const map = adjustedMap[0]
      Registry.set(map)
      if (payload.current) Registry.setCurrent(map.id)
    } else {
      return 'NOT_FOUND'
    }
    return ''
  }
  public Subscribe(stateHandler: React.Dispatch<React.SetStateAction<{} | IMapSchema>>) {
    const registry = Registry.subscribe(stateHandler)
    return {
      unsubscribe: registry.unsubscribe,
    }
  }
  // public HookInstanceToSession(id: string) {}
  private RegisterMapWorker(
    notificationDispatch?: React.Dispatch<{
      type: ActionTypes
      payload?: IterableIterator<string>
    }>,
  ) {
    if (!MapController.MapWorker) {
      MapController.MapWorker = new Worker('../Workers/createMap.worker.ts', { type: 'module' })
      MapController.MapWorker.onmessage = event => {
        const { payload, type } = event.data
        if (type === 'SET_MAP') {
          const realm = new MapController.Realm(payload.map)
          realm.inject()
          Registry.set(realm.get()[0])
          if (payload.current) Registry.setCurrent(payload.map.id)
        }
        if (type === 'SET_NOTIFICATIONS') {
          if (!notificationDispatch) console.warn("You doesn't register notification handler")
          if (notificationDispatch)
            notificationDispatch({ type: 'SET_NOTIFICATIONS', payload: Data.IterableIterator(payload.notifications) })
        }
        if (type === 'NEXT_NOTIFICATION') {
          if (!notificationDispatch) console.warn("You doesn't register notification handler")
          if (notificationDispatch) notificationDispatch({ type: 'SET_NEXT_LOADER_NOTIFICATION' })
        }
      }
    }
  }
}

export default MapController
