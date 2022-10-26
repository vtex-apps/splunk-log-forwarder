import type { Context, Next } from 'koa'
import axios from 'axios'

export const fetchAppToken = async (ctx: Context, next: Next) => {
  const {
    vtex: { account, appKey, appToken },
  } = ctx

  const response = await axios.post(
    `https://api.vtexcommercestable.com.br/api/vtexid/apptoken/login`,
    {
      appkey: appKey,
      apptoken: appToken
    },
    {
      params: {
        an: account
      },
    }
  )

  ctx.vtex.VtexIdClientAutCookie = response.data.token

  await next()
}
