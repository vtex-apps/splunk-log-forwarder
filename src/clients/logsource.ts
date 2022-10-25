// eslint-disable-next-line @typescript-eslint/no-require-imports
import EventSource = require('eventsource')

export class LogSource extends EventSource {
  constructor(
    account: string,
    workspace: string,
    opts: EventSource.EventSourceInitDict
  ) {
    console.debug({ opts })
    const url = `http://infra.io.vtex.com/skidder/v1/${account}/${workspace}/logs/stream`

    console.debug(`connecting with ${url}`)
    super(url, opts)
  }
}
