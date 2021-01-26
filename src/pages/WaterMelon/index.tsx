import React, { useEffect, useRef } from 'react'
import Utils from '@utils'
import Matter from 'matter-js'

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
  '#BAB0AC'
]

const defaultRadius = 20
const time = 1.2

function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

const circleOptions = (radius?) => {
  if (!radius) {
    return {
      restitution: 0.8,
      friction: 0,
      render: {
        fillStyle: '#dcdcdc'
      }
    }
  }
  const index = Math.floor(getBaseLog(time, radius / 10)) % 10
  return {
    restitution: 0.8,
    friction: 0,
    render: {
      fillStyle: colors[index] || '#dcdcdc'
    }
  }
}


const radiusList = [defaultRadius, defaultRadius * time, defaultRadius * time * time]
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

  // create engine
  const engine = Engine.create()
  const world = engine.world

  // create renderer
  const render = Render.create({
    element,
    engine,
    options: {
      width,
      height,
      wireframes: false
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
      const { label: labelA, circleRadius: ca } = bodyA
      const { label: labelB, circleRadius: cb } = bodyB
      if (labelA === circleName && labelB === circleName && ca === cb) {
        const { velocity: velocityA } = bodyA
        const { position, velocity: velocityB } = bodyB
        const { x, y } = position
        const velocity = velocityA || velocityB
        const { x: vx, y: vy } = velocity || {}
        Composite.remove(world, bodyA)
        Composite.remove(world, bodyB)
        const radius = time * ca
        const circle = Bodies.circle(x, y, radius, circleOptions(radius))
        Body.setVelocity(circle, { x: vx, y: vy })
        Composite.add(world, circle)
        break
      }
    }
  }

  Events.on(engine, 'collisionStart', collapse)
  World.add(world, [
    // walls
    Bodies.rectangle(width / 2, 0, width, 50, { isStatic: true, ...circleOptions() }),
    Bodies.rectangle(width / 2, height, width, 50, { isStatic: true, ...circleOptions() }),
    Bodies.rectangle(0, height / 2, 50, height, { isStatic: true, ...circleOptions() }),
    Bodies.rectangle(width, height / 2, 50, height, { isStatic: true, ...circleOptions() }),
    // Bodies.rectangle(0, 300, 50, 600, { isStatic: true }),
  ])

  // add mouse control
  const mouse = Mouse.create(render.canvas)
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false
      }
    }
  })

  let circle
  let radius

  function doMouseDownNMove(event) {
    const { mouse: { absolute: { x }}} = event
    if (!radius) {
      radius = radiusList[randomNum(0, 2)]
    }
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
      radius = radiusList[randomNum(0, 2)]
    }
    circle = Bodies.circle(radius + 25, radius + 25, radius, { ...circleOptions(radius), isStatic: true })
    Composite.add(world, circle)
  }

  function doMouseUp(event) {
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
    Composite.add(world, c)
    radius = null
    addNextBall()
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
  useEffect(() => {
    Game({
      element: wrapper.current,
      height: h,
      width: w,
    })
  }, [w, h])
  return <div ref={wrapper} />
}

export default Utils.connect({
  component: WaterMelon,
  mapStateToProps: state => ({
    w: state.common.contentWidth,
    h: state.common.contentHeight,
  })
})