import { IOClients } from '@vtex/api'

import Splunk from './splunk'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get splunk() {
    return this.getOrSet('splunk', Splunk)
  }
}
