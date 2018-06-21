export default class Word {
  text: any
  x: number
  y: number
  font: string
  speed: number
  constructor({ key, words, w, h}) {
    this.text = key;
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.font = words[key] * 10 + 'px arial'
    this.speed = (words[key])
    // const random = Math.floor(Math.random()*5+1)
    // this.font = random * 10 + 'px arial'
    // this.speed = random
  }
}