// eslint-disable-next-line @typescript-eslint/no-explicit-any
function* IterableIterator(array: any[], index = 0) {
  while (index < array.length) {
    yield array[index++]
  }
}

export default {
  IterableIterator,
}
