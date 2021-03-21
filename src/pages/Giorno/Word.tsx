import Utils from '@utils'
export default class Word {
  text: string
  x: number
  y: number
  font: string
  speed: number
  constructor({ key, w, h }) {
    this.text = key
    this.x = Math.random() * w
    this.y = Math.random() * h
    const size = Utils.random(2, 8)
    this.font = size * 10 + 'px arial'
    this.speed =
      (size > 5 ? size - 2.5 : size) + Utils.random(0, 5)
  }
}
