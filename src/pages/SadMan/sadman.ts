export default class SadMan {
  ctx
  constructor (ctx) {
    this.ctx = ctx
  }
  drawHead (t) {
    this.ctx.save()
    this.ctx.beginPath()
    this.ctx.translate(0, Math.sin(t) * 4)
    this.ctx.arc(80, -35, 35, 0, 2 * Math.PI)
    this.ctx.fill()
    this.ctx.closePath()
    this.ctx.restore()
  }
  drawBody (t) {
    this.ctx.beginPath()
    this.ctx.save()
    this.ctx.rotate(Math.sin(t) * Math.PI / 180 * -1)
    this.ctx.translate(0, Math.sin(t) * 4)
    this.ctx.scale(0.5, 0.5)
    const body = new Path2D('M125,284 L1,284 C0.33333333,94.6666667 35,0 105,0 C115.666667,4 122.333333,20.6666667 125,50 L125,284 Z')
    this.ctx.fill(body)
    this.ctx.restore()
    this.ctx.closePath()
  }
  drawFeet (t) {
    t = t / 2
    this.ctx.save()
    this.ctx.scale(0.5, 0.5)
    this.ctx.translate(0, 460)
    const foot = new Path2D('M23,0 C67,0 80,16 80,22 C80,26 78.6666667,28 76,28 C29.3333333,28 6,28 6,28 C6,28 -1.34111707e-14,30 0,17 C1.42108547e-14,4 10,1.9505735e-16 13,0 C16,0 13,0 23,0 Z')

    this.ctx.save()
    this.ctx.translate(Math.cos(t) * -50, Math.sin(t) > 0 ? Math.sin(t) * -35 : 0)
    if (t < Math.PI) {
      this.ctx.rotate(Math.sin(t) * Math.PI / 180 * -5)
    }
    this.ctx.fill(foot)
    this.ctx.restore()

    this.ctx.save()
    this.ctx.translate(Math.cos(t + Math.PI) * -50, Math.sin(t + Math.PI) > 0 ? Math.sin(t + Math.PI) * -35 : 0)
    if (t > Math.PI) {
      this.ctx.rotate(Math.sin(t + Math.PI) * Math.PI / 180 * -5)
    }
    this.ctx.fill(foot)
    this.ctx.restore()

    this.ctx.restore()
  }
  drawShadow (t) {
    this.ctx.beginPath()
    this.ctx.save()
    this.ctx.scale(0.5, 0.5)
    this.ctx.translate(45, 490)
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
    this.ctx.ellipse(0, 0, 120 + Math.sin(t) * 10, 8, 0, 0, 2 * Math.PI)
    this.ctx.fill()
    this.ctx.restore()
    this.ctx.closePath()
  }
  draw (t) {
    t = t % Math.PI * 2
    this.ctx.fillStyle = '#eee'
    this.ctx.save()
    this.ctx.translate(window.innerWidth * 0.5 - 140, window.innerHeight * 0.5 - 80)
    this.drawShadow(t)
    this.drawHead(t)
    this.drawBody(t)
    this.drawFeet(t)
    this.ctx.restore()
  }
}
