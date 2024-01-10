window.addEventListener('click', (event) => {
    
    const canvas = document.querySelector('canvas')

    const {top, left} = canvas.getBoundingClientRect()

    const hracPozice = {
        x: frontEndHraci[socket.id].x ,
        y: frontEndHraci[socket.id].y 
    }

    const uhel = Math.atan2(
        event.clientY - top - hracPozice.y ,
        event.clientX - left - hracPozice.x
    )

    socket.emit('vystrel', {
        x: hracPozice.x ,
        y: hracPozice.y ,
        uhel 
    })

})