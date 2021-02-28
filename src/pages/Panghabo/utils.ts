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
