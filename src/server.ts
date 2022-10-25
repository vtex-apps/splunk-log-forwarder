import Koa from 'koa'

import { fetchAppToken } from './middlewares/fetch-app-token'
import { logsForwarder } from './middlewares/forwarder'
import router from './routes'
import { setup } from './middlewares/setup'

const app = new Koa()
const port = process.env.PORT ?? 8080

const middlewares = [setup, fetchAppToken, logsForwarder]

middlewares.forEach((middleware) => app.use(middleware))

app.on('error', (err: Error) => {
  console.error('Error', err)
})
app.use(router.routes())

const server = app.listen(port, () => {
  console.log(`App listening on the port ${port}`)
})

export { app, server }
