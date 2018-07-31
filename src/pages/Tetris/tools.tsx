import Utils from '@utils'
import blockMap from './block'

export default {
  getCurrPosition: ({ x, y, cBlock, screen, rotate }) => {
    const playboard = Utils.clone(screen)
    const block: number[][] = blockMap[cBlock][rotate]
    const width = block[0].length
    const min = 0
    const max = 10 - width
    const center = Math.floor((10 - width) / 2)
    const bottomBlockList: any[] = []
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

    for (let i = 0; i < width; i++) {
      let l = block.length - 1
      let next = true
      while (l >= 0 && next) {
        if (block[l][i]) {
          bottomBlockList.push({ x: i, y: l })
          next = false
        }
        l--
      }
    }

    bottomBlockList.every(b => {
      const { x: ox, y: oy } = b
      const nx = ox + rx
      const ny = y + oy - length
      if (ny >= 0 && ny < 20 && playboard[ny][nx]) {
        console.log(ny, nx)
        couldMove = false
      }
      return couldMove
    })

    if (couldMove) {
      while (index > 0 && length > 0) {
        let curr = --index
        const row = block[length - 1]
        curr = curr > 20 ? 20 : curr
        for (let i = 0; i < 10; i++) {
          if (i < row.length) {
            const b = playboard[curr][rx + i]
            if (!b) {
              playboard[curr][rx + i] = row[i]
            }
          }
        }
        length--
      }
    }

    return { playboard, x, screen, couldMove }
  }
}