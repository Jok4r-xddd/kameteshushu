class Hrac {
    constructor({x, y, radius, barva, jmeno}) {
        this.x = x
        this.y = y
        this.radius = radius
        this.barva = barva
        this.jmeno = jmeno
    }

    draw() {
        c.font = '14px Roboto'
        c.fillStyle = '#fff'
        c.fillText(this.jmeno, this.x , this.y + 42)
        c.save()
        c.shadowColor = this.barva
        c.shadowBlur = 20
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.barva
        c.fill()
        c.restore()
    }
}