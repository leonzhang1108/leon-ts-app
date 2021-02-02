import { useState, useEffect } from 'react'

interface IProps {
  game: any
}

interface ISpark {
  vx: number
  vy: number
  weight: number
  red: number
  green: number
  blue: number
}

interface IFirework {
  x: number
  y: number
  age: number
  sparks: ISpark[],
  color: string
}

const radius = 3

function hexToRgbA(hex, fade){
  let c
  if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
    c = hex.substring(1).split('')
    if(c.length === 3){
      c = [c[0], c[0], c[1], c[1], c[2], c[2]]
    }
    c = '0x'+c.join('')
    return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+ fade +')'
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
  { sparks, age, x, y, color }: IFirework,
) => {
  sparks.forEach(spark => {
    times(10, (i: number) => {
      const trailAge = age + i
      const fade = i * 20 - age * 2
      fill(
        ctx,
        x + spark.vx * trailAge,
        y + spark.vy * trailAge + (spark.weight * trailAge) ** 2,
        hexToRgbA(color, fade / 100)
      )
    })
  })
}

const update = (firework: IFirework) => {
  if (firework.age > 80) return null
  return { ...firework, age: firework.age + 1 }
}

const useExplode = ({
  game,
}: IProps) => {

  const [fireworks, setFireworks] = useState<any>([])
  useEffect(() => {
    if (!fireworks.length) return
    requestAnimationFrame(() => {
      const { render } = game || {}
      const { context } = render || {}
      if (!context) return
      setFireworks(
        fireworks.map((firework: IFirework) => {
          draw(context, firework)
          return update(firework)
        }).filter(item => !!item)
      )
    })
  }, [fireworks, game])

  return { setFireworks, fireworks }
}

export default useExplode
