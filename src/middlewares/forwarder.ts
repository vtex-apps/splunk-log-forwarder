import type { Context } from 'koa'

import { LogSource } from '../clients/logsource'
import Splunk from '../clients/splunk'

interface Message {
  data: string
}

interface SplunkEvent {
  event: unknown
}

const bufferIntervalInMillis = 15 * 1000

export async function logsForwarder(ctx: Context, next: () => Promise<any>) {
  setImmediate(async () => {
    startEventSource(ctx)
  })

  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')

  await next()
}

function startEventSource(ctx: Context) {
  const {
    vtex: { account, workspace, VtexIdClientAutCookie },
    splunk: { host, port, token },
  } = ctx

  const es = new LogSource(account, workspace, {
    headers: {
      Authorization: VtexIdClientAutCookie,
      'User-Agent': `splunk-forwarder#${host}-${port}`,
    },
  })

  const splunk = new Splunk(host, port, {
    'Content-Type': 'application/json',
    Authorization: `Splunk ${token}`,
  })

  const buffer = new LogsBulk(splunk)

  es.onopen = () => {
    console.debug('connection started')
    setTimeout(async () => {
      await buffer.sendBulk()
      console.debug('Closing stream')
      es.close()
    }, bufferIntervalInMillis)
  }

  es.onerror = (err) => {
    console.error(`Error reading logs: ${JSON.stringify(err, null, 2)}`)
  }

  es.addEventListener('message', async (message: Message) => {
    console.debug({ message })
    buffer.addMessage(JSON.parse(message.data))
  })
}

class LogsBulk {
  private messages: SplunkEvent[]

  constructor(private client: Splunk) {
    this.messages = []
  }

  public async addMessage(msg: Message) {
    console.debug('message added to buffer')
    this.messages.push(splunkEvent(msg))
  }

  public async sendBulk() {
    if (this.messages.length > 0) {
      console.debug(`sending bulk with ${this.messages.length} logs`)
      await this.client.postLog(this.messages)
    }
  }
}

function splunkEvent(msg: Message): SplunkEvent {
  return { event: msg }
}
