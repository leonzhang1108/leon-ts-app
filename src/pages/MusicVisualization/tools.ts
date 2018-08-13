export default {
  draw: param => {
    const { ctx, height, width, bars, barColor } = param
    return (arr, volumn) => {
      const vol = volumn
      ctx.clearRect(0, 0, width, height)
      if (Array.isArray(barColor)) {
        const line = ctx.createLinearGradient(0, 0, 0, height)
        const len = barColor.length
        barColor.forEach((color, i) => {
          line.addColorStop(i / (len - 1), color)
        })
        ctx.fillStyle = line
      } else {
        ctx.fillStyle = barColor
      }
      const rectWidth = width / bars
      const barWidth = rectWidth * 0.5
      const capHeight = Math.min(barWidth, 10) * vol
      for (let i = 0; i < bars; i++) {
        const rectHeight = arr[i] / 256 * height * vol
        const capDistance = arr[i] > 0
          ? Math.min(rectHeight + 40, height - capHeight)
          : 0
        ctx.fillRect(rectWidth * i, height - rectHeight, barWidth, rectHeight)
        ctx.fillRect(rectWidth * i, height - (capDistance + capHeight), barWidth, capHeight)
      }
    }
  }
}
