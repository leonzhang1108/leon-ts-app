interface IPiece {
  x: number,
  y: number,
  v: number,
  merged?: boolean,
  id: number
}

const getValue = (x, y, p) => {
  let res = {
    v: 0,
    index: 0
  }
  p.some((i, index) => {
    const same = i.x === x && i.y === y
    if (same) { res = { v: i.v, index } }
    return same
  })
  return res
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
          if (occupied) { max-- }
          return occupied
        })
        if (!isOccupied && curr >= 0) {
          p[curr].x = max
          changed = true
          max--
        }
      }
      for (let x = 2; x >= 0; x--) {
        const { v: currV, index: currIndex } = getValue(x, y, p)
        const { v: nextV, index: nextIndex } = getValue(x + 1, y, p)
        if (currV && nextV && currV === nextV) {
          p[currIndex].x = p[currIndex].x + 1
          p[currIndex].merged = true
          p[nextIndex].merged = true
          for(let v = x - 1; v >= 0; v--) {
            const { index: i } = getValue(v, y, p)
            p[i].x = p[i].x < 3 ? p[i].x + 1 : p[i].x
          }
          p.push({ x: x + 1, y, v: currV * 2, id: Math.random()})
          changed = true
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
      for (let y = 2; y >= 0; y--) {
        const { v: currV, index: currIndex } = getValue(x, y, p)
        const { v: nextV, index: nextIndex } = getValue(x, y + 1, p)
        if (currV && nextV && currV === nextV) {
          p[currIndex].y = p[currIndex].y + 1
          p[currIndex].merged = true
          p[nextIndex].merged = true
          for(let v = y - 1; v >= 0; v--) {
            const { index: i } = getValue(v, y, p)
            p[i].y = p[i].y < 3 ? p[i].y + 1 : p[i].y
          }
          p.push({ x, y: y + 1, v: currV * 2, id: Math.random()})
          changed = true
        }
      }
    }
    return { p, changed }
  },
  moveLeft: (p: IPiece[]) => {
    let changed = false
    for (let y = 0; y < 4; y++) {
      let min = 0
      for (let x = 1; x < 4; x++) {
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
      for (let x = 1; x < 4; x++) {
        const { v: currV, index: currIndex } = getValue(x, y, p)
        const { v: nextV, index: nextIndex } = getValue(x - 1, y, p)
        if (currV && nextV && currV === nextV) {
          p[currIndex].y = p[currIndex].y - 1
          p[currIndex].merged = true
          p[nextIndex].merged = true
          for(let v = 1; v <= x; v++) {
            const { index: i } = getValue(v, y, p)
            p[i].y = p[i].y > 0 ? p[i].y - 1 : p[i].y
          }
          p.push({ x: x - 1, y, v: currV * 2, id: Math.random()})
          changed = true
        }
      }
    }
    return { p, changed }
  },
  moveUp: (p: IPiece[]) => {
    let changed = false
    for (let x = 0; x < 4; x++) {
      let min = 0
      for (let y = 1; y < 4; y++) {
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
      for (let y = 1; y < 4; y++) {
        const { v: currV, index: currIndex } = getValue(x, y, p)
        const { v: nextV, index: nextIndex } = getValue(x, y - 1, p)
        if (currV && nextV && currV === nextV) {
          p[currIndex].x = p[currIndex].x - 1
          p[currIndex].merged = true
          p[nextIndex].merged = true
          for(let v = 1; v <= 3; v++) {
            const { index: i } = getValue(v, y, p)
            p[i].x = p[i].x > 0 ? p[i].x - 1 : p[i].x
          }
          p.push({ x, y: y - 1, v: currV * 2, id: Math.random()})
          changed = true
        }
      }
    }
    return { p, changed }
  }
}