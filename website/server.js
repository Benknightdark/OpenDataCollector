// const express = require('express')
// var cookieParser = require('cookie-parser')

// const next = require('next')

// const port = parseInt(process.env.PORT, 10) || 3000
// const dev = process.env.NODE_ENV !== 'production'
// const app = next({ dev })
// const handle = app.getRequestHandler()

// app.prepare().then(() => {
//   const server = express()
//   server.use(cookieParser())

//   server.all('*', (req, res) => {
//     return handle(req, res)
//   })

//   server.listen(port, (err) => {
//     if (err) throw err
//     console.log(`> Ready on http://localhost:${port}`)
//   })
// })