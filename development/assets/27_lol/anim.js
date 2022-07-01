module.exports = {
    idle: {
        from: 0,
        to: 5,
        loop: true
    },
    transition: {
        from: 6,
        to: 21,
        loop: false
    },
    scary: {
        from: 16,
        to: 21,
        loop: true
    }
}

/* 
module.exports = {
    idle: {
        from: 0,
        to: x,
        loop: true,
        speed: 5
    },
    otherState: {
        from: x,
        to: y,
        loop: true,
        speed: 5
    }
}
*/