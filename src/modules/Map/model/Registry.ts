import React from 'react'
import onChange from 'on-change'
import { MapSchema } from '@Map/interfaces/MapSchema'

interface ISubscribe {
  unsubscribe: () => void
}

interface IWatcher {
  count: number
  unsubscribe?: ({}) => void
}

type StateType = { [id: string]: MapSchema }

class Registry {
  public static current: MapSchema | {} = {}
  public static maps: StateType = {}
  public static Watcher: IWatcher = { count: 0 }

  public static subscribe(setState: React.Dispatch<React.SetStateAction<{} | MapSchema>>): ISubscribe {
    Registry.Watcher = onChange(Registry.Watcher, () => {
      setState(Registry.current)
    })
    return {
      unsubscribe() {
        onChange.unsubscribe(Registry.Watcher)
      },
    }
  }

  public static set(map: MapSchema) {
    Registry.maps = Object.assign({}, Registry.maps, { [map.id]: map })
  }

  public static setCurrent(id: string) {
    Registry.current = Registry.maps[id]
    Registry.Watcher.count = Registry.Watcher.count + 1
  }
}

export default Registry
