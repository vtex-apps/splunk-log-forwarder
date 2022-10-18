export interface Settings {
  token: string,
  host: string,
  port: string
}

export const APP_ID = process.env.VTEX_APP_ID!

export async function settings(ctx: Context, next: () => Promise<any>) {
  // const {
  //   clients: {
  //     apps
  //   }
  // } = ctx

  Object.assign(ctx.state, {host: 'prd-p-afuet.splunkcloud.com', port: '8088', token: 'e8f313fc-3990-4d63-8907-83d7f975286a'})

  await next()
}