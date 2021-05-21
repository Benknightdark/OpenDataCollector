const express = require('express')
var cookieParser = require('cookie-parser')

const next = require('next')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const protectedRoute = ['task']
const unProtectedRoute = ['signin', 'register']

app.prepare().then(() => {
  const server = express()
  server.use(cookieParser())

  server.all('*', (req, res) => {
    // const authCookie = req.cookies['next-auth.session-token'];
    // const isApi = req.url.toUpperCase().includes('/API')
    // if (!isApi) {
    //   return handle(req, res)
    // }
    // if (authCookie == null) {
    //   const check = protectedRoute.filter(p => req.url.toUpperCase().includes(p.toUpperCase()))
    //   if (check.length > 0) {
    //     res.redirect("/auth/signin")
    //     return handle(req, res)
    //   }
    // } else {
    //   const check = unProtectedRoute.filter(p => req.url.toUpperCase().includes(p.toUpperCase()))
    //   if (check.length > 0) {
    //     res.redirect("/")
    //     return handle(req, res)
    //   }
    // }
    return handle(req, res)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})