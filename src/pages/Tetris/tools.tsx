import Utils from '@utils'
import blockMap from './block'

export default {
  getCurrPosition: ({ x, y, cBlock, screen, rotate }) => {
    const playboard = Utils.clone(screen)
    const block = blockMap[cBlock][rotate]
    const width = block[0].length
    const min = 0
    const max = 10 - width
    const center = Math.floor((10 - width) / 2)
    let length = block.length
    let couldMove = true
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
      let curr = --index
      const row = block[length - 1]
      curr = curr > 20 ? 20 : curr
      for (let i = 0; i < 10; i++) {
        if (i < row.length) {
          const b = playboard[curr][rx + i]
          if (b) {
            couldMove = false
          } else {
            playboard[curr][rx + i] = row[i]
          }
        }
      }
      length--
    }

    return { playboard, x, screen, couldMove }
  }
}