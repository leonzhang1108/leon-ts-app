import React, { useCallback, useEffect, useRef, useState } from 'react'
import Utils from '@utils'
import Matter from 'matter-js'
import { Button, Popconfirm, Modal } from 'antd'
import batman from '@img/batman.png'
import pikachu from '@img/pikachu.png'
import ultraman from '@img/ultraman.png'
import { makeSound, preloadSound, preloadImage, vibrate } from './utils'
import duang from '@sound/duang.mp3'
import pika from '@sound/pika.mp3'
import bat from '@sound/batman.mp3'
import ultra from '@sound/ultra.mp3'
import useExplode from './useExplode'
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

const radiusList = (function() {
  const list: any[] = []
  for (let i = 0; i < defaultCount; i++) {
    list.push(defaultRadius * Math.pow(time, i))
  }
  return list
})()

function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

const rectangleOptions = () => ({
  restitution: 0.3,
  friction: 0.03,
  frictionStatic: 0.03,
  frictionAir: 0.01,
  isStatic: true,
  render: {
    fillStyle: '#dcdcdc'
  }
})

const circleOptions = (radius) => {
  const index = Math.floor(getBaseLog(time, radius / 10)) % 14
  if (index === 13) {
    return {
      render: {
        sprite: {
          texture: ultraman,
          xScale: radius / 150,
          yScale: radius / 150,
        },
      }
    }
  } else if (index === 12) {
    return {
      render: {
        sprite: {
          texture: pikachu,
          xScale: radius / 242,
          yScale: radius / 242,
        },
      }
    }
  } else if (index === 11) {
    return {
      render: {
        sprite: {
          texture: batman,
          xScale: radius / 250,
          yScale: radius / 250,
        },
      }
    }
  } else {
    return {
      restitution: 0.3,
      friction: 0.03,
      frictionStatic: 0.03,
      frictionAir: 0.01,
      render: {
        fillStyle: colors[index] || '#dcdcdc',
      },
      collisionFilter: {
        group: Math.floor(radius),
        category: 1,
        mask: 1
      }
    }
  }
}

const randomNum = (min, max) => parseInt(Math.random()*(max - min + 1) + min, 10)

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

const Game = function({ element, height, width, onGameover, onCollapse }) {

  // create engine
  const engine = Engine.create({
    enableSleeping: true
  })
  const world = engine.world
  world.gravity.y = 1

  // create renderer
  const render = Render.create({
    element,
    engine,
    options: {
      width,
      height: height - 30,
      background: '#fff',
      wireframes: false,
      showSleeping: false,
      // showAngleIndicator: true,
      // showCollisions: true,
      // showVelocity: true
    }
  })

  Render.run(render)

  // create runner
  const runner = Runner.create()
  Runner.run(runner, engine)

  let couldCollapse = true

  function collapse(event) {
    if (!couldCollapse) return
    const pairs = event.pairs
    const circleName = 'Circle Body'
    for (let i = 0; i < pairs.length; i++) {
      const { bodyA, bodyB } = pairs[i]
      const { label: labelA, circleRadius: ra } = bodyA
      const { label: labelB, circleRadius: rb } = bodyB
      const index = Math.floor(getBaseLog(time, ra / 10))
      if (labelA === circleName && labelB === circleName && Math.floor(ra) === Math.floor(rb) && index < 13) {
        // 激活所有球
        const allBodies = Composite.allBodies(engine.world)
        allBodies.filter(body => body.label === 'Circle Body').forEach(body => {
          Matter.Sleeping.set(body, false)
        })
        couldCollapse = false
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
          stiffness: 0.05,
          length: 0,
          render: {
            strokeStyle: 'transparent'
          }
        })
        World.add(world, [constraint])
        Body.set(bodyA, 'collisionFilter', { ...bodyA.collisionFilter, group: -Math.floor(radius) })
        Body.set(bodyB, 'collisionFilter', { ...bodyB.collisionFilter, group: -Math.floor(radius) })
        // engine.timing.timeScale = slowmode

        setTimeout(() => {
          // engine.timing.timeScale = 1
          onCollapse({
            x,
            y,
            color: bodyA.render.fillStyle
          })
          vibrate()
          World.remove(world, bodyA)
          World.remove(world, bodyB)
          World.remove(world, constraint)
          couldCollapse = true
          World.add(world, circle)
          let sound
          switch (index) {
            case 9:
              sound = duang
              preloadSound(bat)
              preloadImage(batman)
              break
            case 10:
              sound = bat
              preloadSound(pika)
              preloadImage(pikachu)
              break
            case 11:
              sound = pika
              preloadSound(ultra)
              preloadImage(ultraman)
              break
            case 12:
              sound = ultra
              break
            default:
              sound = duang
          }
          makeSound(sound)
        }, 100)
        break
      }
    }
  }

  Events.on(engine, 'collisionStart', collapse)
  Events.on(engine, 'collisionActive', collapse)
  Events.on(engine, 'collisionEnd', collapse)

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
  let startTime
  let endTime
  let startX
  let endX

  function doMouseDownNMove(event) {
    if (!couldAdd) return
    const { mouse: { absolute: { x }}, source } = event
    if (!radius) {
      radius = radiusList[randomNum(0, defaultCount - 1)]
    }
    // 禁止拖拽球
    source.constraint.bodyB = null

    // 设置时间位置
    startTime = endTime
    startX = endX
    endTime = new Date().getTime()
    endX = x
  
    // circle && Composite.remove(world, circle)
    const left = 25 + radius
    const right = width - 25 - radius
    let currX = x
    if (x < left) {
      currX = left
    } else if (x > right) {
      currX = right
    }
    if (circle) {
      Body.setPosition(circle, { x: currX, y: radius + 25 })
    } else {
      circle = Bodies.circle(currX, radius + 25, radius, { ...circleOptions(radius), isStatic: true })
      Composite.add(world, circle)
    }
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
    circle = null
    const left = 25 + radius
    const right = width - 25 - radius
    let currX = x
    if (x < left) {
      currX = left
    } else if (x > right) {
      currX = right
    }
    const c = Bodies.circle(currX, radius + 25, radius, { ...circleOptions(radius) })

    // 计算 x 方向速度
    // const deltaTime = endTime - startTime
    // const deltaX = endX - startX
    // if (deltaX && deltaTime) {
    //   let vx = deltaX / deltaTime * 15
    //   if (Math.abs(vx) < 3) {
    //     vx = 0
    //   }
    //   if (vx > 50) {
    //     vx = 50
    //   }
    //   if (vx < -50) {
    //     vx = -50
    //   }
    //   Body.setVelocity(c, {x: vx, y: 0})
    // }

    Events.on(c, 'mousemove', null)
    Events.on(c, 'sleepStart', function(event) {
      if (event.source.position.y <= 100) {
        onGameover()
      }
    })
    Composite.add(world, c)
    radius = undefined
    addNextBall()
    couldAdd = false
    startTime = undefined
    endTime = undefined
    startX = undefined
    endX = undefined
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
    },
    restart: function() {
      const allBodies = Composite.allBodies(world)
      allBodies.forEach(body => {
        if (body.label === 'Circle Body' && body.position.x !== 0 && body.position.y !== 0) {
          World.remove(world, body)
        }
      })
    }
  }
}


const times = (n: number, func: (v: number) => any) =>
  Array(n)
    .fill(null)
    .map((_, i) => func(i))

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

const WaterMelon = (props: any) => {
  const { w, h } = props
  const wrapper: any = useRef()
  const [game, setGame] = useState<any>()
  const [clickable, setClickable] = useState(true)

  const { setFireworks, fireworks } = useExplode({ game })

  useEffect(() => {
    setGame(Game({
      element: wrapper.current,
      height: h,
      width: w,
      onGameover: () => {
        Modal.success({
          title: 'Gameover',
          content: 'click ok to restart',
          onOk: game.current.restart,
          centered: true
        })
      },
      onCollapse: ({ x, y, color}) => {
        const p = {
          age: 0,
          phase: 'explode',
          sparks: generateSparks(10),
          x,
          y,
          color
        }
        setFireworks([...fireworks, p])
      }
    }))
  }, [w, h])

  const toggleGravity = useCallback(() => {
    const allBodies = Composite.allBodies(game.engine.world)
    allBodies.filter(body => body.label === 'Circle Body').forEach(body => {
      Matter.Sleeping.set(body, false)
    })
    setClickable(false)
    game.engine.world.gravity.y = -1
    setTimeout(() => {
      game.engine.world.gravity.y = 1
      setTimeout(() => setClickable(true), 1000)
    }, 1000)
  }, [game])

  const restart = useCallback(() => {
    game.restart()
  }, [game])

  useEffect(() => {
    preloadSound(duang)
  }, [])

  return (
    <div className="watermelon-wrapper">
      <div ref={wrapper} />
      <div className="btn-wrapper">
        <Popconfirm
          title="Sure about that?"
          onConfirm={restart}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" className="restart-btn">重新开始</Button>
        </Popconfirm>
        <Button disabled={!clickable} type="primary" onClick={toggleGravity} className="gravity-btn">逆转重力</Button>
      </div>
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