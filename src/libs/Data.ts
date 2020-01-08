import { Guid } from 'guid-typescript'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* IterableIterator(array: any[], index = 0) {
  while (index < array.length) {
    yield array[index++]
  }
}

async function Sleep(ms: number) {
  return new Promise(event => setTimeout(event, ms))
}

function thunkate(func: () => void) {
  return function() {
    func()
  }
}

function GetPublicKey<T extends Array<{ key: string }>>(iterableArray: T): string {
  let key = Guid.create().toJSON().value
  if (iterableArray.length !== 0 && 'key' in iterableArray[0]) {
    let iterateAgain = true
    while (iterateAgain) {
      iterateAgain = false
      for (let i = 0; i < iterableArray.length; i++) {
        if (iterableArray[i].key === key) {
          key = Guid.create().toJSON().value
          iterateAgain = true
        }
      }
    }
  } else {
    if (iterableArray.length !== 0) throw Error('Invalid Object. Array should contain key property')
  }
  return key
}

export default {
  IterableIterator,
  Sleep,
  GetPublicKey,
  thunkate,
}
