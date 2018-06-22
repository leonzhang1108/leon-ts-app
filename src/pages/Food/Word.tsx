import Utils from '@utils'
export default class Word {
  text: string
  x: number
  y: number
  font: string
  speed: number
  constructor({ key, words, w, h}) {
    this.text = key;
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.font = words[key] * 10 + 'px arial'
    this.speed = (words[key] > 5 ? words[key] - 2.5 : words[key]) + Utils.random(0, 5)
  }
}