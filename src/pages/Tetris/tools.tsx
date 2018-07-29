import Utils from '@utils'
import blockMap from './block'

export default {
  getCurrPosition: ({ x, y, cBlock, screen: s, rotate }) => {
    const playboard = Utils.clone(s)
    const block = blockMap[cBlock][rotate]
    const width = block[0].length
    const min = 0
    const max = 10 - width
    const center = Math.floor((10 - width) / 2)
    let length = block.length
    let index = y
    let rx = center + x
    if (rx < min) { 
      rx = min 
      x = -center
    }
    if (rx > max) { 
      rx = max
      x = width % 2 === 1 ? center + 1 : center
    }

    while (index > 0 && length > 0) {
      let curr = index - 1
      curr = curr > 20 ? 20 : curr
      const row = block[length - 1]
      for(let i = 0; i < 10; i++) {
        if(i < row.length) {
          playboard[curr][rx + i] = row[i]
        }
      }
      length--
      index--
    }

    return { playboard, x }
  }
}