import Utils from '@utils'

const blockMap = {
  L: [
    [1, 0],
    [1, 0],
    [1, 1]
  ],
  J: [
    [0, 1],
    [0, 1],
    [1, 1]
  ],
  O: [
    [1, 1],
    [1, 1]
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1]
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0]
  ],
  I: [
    [1],
    [1],
    [1],
    [1]
  ]

}


export default {
  getCurrPosition: ({ x, y, cBlock, screen: s }) => {
    const playboard = Utils.clone(s)
    const block = blockMap[cBlock]
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
      const curr = index - 1
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