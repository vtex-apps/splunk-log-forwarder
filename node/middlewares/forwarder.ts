import { AuthType, Logger } from '@vtex/api'
import { LogSource } from '../clients/logsource'
import Splunk from '../clients/splunk'

/**
 * If isn't tolerable to be asleep while logs are generated,
 * this should be at least as great as the time Skidder would
 * take to restart this service
 */
const timeToLiveInMs = 60 * 1000
const timeBetweenBatchsInMs = 10000
const maxSizeBatch = 500

export async function forwarder(ctx: Context, next: () => Promise<any>) {

  setImmediate(async () => {
    startEventSource(ctx)
  })

  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')

  await next()  
}

function startEventSource(ctx: Context) {
  const { vtex: { authToken, logger }, state: {host, port, token}, clients: {splunk} } = ctx
  splunk.setup(host)

  const es = new LogSource(ctx.vtex, {
    headers: {
      Authorization: `${AuthType.bearer} ${authToken}`,
      'User-Agent': `splunk-forwarder#${host}-${port}`,
      'x-vtex-upstream-target': 'prod-developer-IOAdmins-eks-apv-us-east-1a'
    }
  })

  es.onopen = () => {
    logger.debug('connection started')
  }

  es.onerror = (err) => {
    logger.error(`Error reading logs: ${JSON.stringify(err, null, 2)}`)
  }

  const wd = new Watchdog(timeToLiveInMs, es.close);
  wd.start()

  const splunkHeaders = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Splunk ${token}`,
      'x-vtex-use-https': true,
      'x-vtex-use-port': port
    }
  }

  const batcher = new LogsBulk(splunk, splunkHeaders, logger)

  es.addEventListener('message', async (msg: any) => {
    wd.rearm()

    try {
      const res = await batcher.batchMessage(JSON.parse((msg as any).data))
      logger.debug(res)
    } catch (error) {
      logger.error(`Error sending log: ${error}`)
    }
  })
}

class Watchdog {
  private timeoutHandler?: any
  constructor(private timeout: number, private onTimedOut: Function) { }

  public start() {
    this.timeoutHandler = setTimeout(() => this.onTimedOut, this.timeout);
  }

  public rearm() {
    clearTimeout(this.timeoutHandler)
    this.start()
  }
}

class LogsBulk {
  private messages: any[]
  private watchdog: Watchdog

  constructor(private client: Splunk, private headers: any, private logger: Logger) {
    this.messages = []
    this.watchdog = new Watchdog(timeBetweenBatchsInMs, () => this.sendBatch())
    this.watchdog.start()
  }

  async batchMessage(msg: any) {
    if (this.messages.push(splunkEvent(msg)) >= maxSizeBatch) {
      await this.sendBatch()
    }
  }

  async sendBatch() {
    this.watchdog.rearm()
    const total = this.messages.length

    if (total > 0) {
      const breakingPoint = Math.min(maxSizeBatch, total)
      const batch = this.messages.slice(0, breakingPoint)
      this.messages = this.messages.slice(breakingPoint)

      this.logger.debug(`sending batch with ${batch.length}/${total} logs`)
      await this.client.postLog(batch, this.headers)
    }
  }

  async postLogs(logs: any[]): Promise<string | void> {
    try {
      return this.client.postLog(logs, this.headers)
    } catch (reason) {
      this.logger.error(reason)
      this.messages.concat(logs)
    }
  }
}

function splunkEvent(msg: any): any {
  return {'event': msg}
}
