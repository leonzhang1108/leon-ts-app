import React, { useCallback, useEffect, useRef, useState } from 'react'
import Utils from '@utils'
import Matter from 'matter-js'
import { Button } from 'antd'
import batman from '@img/batman.png'
import './index.less'

const colors = [
  '#4E79A5',
  '#F18F3B',
  '#E0585B',
  '#77B7B2',
  '#5AA155',
  '#EDC958',
  '#AF7AA0',
  '#FE9EA8',
  '#9C7561',
  '#BAB0AC',
  '#0376c2',
  '#be3223',
  '#f45f7c'
]

const defaultRadius = 20
const time = 1.2
const defaultCount = 4

function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

const rectangleOptions = () => ({
  restitution: 0.5,
  friction: 0,
  isStatic: true,
  render: {
    fillStyle: '#dcdcdc'
  }
})

const circleOptions = (radius) => {
  const index = Math.floor(getBaseLog(time, radius / 10)) % 13
  if (index === 12) {
    return {
      render: {
        sprite: {
          texture: batman,
          xScale: radius / 250,
          yScale: radius / 250,
        }
      }
    }
  } else {
    return {
      restitution: 0.3,
      friction: 0,
      render: {
        fillStyle: colors[index] || '#dcdcdc'
      }
    }
  }
}


const radiusList = (function() {
  const list: any[] = []
  for (let i = 0; i < defaultCount; i++) {
    list.push(defaultRadius * Math.pow(time, i))
  }
  return list
})()
const randomNum = (min, max) => parseInt(Math.random()*(max - min + 1) + min, 10)

const Game = function({ element, height, width }) {
  const Engine = Matter.Engine
  const Render = Matter.Render
  const Runner = Matter.Runner
  const Composite = Matter.Composite
  const MouseConstraint = Matter.MouseConstraint
  const Mouse = Matter.Mouse
  const World = Matter.World
  const Bodies = Matter.Bodies
  const Events = Matter.Events
  const Body = Matter.Body
  const Constraint = Matter.Constraint

  // create engine
  const engine = Engine.create()
  const world = engine.world
  world.gravity.y = 1

  // create renderer
  const render = Render.create({
    element,
    engine,
    options: {
      width,
      height,
      wireframes: false,
      background: null
    }
  })

  Render.run(render)

  // create runner
  const runner = Runner.create()
  Runner.run(runner, engine)

  function collapse(event) {
    const pairs = event.pairs
    const circleName = 'Circle Body'
    for (let i = 0; i < pairs.length; i++) {
      const { bodyA, bodyB } = pairs[i]
      const { label: labelA, circleRadius: ra } = bodyA
      const { label: labelB, circleRadius: rb } = bodyB
      if (labelA === circleName && labelB === circleName && ra === rb) {
        const { position: positionB, velocity: velocityA, mass } = bodyA
        const { position: positionA, velocity: velocityB } = bodyB
        const { x: ax, y: ay } = positionA
        const { x: bx, y: by } = positionB
        const x = (ax + bx) / 2
        const y = (ay + by) / 2
        const { x: vxa, y: vya } = velocityA
        const { x: vxb, y: vyb } = velocityB
        const vx = Math.max(vxa, vxb)
        const vy = Math.max(vya, vyb)
        const radius = time * ra
        const circle = Bodies.circle(x, y, radius, circleOptions(radius))
        const ratio = mass / circle.mass
        Body.setVelocity(bodyA, { x: 0, y: 0 })
        Body.setVelocity(bodyB, { x: 0, y: 0 })
        Body.setVelocity(circle, { x: vx * ratio, y: vy * ratio })
        const constraint = Constraint.create({
          bodyA,
          bodyB,
          stiffness: 1
        })
        World.add(world, [constraint])
        setTimeout(() => {
          Composite.remove(world, bodyA)
          Composite.remove(world, bodyB)
          World.remove(world, constraint)
          Composite.add(world, circle)
        }, 100)
        break
      }
    }
  }

  Events.on(engine, 'collisionStart', collapse)
  World.add(world, [
    // walls
    Bodies.rectangle(width / 2, 0, width, 50, rectangleOptions()),
    Bodies.rectangle(width / 2, height, width, 50, rectangleOptions()),
    Bodies.rectangle(0, height / 2, 50, height, rectangleOptions()),
    Bodies.rectangle(width, height / 2, 50, height, rectangleOptions()),
  ])

  // add mouse control
  const mouse = Mouse.create(render.canvas)
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 1,
      render: {
        visible: false
      }
    }
  })

  let circle
  let radius
  let couldAdd = true

  function doMouseDownNMove(event) {
    if (!couldAdd) return
    const { mouse: { absolute: { x }}, source } = event
    if (!radius) {
      radius = radiusList[randomNum(0, defaultCount - 1)]
    }
    // 禁止拖拽球
    source.constraint.bodyB = null
  
    circle && Composite.remove(world, circle)
    const left = 25 + radius
    const right = width - 25 - radius
    let currX = x
    if (x < left) {
      currX = left
    } else if (x > right) {
      currX = right
    }
    circle = Bodies.circle(currX, radius + 25, radius, { ...circleOptions(radius), isStatic: true })
    Composite.add(world, circle)
  }

  function addNextBall() {
    if (!radius) {
      radius = radiusList[randomNum(0, defaultCount - 1)]
    }
    circle = Bodies.circle(0, 0, radius, { ...circleOptions(radius), isStatic: true })
    Composite.add(world, circle)
  }

  function doMouseUp(event) {
    if (!couldAdd) return
    const { mouse: { absolute: { x }}} = event
    circle && Composite.remove(world, circle)
    const left = 25 + radius
    const right = width - 25 - radius
    let currX = x
    if (x < left) {
      currX = left
    } else if (x > right) {
      currX = right
    }
    const c = Bodies.circle(currX, radius + 25, radius, { ...circleOptions(radius) })
    Events.on(c, 'mousemove', null)
    Composite.add(world, c)
    radius = null
    addNextBall()
    couldAdd = false
    setTimeout(() => {
      couldAdd = true
    }, 300)
  }

  Events.on(mouseConstraint, 'mousedown', doMouseDownNMove)

  Events.on(mouseConstraint, 'mousemove', doMouseDownNMove)

  Events.on(mouseConstraint, 'mouseup', doMouseUp)

  addNextBall()

  World.add(world, mouseConstraint)

  // keep the mouse in sync with rendering
  render.mouse = mouse
  
  // fit the render viewport to the scene
  Render.lookAt(render, {
    min: { x: 0, y: 0 },
    max: { x: width, y: height }
  })
  
  // context for MatterTools.Demo
  return {
    engine,
    runner,
    render,
    canvas: render.canvas,
    stop: function() {
      Matter.Render.stop(render)
      Matter.Runner.stop(runner)
    }
  }
}

const WaterMelon = (props: any) => {
  const { w, h } = props
  const wrapper: any = useRef()
  const game: any = useRef()
  const [clickable, setClickable] = useState(true)

  useEffect(() => {
    game.current = Game({
      element: wrapper.current,
      height: h,
      width: w,
    })
  }, [w, h])

  const toggleGravity = useCallback(() => {
    if (!clickable) return
    setClickable(false)
    console.log(game.current)
    game.current.engine.world.gravity.y = -1
    setTimeout(() => {
      game.current.engine.world.gravity.y = 1
      setClickable(true)
    }, 1000)
  }, [])

  return (
    <div className="watermelon-wrapper">
      <div ref={wrapper} />
      <Button size="small" disabled={!clickable} type="primary" onClick={toggleGravity} className="gravity-btn">逆转重力</Button>
    </div>
  )
}

export default Utils.connect({
  component: WaterMelon,
  mapStateToProps: state => ({
    w: state.common.contentWidth,
    h: state.common.contentHeight,
  })
})