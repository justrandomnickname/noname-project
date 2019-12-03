const PAYLOAD = 'invalid payload'

const EVENT = (at: string, ...args: string[]): string => {
  return [`invalid event at - ${at}`].concat(args).join('. ')
}

const OBJECT = (at: string, ...args: string[]): string => {
  return [`Invalid object name - ${at}`].concat(args).join('. ')
}

export default {
  EVENT,
  PAYLOAD,
  OBJECT,
}
