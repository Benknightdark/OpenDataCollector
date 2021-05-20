const Koa = require('koa')
const next = require('next')
const Router = require('@koa/router')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next.default({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = new Koa.default()
  const router = new Router()

  router.all('(.*)', async (ctx) => {
    await handle(ctx.req, ctx.res)
    // console.log(ctx.href)
    console.log(ctx.cookies.get("next-auth.session-token"))
    ctx.respond = false
  })

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })

  server.use(router.routes())
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})