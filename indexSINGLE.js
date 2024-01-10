const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const scoreEl = document.querySelector('#skore')

canvas.width = innerWidth
canvas.height = innerHeight

const x = canvas.width / 2
const y = canvas.height / 2

const hrac = new Hrac(x, y, 10, 'white')
const strely = []
const souperi = []
const particles = []

function spawnSouperi() {
    setInterval(() => {
        const radius = Math.random() * (30 - 4) + 4

        let x
        let y

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }

        const color = `hsl(${Math.random() * 360}, 50%, 50%)`

        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x)

        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }

        souperi.push(new Souper(x, y, radius, color, velocity))
    }, 1000)
}

let animationId
let score = 0

function animate() {
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0, 0, 0, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    hrac.draw()

    for (let index = particles.length - 1; index >= 0; index--) {
        const particle = particles[index]

        if (particle.alpha <= 0) {
            particles.splice(index, 1)
        } else {
            particle.update()
        }
    }

    for (let index = strely.length - 1; index >= 0; index--) {
        const strela = strely[index]

        strela.update()

        // =====================================
        // NICIME PARTiCLE ABY NESEKALO KDYZ JE PRYC
        // ========================================
        if (
            strela.x - strela.radius < 0 ||
            strela.x - strela.radius > canvas.width ||
            strela.y + strela.radius < 0 ||
            strela.y - strela.radius > canvas.height
        ) {
            strely.splice(index, 1)
        }
    }

    for (let index = souperi.length - 1; index >= 0; index--) {
        const souper = souperi[index]

        souper.update()

        const dist = Math.hypot(hrac.x - souper.x, hrac.y - souper.y)


        // =====================================
        // KONEC HRY
        // ========================================
        if (dist - souper.radius - hrac.radius < 1) {
            cancelAnimationFrame(animationId)
        }

        for (
            let strelyIndex = strely.length - 1; strelyIndex >= 0; strelyIndex--
        ) {
            const strela = strely[strelyIndex]

            const dist = Math.hypot(strela.x - souper.x, strela.y - souper.y)


            // =====================================
            // KOLIZE PROEJCTILE
            // ========================================
            if (dist - souper.radius - strela.radius < 1) {

                // =====================================
                // TVORENI EXPLOZE particlu
                // ========================================
                for (let i = 0; i < souper.radius * 2; i++) {
                    particles.push(
                        new Particle(
                            strela.x,
                            strela.y,
                            Math.random() * 2,
                            souper.color, {
                                x: (Math.random() - 0.5) * (Math.random() * 6),
                                y: (Math.random() - 0.5) * (Math.random() * 6)
                            }
                        )
                    )
                }
                // 
                // =====================================
                // zmensovani soupere
                // ========================================
                if (souper.radius - 10 > 5) {
                    score += 100
                    scoreEl.innerHTML = score
                    gsap.to(souper, {
                        radius: souper.radius - 10
                    })
                    strely.splice(strelyIndex, 1)
                } else {

                    // =====================================
                    // KDYZ MOC MALEJ TAK ZNCIIT a pridat socre
                    // ========================================
                    score += 50
                    scoreEl.innerHTML = score

                    souperi.splice(index, 1)
                    strely.splice(strelyIndex, 1)
                }
            }
        }
    }
}

animate()
spawnSouperi()