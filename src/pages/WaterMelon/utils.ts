
import Matter from 'matter-js'
import { Howl, Howler } from 'howler'

const { Render } = Matter

export const doExplode = (render) => {
  Render.startViewTransform(render)
  render.context.globalAlpha = 0.7
      
  const hue = 250 + Math.round((1 - Math.min(1, 100 / 10)) * 170)
  render.context.fillStyle = 'hsl(' + hue + ', 100%, 55%)'
  render.context.fillRect(50, 50, 20, 20)

  render.context.globalAlpha = 1
  Render.endViewTransform(render)
}

export const makeSound = (music) => {
  const sound = new Howl({
    src: [music]
  })
  sound.play()
}

export const preloadSound = (src) => {
  const sound = new Howl({
    src: [src],
    volume: 0
  })
  sound.play()
}

export const preloadImage = (url) => {
  const img = new Image()
  img.src = url
}