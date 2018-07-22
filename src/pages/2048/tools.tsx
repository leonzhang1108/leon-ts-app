interface IPiece {
  x: number,
  y: number,
  v: number
}

export default {
  moveRight: (p: IPiece[]) => {
    let changed = false
    for (let y = 0; y < 4; y++) {
      let max = 3
      for (let x = 2; x >= 0; x--) {
        let curr = -1
        const isOccupied = p.some((i, index) => {
          const occupied = i.x === (x + 1) && i.y === y
          if (i.x === x && i.y === y) { curr = index }
          if (occupied) { max -- }
          return occupied
        })
        if (!isOccupied && curr >= 0) {
          p[curr].x = max
          changed = true
          max--
        }
      }
    }
    return { p, changed }
  },
  moveDown: (p: IPiece[]) => {
    let changed = false
    for (let x = 0; x < 4; x++) {
      let max = 3
      for (let y = 2; y >= 0; y--) {
        let curr = -1
        const isOccupied = p.some((i, index) => {
          const occupied = i.x === x && i.y === (y + 1)
          if (i.x === x && i.y === y) { curr = index }
          if (occupied) { max-- }
          return occupied
        })
        if (!isOccupied && curr >= 0) {
          p[curr].y = max
          changed = true
          max--
        }
      }
    }
    return { p, changed }
  },
  moveLeft: (p: IPiece[]) => {
    let changed = false
    for (let y = 0; y < 4; y++) {
      let min = 0
      for (let x = 1; x <= 3; x++) {
        let curr = -1
        const isOccupied = p.some((i, index) => {
          const occupied = i.x === (x - 1) && i.y === y
          if (i.x === x && i.y === y) { curr = index }
          if (occupied) { min++ }
          return occupied
        })
        if (!isOccupied && curr >= 0) {
          p[curr].x = min
          changed = true
          min++
        }
      }
    }
    return { p, changed }
  },
  moveUp: (p: IPiece[]) => {
    let changed = false
    for (let x = 0; x < 4; x++) {
      let min = 0
      for (let y = 0; y <= 3; y++) {
        let curr = -1
        const isOccupied = p.some((i, index) => {
          const occupied = i.x === x && i.y === (y - 1)
          if (i.x === x && i.y === y) { curr = index }
          if (occupied) { min++ }
          return occupied
        })
        if (!isOccupied && curr >= 0) {
          p[curr].y = min
          changed = true
          min++
        }
      }
    }
    return { p, changed }
  }
}