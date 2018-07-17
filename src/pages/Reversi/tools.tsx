const directionMap = {
  0: [0, 1]
}

const statusMap = {
  empty: 0,
  black: 1,
  white: 2
}

const borderMax = 7

const check = ({ x, y, checkerboard, player, direction }) => {
  const [ xd, yd ] = direction
  let result = 0
  let click = player ? statusMap.black : statusMap.white
  x += xd
  y += yd
  while (x >= 0 && x <= borderMax && y >= 0 && y <= borderMax) {
    if (checkerboard[x][y] === statusMap.empty || result === 2) {
      break
    }

    if (checkerboard[x][y] === click) {
      result++
      click = !player ? statusMap.black : statusMap.white
    }

    x += xd
    y += yd
  }

  return result === 2
}

const couldRight = ({ x, y, checkerboard, player }) => 
  check({ x, y, checkerboard, player, direction: directionMap[0] })


export default {
  couldClick: ({ x, y, checkerboard, player }) => {
    return couldRight({ x, y, checkerboard, player })
  }
}