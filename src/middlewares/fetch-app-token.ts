import type { Context, Next } from 'koa'
import axios from 'axios'

export const fetchAppToken = async (ctx: Context, next: Next) => {
  const {
    vtex: { appKey, appToken },
  } = ctx

  const response = await axios.get(
    `https://vtexid.vtex.com.br/api/vtexid/pub/authenticate/default`,
    {
      params: {
        user: appKey,
        pass: appToken,
      },
    }
  )

  ctx.vtex.VtexIdClientAutCookie = response.data.authCookie.Value

  await next()
}
