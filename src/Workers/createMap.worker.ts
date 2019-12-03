
import Generator from '../Modules/Map/assembly/Generator'
import { Type } from '../Modules/Map/interfaces/MapSchema'
import { MapSize } from '../Modules/Map/interfaces/Generator'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ctx: Worker = self as any

const generateMap = (payload: { size: MapSize }) => {
  const generator = new Generator({ type: Type(), size: payload.size })
  postMessage({ type: 'NEXT_NOTIFICATION' })
  generator.create()
  generator.createVoronoiAndLloydify()
  postMessage({ type: 'NEXT_NOTIFICATION' })
  generator.generatePlots()
  generator.setFillStyles()
  generator.generateTemperature(0)
  return generator
}

ctx.addEventListener('message', message => {
  switch (message.data.cmd) {
    case 'average':
      const notifications = ['generate map', 'generate random plots']
      postMessage({ type: 'SET_NOTIFICATIONS', payload: { notifications: notifications } })
      const generator = generateMap({ size: message.data.size })
      postMessage({ type: 'SET_MAP', payload: { map: generator, current: message.data.current } })
      break
    default:
      break
  }
})

// generateMap()
