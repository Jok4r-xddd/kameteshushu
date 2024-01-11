const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const socket = io()

const skoreElement = document.querySelector('#skore')

const devicePixelRatio = window.devicePixelRatio || 1

window.addEventListener('click', () => {
    const bgAudio = document.querySelector('#bgAud')
    bgAudio.volume = 0.3
    bgAudio.play()
})

canvas.width = 1400 * devicePixelRatio
canvas.height = 787.5 * devicePixelRatio

c.scale(devicePixelRatio,devicePixelRatio)

const x = canvas.width / 2
const y = canvas.height / 2

/* const frontEndHrac = new Hrac(x, y, 10, 'white') */
const frontEndHraci = {}
const frontEndStrely = {}

const vystrelSfx = document.querySelector('#gfAud')

socket.on('updateStrely', (backEndStrely) => {
    for (const id in backEndStrely) {
        const backEndStrela = backEndStrely[id]

        if(!frontEndStrely[id]) {

            vystrelSfx.play()

            frontEndStrely[id] = new Strela({
                x: backEndStrela.x, 
                y: backEndStrela.y, 
                radius: 5,
                barva: frontEndHraci[backEndStrela.hracId]?.barva,
                velocity: backEndStrela.velocity
            })

        } else {
            frontEndStrely[id].x += backEndStrely[id].velocity.x 
            frontEndStrely[id].y += backEndStrely[id].velocity.y
        }
    }

    for (const frontEndStrelaId in frontEndStrely) { 
        if (!backEndStrely[frontEndStrelaId]) {

            

            delete frontEndHraci[frontEndStrelaId]
            delete frontEndStrely[frontEndStrelaId]
        }
    }
})

socket.on('updateHraci', (backEndHraci) => {
    for (const id in backEndHraci) {
        const backEndHrac = backEndHraci[id]

        if (!frontEndHraci[id]) {
            frontEndHraci[id] = new Hrac({
                x: backEndHrac.x,
                y: backEndHrac.y, 
                radius: 11, 
                barva: backEndHrac.barva,
                jmeno: backEndHrac.jmeno
            })

            document.querySelector('#hraci-lb').innerHTML += `<div style="margin-bottom: 10px;" data-id="${id}" data-score="${backEndHrac.score}">${backEndHrac.jmeno}: ${backEndHrac.skore}</div>`
        } else {

            document.querySelector(`div [data-id="${id}"]`).textContent = `${backEndHrac.jmeno}: ${backEndHrac.skore}`
            document.querySelector(`div [data-id="${id}"]`).setAttribute('data-score', backEndHrac.skore)

            const parDiv = document.querySelector('#hraci-lb')
            const childDivy = Array.from(parDiv.querySelectorAll('div'))

            childDivy.sort((a,b) => {
                const scoreA = Number(a.getAttribute('data-score'))
                const scoreB = Number(b.getAttribute('data-score'))

                return scoreB - scoreA
            })

            childDivy.forEach(div => {
                parDiv.removeChild(div)
            })

            childDivy.forEach(div => {
                parDiv.appendChild(div)
            })

            frontEndHraci[id].cil = {
                x: backEndHrac.x,
                y: backEndHrac.y
            }

            if(id === socket.id) {
    
                const posledniBackEndVstup = hracVstupy.findIndex(vstup => { 
                    return backEndHrac.sekvenceCislo === vstup.sekvenceCislo
                })
    
                if(posledniBackEndVstup > -1) {
                    hracVstupy.splice(0, posledniBackEndVstup + 1)
    
                    hracVstupy.forEach(vstup => {
                        frontEndHraci[id].target.x += vstup.dx
                        frontEndHraci[id].target.y += vstup.dy
                    })
                } 
            } 
      
        }
    }

    //mazani frontend hracu
    for (const id in frontEndHraci) { 
        if (!backEndHraci[id]) {
            delete frontEndHraci[id]

                   
            const smrtSFX = document.querySelector('#dedAud')
            smrtSFX.play()
            
            const divMazani = document.querySelector(`div [data-id="${id}"]`)
            divMazani.parentNode.removeChild(divMazani)

            if(id === socket.id) {
                document.querySelector('#jmenoForm').style.display = 'block'
            }
        }
    }
})


let animationId

function animate() {
    animationId = requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    for (const id in frontEndHraci) {
        const frontEndHrac = frontEndHraci[id]

        if(frontEndHrac.cil) {
            frontEndHraci[id].x += (frontEndHraci[id].cil.x - frontEndHraci[id].x) * 0.5
            frontEndHraci[id].y += (frontEndHraci[id].cil.y - frontEndHraci[id].y) * 0.5
        }

        frontEndHrac.draw()
    }

    for (const id in frontEndStrely) {
        const frontEndStrela = frontEndStrely[id]
        frontEndStrela.draw()
    }
}

animate()

const klavesy = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}

const hracVstupy = []
let sekvenceCislo = 0

setInterval(() => {
    if (klavesy.w.pressed) {
        sekvenceCislo++
        hracVstupy.push({sekvenceCislo, dx: 0, dy: -RYCHLOOOOOOOOOST})
        frontEndHraci[socket.id].y -= RYCHLOOOOOOOOOST
        socket.emit('keydown', {klavesaKlic: 'KeyW', sekvenceCislo})
    }
    if (klavesy.a.pressed) {
        sekvenceCislo++
        hracVstupy.push({sekvenceCislo, dx: -RYCHLOOOOOOOOOST, dy: 0})
        frontEndHraci[socket.id].x -= RYCHLOOOOOOOOOST
        socket.emit('keydown',  {klavesaKlic: 'KeyA', sekvenceCislo})
    } 
    if (klavesy.s.pressed) {
        sekvenceCislo++
        hracVstupy.push({sekvenceCislo, dx: 0, dy: RYCHLOOOOOOOOOST})
        frontEndHraci[socket.id].y += RYCHLOOOOOOOOOST
        socket.emit('keydown',  {klavesaKlic: 'KeyS', sekvenceCislo})
    }
    if (klavesy.d.pressed) {
        sekvenceCislo++
        hracVstupy.push({sekvenceCislo, dx: RYCHLOOOOOOOOOST, dy: 0})
        frontEndHraci[socket.id].x += RYCHLOOOOOOOOOST
        socket.emit('keydown',  {klavesaKlic: 'KeyD', sekvenceCislo})
    }
},15)

const RYCHLOOOOOOOOOST = 5

window.addEventListener('keydown', (event) => {
    if(!frontEndHraci[socket.id]) return

    switch(event.code) {
        case 'KeyW':
            klavesy.w.pressed = true
            break
        case 'KeyA':
            klavesy.a.pressed = true
            break
        case 'KeyS':
            klavesy.s.pressed = true
            break
        case 'KeyD':
            klavesy.d.pressed = true
            break
    }
    
})

window.addEventListener('keyup', (event) => {
    if(!frontEndHraci[socket.id]) return

    switch(event.code) {
        case 'KeyW':
            klavesy.w.pressed = false
            break
        case 'KeyA':
            klavesy.a.pressed = false
            break
        case 'KeyS':
            klavesy.s.pressed = false
            break
        case 'KeyD':
            klavesy.d.pressed = false
            break
    }
})

document.querySelector('#jmenoForm').addEventListener('submit', (event) => {
    event.preventDefault()
    document.querySelector('#jmenoForm').style.display = 'none'
    socket.emit('initHra', {jmeno: document.querySelector('#jmenoInp').value,  width: canvas.width, height: canvas.height, devicePixelRatio})
})