import { Context, Next } from 'koa'

export const setup = async (ctx: Context, next: Next) => {
  ctx.vtex = {}
  ctx.splunk = {}

  ctx.vtex.account = process.env.VTEX_ACCOUNT
  ctx.vtex.workspace = process.env.VTEX_WORKSPACE
  ctx.vtex.appKey = process.env.VTEX_APP_KEY
  ctx.vtex.appToken = process.env.VTEX_APP_TOKEN

  ctx.splunk.host = process.env.SPLUNK_HOST
  ctx.splunk.port = process.env.SPLUNK_PORT
  ctx.splunk.token = process.env.SPLUNK_TOKEN

  await next()
}
