
import { Howl } from 'howler'

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

export const vibrate = () => {
  const n: any = window.navigator
  navigator.vibrate = n.vibrate || n.webkitVibrate || n.mozVibrate || n.msVibrate
  navigator.vibrate && navigator.vibrate(200)
}