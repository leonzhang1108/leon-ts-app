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
import { useCountUp } from 'react-countup'
import { thousands } from 'noshjs'
import './index.less'

const {
  Engine,
  Render,
  Runner,
  Composite,
  MouseConstraint,
  Mouse,
  World,
  Bodies,
  Events,
  Body,
  Constraint,
} = Matter

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
  '#f45f7c',
  '#0376c2',
  '#be3223',
  '#BAB0AC'
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
  friction: 0.01,
  frictionStatic: 0.01,
  frictionAir: 0.01,
  isStatic: true,
  render: {
    fillStyle: '#000'
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
      friction: 0.01,
      frictionStatic: 0.01,
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

const Game = function({ element, height, width, onCollapse, onGameover }) {

  // create engine
  const engine = Engine.create({
    enableSleeping: true
  })
  engine.timing.timeScale = 1
  const world = engine.world
  world.gravity.y = 1.2

  // create renderer
  const render = Render.create({
    element,
    engine,
    options: {
      width,
      height: height,
      background: '#333',
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

  function doMakeSound(index) {
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
  }

  function run() {
    Matter.Render.run(render)
    Matter.Runner.run(runner, engine)
  }

  function restart() {
    const allBodies = Composite.allBodies(world)
    allBodies.filter(body => body.label === 'Circle Body' && !body.isStatic).forEach(body => World.remove(world, body))
    onGameover()
    run()
  }

  function stop() {
    Matter.Render.stop(render)
    Matter.Runner.stop(runner)
  }

  const collapseSet = new Set()

  function collapse(event) {
    const pairs = event.pairs
    const circleName = 'Circle Body'
    for (let i = 0; i < pairs.length; i++) {
      const { bodyA: circleA, bodyB: circleB } = pairs[i]
      const { label: labelA, circleRadius: ra, id: idA } = circleA
      const { label: labelB, circleRadius: rb, id: idB } = circleB
      const index = Math.floor(getBaseLog(time, ra / 10))
      // 是否 id 重复
      const isIdDuplicated = !collapseSet.has(idA) && !collapseSet.has(idB)
      // 是否为圆
      const isCircle = labelA === circleName && labelB === circleName
      // 是否半径相同
      const isRadiusSame = Math.floor(ra) === Math.floor(rb)
      // index是否比大西瓜小
      const isIndexInRange = index < 13
      // 是否可合并
      const isCollabsable = isIdDuplicated && isCircle && isRadiusSame && isIndexInRange

      if (isCollabsable) {
        // 锁住不让其他圈圈合成
        collapseSet.add(idA)
        collapseSet.add(idB)
        // 激活所有球
        const allBodies = Composite.allBodies(engine.world)
        allBodies.filter(body => body.label === 'Circle Body').forEach(body => {
          Matter.Sleeping.set(body, false)
        })
        const { position: positionA, velocity: velocityA, mass } = circleA
        const { position: positionB, velocity: velocityB } = circleB
        const { x: ax, y: ay } = positionA
        const { x: bx, y: by } = positionB
        const x = (ax + bx) / 2
        const y = (ay + by) / 2
        const position = { x, y }
        const { x: vxa, y: vya } = velocityA
        const { x: vxb, y: vyb } = velocityB
        const vx = vxb - vxa
        const vy = Math.abs(vyb - vya)
        const radius = time * ra
        const circle = Bodies.circle(x, y, radius, circleOptions(radius))
        Events.on(circle, 'sleepStart', function(event) {
          if (event.source.position.y <= 100) {
            stop()
            Modal.success({
              title: 'Game Over',
              content: 'click ok to restart',
              onOk: restart,
              centered: true
            })
          }
        })
        const ratio = mass / circle.mass
        Body.set(circleA, 'collisionFilter', { ...circleA.collisionFilter, group: -Math.floor(radius) })
        Body.set(circleB, 'collisionFilter', { ...circleB.collisionFilter, group: -Math.floor(radius) })
        Body.setVelocity(circleA, { x: 0, y: 0 })
        Body.setVelocity(circleB, { x: 0, y: 0 })
        Body.setVelocity(circle, { x: vx * ratio, y: vy * ratio })
        const constraint = Constraint.create({
          bodyA: circleA,
          bodyB: circleB,
          stiffness: 0.04,
          length: 0,
          render: {
            strokeStyle: 'transparent'
          }
        })
        World.add(world, [constraint])
        doMakeSound(index)

        setTimeout(() => {
          onCollapse({
            ...position,
            color: circleA.render.fillStyle,
            point: index - 2
          })
          vibrate()
          World.remove(world, circleA)
          World.remove(world, circleB)
          World.remove(world, constraint)
          World.add(world, circle)
          // 放开合成判断
          collapseSet.delete(circleA.id)
          collapseSet.delete(circleB.id)
        }, 100)
        break
      }
    }
  }

  Events.on(engine, 'collisionStart', collapse)
  Events.on(engine, 'collisionActive', collapse)
  // Events.on(engine, 'collisionEnd', collapse)

  World.add(world, [
    // walls
    // Bodies.rectangle(width / 2, 0, width, 50, rectangleOptions()),
    Bodies.rectangle(width / 2, height - 25, width, 50, rectangleOptions()),
    Bodies.rectangle(0, -height, 50, height * 4, rectangleOptions()),
    Bodies.rectangle(width, -height, 50, height * 4, rectangleOptions())
  ])

  // add mouse control
  const mouse = Mouse.create(render.canvas)
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0,
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
    const { mouse: { absolute: { x }} } = event
    if (!radius) {
      radius = radiusList[randomNum(0, defaultCount - 1)]
    }
  
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
      Body.setPosition(circle, { x: currX, y: radius })
    } else {
      circle = Bodies.circle(currX,  radius, radius, { ...circleOptions(radius), isStatic: true })
      Composite.add(world, circle)
    }
  }

  function addNextBall() {
    if (!radius) {
      radius = radiusList[randomNum(0, defaultCount - 1)]
    }
    circle = Bodies.circle(25 - radius, radius, radius, { ...circleOptions(radius), isStatic: true })
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
    const c = Bodies.circle(currX, radius, radius, { ...circleOptions(radius) })

    Events.on(c, 'sleepStart', function(event) {
      if (event.source.position.y <= 100) {
        stop()
        Modal.success({
          title: 'Game Over',
          content: 'click ok to restart',
          onOk: restart,
          centered: true
        })
      }
    })
    Composite.add(world, c)
    radius = undefined
    addNextBall()
    couldAdd = false
    setTimeout(() => {
      couldAdd = true
    }, 400)
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
    stop,
    restart,
    run
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
    const color = colors[i % 12]
    return {
      color,
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
  const [score, setScore] = useState(0)

  const { setFireworks } = useExplode({ game })

  const { countUp, update } = useCountUp({
    start: 0,
    end: 0,
    duration: 0.5
  })

  useEffect(() => {
    update(score)
  }, [score])

  useEffect(() => {
    setGame(Game({
      element: wrapper.current,
      height: h,
      width: w,
      onCollapse: ({ x, y, point }) => {
        const p = {
          age: 0,
          sparks: generateSparks(20),
          x,
          y
        }
        setFireworks(fireworks => [...fireworks, p])
        setScore(score => score + point)
      },
      onGameover: () => {
        setScore(0)
      }
    }))
    preloadSound(duang)
  }, [])

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
    game.stop()
    game.restart()
  }, [game])

  return (
    <div className="watermelon-wrapper">
      <div className="score">{thousands(countUp)}</div>
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