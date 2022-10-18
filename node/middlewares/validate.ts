import { UserInputError } from '@vtex/api'

export async function validate(ctx: Context, next: () => Promise<any>) {
  validateHost(ctx.state.host) 
  validatePort(ctx.state.port) 
  validateToken(ctx.state.token)

  await next()
}

function validateHost(host: string) : boolean {
  if (!host) {
    throw new UserInputError('Error parsing Apps config: host is not present')
  }
  
  return true
}

function validatePort(port: string) : boolean {
  if (!port) {
    throw new UserInputError('Error parsing Apps config: port is not present')
  }

  return true
}

function validateToken(token: string) : boolean {
  if (!token) {
    throw new UserInputError('Error parsing Apps config: token is not present')
  }

  return true
}