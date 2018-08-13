const directionMap = [
  [0, 1], [0, -1],
  [-1, 0], [1, 0],
  [-1, -1], [-1, 1],
  [1, -1], [1, 1]
]

const statusMap = {
  empty: 0,
  black: 1,
  white: 2
}

const borderMax = 7

interface IReverse {
  x: number,
  y: number
}

const check = ({ x, y, checkerboard, player, direction }) => {
  const [ dx, dy ] = direction
  let result = 0
  let click = player ? statusMap.black : statusMap.white
  x += dx
  y += dy
  while (x >= 0 && x <= borderMax && y >= 0 && y <= borderMax) {
    if (checkerboard[x][y] === statusMap.empty || result === 2) { break }
    if (checkerboard[x][y] === click) {
      result++
      click = !player ? statusMap.black : statusMap.white
    } else {
      if (result !== 1) { break }
    }
    x += dx
    y += dy
  }
  return result === 2
}

export default {
  couldClick: ({ x, y, checkerboard, player }) =>
    directionMap.some(direction => check({ x, y, checkerboard, player, direction })),

  clickToCover: ({ x, y, checkerboard, player }) => {
    const reverse: IReverse[] = []
    directionMap.forEach(direction => {
      const [dx, dy] = direction
      let cx = x
      let cy = y
      cx += dx
      cy += dy
      if (check({ x, y, checkerboard, player, direction })) {
        while (cx >= 0 && cx <= borderMax && cy >= 0 && cy <= borderMax) {
          if (checkerboard[cx][cy] === statusMap.empty
            || checkerboard[cx][cy] === (player ? statusMap.white : statusMap.black)) {
            break
          }
          checkerboard[cx][cy] = player ? statusMap.white : statusMap.black
          reverse.push({ x: cx, y: cy })
          cx += dx
          cy += dy
        }
      }
    })
    return { c: checkerboard, r: reverse }
  }
}
