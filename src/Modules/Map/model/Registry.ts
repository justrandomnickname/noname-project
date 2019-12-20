import React from 'react'
import onChange from 'on-change'
import { IMapSchema } from '@Map/interfaces/MapSchema'

interface ISubscribe {
  unsubscribe: () => void
}

interface IWatcher {
  count: number
  unsubscribe?: ({}) => void
}

type StateType = { [id: string]: IMapSchema }

class Registry {
  public static current: IMapSchema | {} = {}
  public static maps: StateType = {}
  public static Watcher: IWatcher = { count: 0 }

  public static subscribe(setState: React.Dispatch<React.SetStateAction<{} | IMapSchema>>): ISubscribe {
    Registry.Watcher = onChange(Registry.Watcher, () => {
      setState(Registry.current)
    })
    return {
      unsubscribe() {
        onChange.unsubscribe(Registry.Watcher)
      },
    }
  }

  public static set(map: IMapSchema) {
    Registry.maps = Object.assign({}, Registry.maps, { [map.id]: map })
  }

  public static setCurrent(id: string) {
    Registry.current = Registry.maps[id]
    Registry.Watcher.count = Registry.Watcher.count + 1
  }
}

export default Registry
