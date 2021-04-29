export function initShiled(el: any, w: number, h: number, isMobile) {
  let width = w;
  let height = h;

  let c: any = null;
  let radius: any = null;
  let center_x: any = null;
  let center_y: any = null;

  const pulseValue = 0;

  let mousex: any = null;
  let mousey: any = null;

  const colors =
  {
    shieldBlue:
      function () {
        const col = c.createRadialGradient(center_x, center_y, 0, center_x, center_y, radius);
        col.addColorStop(.3, "#576E8C");
        col.addColorStop(1.0, "#123754");
        return col;
      },
    starWhite:
      function () {
        const col = c.createRadialGradient(center_x, center_y, 0, center_x, center_y, radius);
        col.addColorStop(.5, "#EEEEEE");
        col.addColorStop(1.0, "#CCCCCC");
        return col;
      },
    shieldRed:
      function () {
        const col = c.createRadialGradient(center_x, center_y, 0, center_x, center_y, width / (isMobile ? 2.2 : 4));
        col.addColorStop(.5, "#7D3C46");
        col.addColorStop(.95, "#67252f");
        col.addColorStop(1.0, "#67252f");
        return col;
      },
    shineWhite:
      function (x, y, r) {
        const col = c.createRadialGradient(x, y, 0, x, y, r);
        const shineValue = 1.0;
        col.addColorStop(.1, 'rgba(255, 255, 255, ' + shineValue + ')');
        col.addColorStop(.2, 'rgba(255, 255, 255, ' + shineValue + ')');
        col.addColorStop(1.0, "rgba(255, 255, 255, 0)");
        return col;
      },
    baseMetal:
      function () {
        const col = c.createRadialGradient(center_x, center_y, 0, center_x, center_y, radius);
        col.addColorStop(0.9, '#999999');
        col.addColorStop(.95, '#777777');
        col.addColorStop(1.0, '#444444');
        return col;
      },
    armorNormal:
      function () {
        return "rgba(72, 87, 92, " + pulseValue + ")";
      },
    armorDark:
      function () {
        return "rgba(33, 38, 42, " + pulseValue + ")";
      },
    armorLight:
      function () {
        return "#661819";
      },
    armor:
      function () {
        const col = c.createRadialGradient(center_x, center_y, 0, center_x, center_y, width * .5);
        col.addColorStop(1.0, colors.armorDark());
        col.addColorStop(.5, colors.armorNormal());
        return col;
      }
  }

  function update() {
    clear();
    draw();
  }

  function init() {
    width = w;
    height = h;
    radius = width / (isMobile ? 2.2 : 4) * .4;
    center_x = width / 2;
    center_y = height / 2;
    mousex = center_x;
    mousey = center_y;
    el.setAttribute('width', width);
    el.setAttribute('height', height);
  }

  // Drawing functions
  function draw() {
    chestPlate();
    shield();
  }

  function clear() {
    c.fillStyle = "#000000";
    c.fillRect(0, 0, width, height);
  }

  function chestPlate() {
    c.fillStyle = colors.armor();
    c.fillRect(0, 0, width, height);
  }

  function drawFivePointStar(x, y, r, fill, stroke, strokew) {
    const step = Math.PI * 2 / 10;
    c.beginPath();
    c.strokeStyle = stroke;
    c.fillStyle = fill;
    c.lineWidth = strokew;
    for (let i = 0; i < 11; i++) {
      const an = i * step - Math.PI / 10;
      const tr = (i % 2 === 0 ? r : r * 2 / 5) - strokew * 2;
      c.lineTo(x + Math.cos(an) * tr, y + Math.sin(an) * tr);
    }
    c.closePath();
    c.stroke();
    c.fill();
  }

  function drawAsterisk(x, y, r, s, color, lwidth) {
    const step = Math.PI * 2 / s;
    c.lineWidth = 2;
    c.strokeStyle = color;
    for (let i = 0; i < s; i++) {
      const an = i * step + Math.PI / 2;
      c.beginPath();
      c.moveTo(x, y);
      c.lineTo(x + Math.cos(an) * r, y + Math.sin(an) * r);
      c.stroke();
      c.closePath();
    }
  }

  function drawHighlightGradient(x, y, r, o) {
    const thex = center_x - (center_x - mousex);
    const they = center_y - (center_y - mousey);
    const col = c.createRadialGradient(thex, they, 0, thex, they, r);
    col.addColorStop(0.4, "rgba(0, 0, 0, 0)");
    col.addColorStop(.95 - Math.abs(thex) / width / 10, "rgba(0, 0, 0, " + (o) + ")");
    col.addColorStop(1.0, "rgba(0, 0, 0," + (o + 0.3) + ")");
    c.fillStyle = col;
    c.beginPath();
    c.arc(x, y, r + 2, 0, Math.PI * 2, false);
    c.fill();
    c.closePath();
  }

  function shield() {
    const outerRadius = width / (isMobile ? 2.2 : 4);
    c.save();
    c.shadowOffsetX = 0;
    c.shadowOffsetY = 0;
    c.shadowBlur = .0125 * outerRadius;
    c.shadowColor = "#000000";


    // Outer Red
    c.beginPath();
    c.fillStyle = colors.shieldRed();
    c.arc(center_x, center_y, outerRadius, 0, Math.PI * 2, false);
    c.fill();
    c.closePath();

    // Outer Red
    c.beginPath();
    c.fillStyle = colors.starWhite();
    c.arc(center_x, center_y, outerRadius * .8, 0, Math.PI * 2, false);
    c.fill();
    c.closePath();

    // Outer Red
    c.beginPath();
    c.fillStyle = colors.shieldRed();
    c.arc(center_x, center_y, outerRadius * .6, 0, Math.PI * 2, false);
    c.fill();
    c.closePath();

    // Blue
    c.beginPath();
    c.fillStyle = colors.shieldBlue();
    c.arc(center_x, center_y, radius, 0, Math.PI * 2, false);
    c.fill();
    c.closePath();
    c.restore();

    // Star
    drawFivePointStar(center_x, center_y, radius, colors.starWhite(), 'rgba(0, 0, 0, 0)', 4);


    drawFivePointStar(center_x, center_y, radius * .85, 'rgba(0, 0, 0, 0)', "#DDDDDD", outerRadius / 320);
    drawAsterisk(center_x, center_y, radius * 2 * .83 / 5, 5, "#DDDDDD", outerRadius / 320);

    drawHighlightGradient(center_x, center_y, outerRadius, .2);
  }


  c = el.getContext('2d');
  init();
  update();

  // $(window).resize(function () {
  //   init();
  // });


}