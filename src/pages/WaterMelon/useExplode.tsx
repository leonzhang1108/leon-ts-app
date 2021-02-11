import { useState, useEffect } from 'react'

interface IProps {
  game: any
}

interface ISpark {
  vx: number
  vy: number
  weight: number
  color: string
}

interface IFirework {
  x: number
  y: number
  age: number
  sparks: ISpark[]
  done?: boolean
}

const radius = 3

function hexToRgbA(hex, fade, age) {
  let c
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('')
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]]
    }
    c = '0x' + c.join('')
    const rate = 50 * (1 - age / 80)
    const r = ((c >> 16) & 255) + rate
    const g = ((c >> 8) & 255) + rate
    const b = (c & 255) + rate
    return 'rgba(' + [r, g, b].join(',') + ',' + fade + ')'
  }
  throw new Error('Bad Hex')
}

const times = (n: number, func: (v: number) => any) =>
  Array(n)
    .fill(null)
    .map((_, i) => func(i))

const fill = (ctx: any, x: number, y: number, color: string) => {
  ctx.beginPath()
  ctx.fillStyle = color
  // ctx.rect(x, y, radius, radius)
  ctx.arc(x, y, radius, 0, 360)
  ctx.fill()
}

const draw = (
  ctx: any,
  { sparks, age, x, y }: IFirework,
) => {
  sparks.forEach(spark => {
    times(10, (i: number) => {
      const trailAge = age + i
      const fade = i * 15 - age * 2
      fill(
        ctx,
        x + spark.vx * trailAge,
        y + spark.vy * trailAge + (spark.weight * trailAge) ** 2,
        hexToRgbA(spark.color, fade / 100, age)
      )
    })
  })
}

const update = (firework: IFirework): IFirework => {
  if (firework.age > 80) return { ...firework, age: firework.age + .7, done: true }
  return { ...firework, age: firework.age + .7 }
}

let animation = true

// let count = new Date().getTime()

const useExplode = ({
  game,
}: IProps) => {

  const [fireworks, setFireworks] = useState<IFirework[]>([])

  useEffect(() => {
    if (!fireworks.length || !animation) return
    animation = false
    requestAnimationFrame(() => {
      // const newCount = new Date().getTime()
      // console.log(newCount - count)
      // count = newCount
      animation = true
      const { render } = game || {}
      const { context } = render || {}
      if (!context) return
      setFireworks(fireworks =>
        fireworks.map((firework: IFirework) => {
          draw(context, firework)
          return update(firework)
        }).filter(item => !item.done)
      )
    })
  }, [fireworks, game])

  return { setFireworks, fireworks }
}

export default useExplode