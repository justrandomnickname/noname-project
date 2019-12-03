import React, { useReducer, useLayoutEffect, useState } from 'react'
import UI from '@Core/UI'
import Canvas from '@Map/views/Canvas'
import Loader from '@Loader/index'
import { Wrapper } from '@Map/components/Wrapper'
import MapController from '@Controllers/MapController'
import { MapSize } from '@Map/interfaces/Generator'
import { MapSchema } from '@Map/interfaces/MapSchema'
import TimeCounter from '@Map/components/TimeCounter'

interface IProps {
  id?: string
}

const MainMap: React.FC<IProps> = (props: IProps) => {
  const [map, setMap] = useState<{} | MapSchema>({})
  const [loaderState, loaderDispatch] = useReducer(Loader.Store, Loader.initialState)
  const controller = new MapController(loaderDispatch)
  const Context = React.createContext({ map })

  const createMap = (payload: { size: MapSize; current: boolean }) => {
    setMap({})
    controller.CreateMap({ size: payload.size, current: payload.current })
  }

  useLayoutEffect(() => {
    const subscription = controller.Subscribe(setMap)
    if (process.env.NODE_ENV === 'development' && !process.env.FAST_DEPLOY && !props.id) {
      createMap({ size: 'medium', current: true })
    } else if (props.id) {
      controller.RegisterMapById(props.id)
    } else if (process.env.FAST_DEPLOY) {
      const result = controller.SetRandomMap({ current: true })
      if (result === 'NOT_FOUND') createMap({ size: 'medium', current: true })
    }
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  if ('id' in map) {
    return (
      <Wrapper>
        <TimeCounter />
        <UI.Title>
          ID: <UI.RegularText>{map.id}</UI.RegularText>
        </UI.Title>
        <UI.Title>
          TYPE: <UI.RegularText>{map.type} </UI.RegularText>
        </UI.Title>
        <Context.Provider value={{ map }}>
          <Canvas width={1100} height={720} map={map} />
        </Context.Provider>
        <div style={{ marginTop: 30 }}>
          <UI.Button onClick={() => createMap({ size: map.size, current: true })}>generate</UI.Button>
        </div>
      </Wrapper>
    )
  }
  return <Loader.Component text={loaderState.CURRENT_NOTIFICATION} />
}

export default MainMap
