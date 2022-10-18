import { IOContext } from '@vtex/api'
import  EventSource  = require('eventsource')

export class LogSource extends EventSource {
    constructor(vtex: IOContext, opts : EventSource.EventSourceInitDict) {
        const { account, workspace, logger } = vtex
        const url = `http://infra.io.vtex.com/skidder/v1/${account}/${workspace}/logs/stream`
        logger.debug(`connecting with ${url}`)
        super(url, opts)
    }
}