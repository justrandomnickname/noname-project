/**
 * Returns extremums of total height in specific range
 * @param position - total height of map
 * @param extremum - specific percents
 * @remarks
 * this method is the part of the local Math library
 * @beta
 */
const getExtremum = (position: number, extremum: number): number[] => {
  return [position / 2 + (position / 100) * extremum, position / 2 - (position / 100) * extremum]
}

export default { getExtremum }
