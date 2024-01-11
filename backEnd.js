const express = require('express')
const app = express()



// SOCKET NA MULTIPLAYER
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})



const backEndHraci = {}
const backEndStrely = {}
let strelaId = 0
const radiusConst = 11


io.on('connection', (socket) => {
    console.log('Hrac pripojen')


    io.emit('updateHraci', backEndHraci)

  

    socket.on('vystrel', ({x,y,uhel}) => {
        strelaId++

        const velocity = {
            x: Math.cos(uhel) * 10,
            y: Math.sin(uhel) * 10
        }
 

        backEndStrely[strelaId] = {
            x,
            y, 
            velocity,
            hracId: socket.id
        }
    })

    socket.on('initHra', ({width, height, jmeno}) =>{
        backEndHraci[socket.id] = {
            x: 1400 * Math.random(),
            y: 787.5 * Math.random(),                 
            barva: `hsl(${360 * Math.random()}, 100%, 50%`,
            sekvenceCislo: 0,
            skore: 0,
            jmeno
        }
        
        backEndHraci[socket.id].canvas = {
            width,
            height
        }

        backEndHraci[socket.id].radius = radiusConst

   

        
    })

    socket.on('disconnect', (reason) => {
        console.log(reason)
        delete backEndHraci[socket.id]
        io.emit('updatePlayers', backEndHraci)
    })

    const RYCHLOOOOOOOOOST = 5


    socket.on('keydown', ({klavesaKlic, sekvenceCislo}) => {
        const backEndHrac = backEndHraci[socket.id]

        if(!backEndHraci[socket.id]) return
        
        backEndHraci[socket.id].sekvenceCislo = sekvenceCislo

        switch (klavesaKlic) {
            case 'KeyW':
                backEndHraci[socket.id].y -= RYCHLOOOOOOOOOST
                break
            case 'KeyA':
                backEndHraci[socket.id].x -= RYCHLOOOOOOOOOST
                break
            case 'KeyS':
                backEndHraci[socket.id].y += RYCHLOOOOOOOOOST
                break
            case 'KeyD':
                backEndHraci[socket.id].x += RYCHLOOOOOOOOOST
                break
        }

        const hracStrany = {
            left: backEndHrac.x - backEndHrac.radius,
            right: backEndHrac.x + backEndHrac.radius,
            top: backEndHrac.y - backEndHrac.radius,
            bottom: backEndHrac.y + backEndHrac.radius
        }

        if(hracStrany.left < 0) backEndHrac.x = backEndHrac.radius
        if(hracStrany.right > 1400) backEndHrac.x = 1400 - backEndHrac.radius
        if(hracStrany.top < 0) backEndHrac.y = backEndHrac.radius
        if(hracStrany.bottom > 787.5) backEndHrac.y = 787.5 - backEndHrac.radius
    })

 
})

const strelaRadius = 5

setInterval(() => {
    for (const id in backEndStrely) {
        backEndStrely[id].x += backEndStrely[id].velocity.x
        backEndStrely[id].y += backEndStrely[id].velocity.y

       
        if (backEndStrely[id].x - strelaRadius >= backEndHraci[backEndStrely[id].hracId]?.canvas?.width || backEndStrely[id].x + strelaRadius <= -10 || backEndStrely[id].y - strelaRadius >= backEndHraci[backEndStrely[id].hracId]?.canvas?.height || backEndStrely[id].y + strelaRadius <= -10) {
            delete backEndStrely[id] 
            continue
        }

        for (const hracId in backEndHraci) {
            const backEndHrac = backEndHraci[hracId]

            const vzdalenost = Math.hypot(backEndStrely[id].x - backEndHrac.x, backEndStrely[id].y - backEndHrac.y)
            
            if(vzdalenost < strelaRadius + radiusConst && backEndStrely[id].hracId !== hracId) {

                if (backEndHraci[backEndStrely[id].hracId]) 
                {
             

                    backEndHraci[backEndStrely[id].hracId].skore++
                }

                delete backEndStrely[id]
                delete backEndHraci[hracId]

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

                animate()

                break
            }
        }
    }

    io.emit('updateStrely', backEndStrely)
    io.emit('updateHraci', backEndHraci)
}, 15)


server.listen(port, () => {
    console.log(`POSLOUCHAM port ${port} kys`)
})



console.log('SERVER NASTARTOVAN :-*')