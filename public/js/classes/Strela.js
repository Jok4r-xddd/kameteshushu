class Strela {
    constructor({x, y, radius, barva = 'white', velocity}) {
        this.x = x
        this.y = y
        this.radius = radius
        this.barva = barva
        this.velocity = velocity
    }

    draw() {
        c.save()
        c.shadowColor = this.barva
        c.shadowBlur = 40
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.barva
        c.fill()
        c.restore()
    }

    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}