import Utils from '@utils'
import React, { useRef, useState, useEffect } from 'react'
interface IProps {
  background?: string;
  width?: number;
  height?: number;
  maxFireworks?: number;
  maxSparks?: number;
}

interface ISpark {
  vx: number;
  vy: number;
  weight: number;
  red: number;
  green: number;
  blue: number;
}

interface IFirework {
  x: number;
  y: number;
  age: number;
  phase: 'fly' | 'explode';
  sparks: ISpark[];
}

const radius = 5

const times = (n: number, func: (v: number) => any) =>
  Array(n)
    .fill(null)
    .map((_, i) => func(i))

const initFirework = (width: number, height: number) => {
  return {
    age: 0,
    phase: 'fly',
    x: Math.floor(Math.random() * width),
    y: height
  }
}

const generateSparks = (maxSparks: number) => {
  return times(maxSparks, (i: number) => {
    const vx = Math.random() * 5 + 0.5
    const vy = Math.random() * 5 + 0.5

    return {
      blue: Math.floor(Math.random() * 2),
      green: Math.floor(Math.random() * 2),
      red: Math.floor(Math.random() * 2),
      vx: Math.random() > 0.5 ? -vx : vx,
      vy: Math.random() > 0.5 ? -vy : vy,
      weight: Math.random() * 0.3 + 0.03
    }
  })
}

const generateFireworks = (
  width: number,
  height: number,
  maxFireworks: number,
  maxSparks: number
) =>
  times(maxFireworks, () => ({
    ...initFirework(width, height),
    sparks: generateSparks(maxSparks)
  }))

const toRGBA = (r = 0, g = 0, b = 0, a = 1) => `rgba(${[r, g, b, a].join(',')})`

const fill = (ctx: any, x: number, y: number, colors: number[]) => {
  ctx.beginPath()
  ctx.fillStyle = toRGBA(...colors)
  ctx.rect(x, y, radius, radius)
  ctx.fill()
}

const draw = (
  ctx: any,
  { phase, sparks, age, x, y }: IFirework,
  index: number
) => {
  if (phase === 'fly') {
    times(15, (i: number) => {
      fill(ctx, x + Math.random() * i - i / 2, y + i * radius, [
        index * 50,
        i * 17
      ])
    })
    return
  }

  sparks.forEach(spark => {
    times(10, (i: number) => {
      const trailAge = age + i
      const fade = i * 20 - age * 2
      fill(
        ctx,
        x + spark.vx * trailAge,
        y + spark.vy * trailAge + (spark.weight * trailAge) ** 2,
        ['red', 'green', 'blue'].map(key => Math.floor(spark[key] * fade))
      )
    })
  })
}

const update = (width: number, height: number, firework: IFirework) => {
  if (firework.phase === 'explode') {
    const others =
      firework.age > 100 && Math.random() < 0.05
        ? initFirework(width, height)
        : {}
    return { ...firework, age: firework.age + 1, ...others }
  } else {
    const phase =
      Math.random() < 0.001 || firework.y < 200 ? 'explode' : firework.phase
    return { ...firework, y: firework.y - 10, phase }
  }
}

const Fireworks12bius = ({
  background,
  width = 0,
  height = 0,
  maxFireworks = 0,
  maxSparks = 0
}: IProps) => {
  const canvas: any = useRef(null)
  const [fireworks, updator] = useState(
    generateFireworks(width, height, maxFireworks, maxSparks)
  )

  useEffect(() => {
    requestAnimationFrame(() => {
      if (!canvas.current) return
      const context = canvas.current.getContext('2d')
      context.clearRect(0, 0, width, height)
      updator(
        fireworks.map((firework: IFirework, index: number) => {
          draw(context, firework, index)
          return update(width, height, firework)
        })
      )
    })
  }, [fireworks])

  return (
    <canvas ref={canvas} width={width} height={height} style={{ background }} />
  )
}

Fireworks12bius.defaultProps = {
  background: 'black',
  maxFireworks: 5,
  maxSparks: 66
}

export default Utils.connect({
  component: Fireworks12bius,
  mapStateToProps: state => ({
    width: state.common.contentWidth,
    height: state.common.contentHeight
  })
})
