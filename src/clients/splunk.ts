import type { RawAxiosRequestHeaders } from 'axios'
import axios from 'axios'

export default class Splunk {
  private host: string
  private port: string
  private headers: RawAxiosRequestHeaders

  constructor(host: string, port: string, headers: RawAxiosRequestHeaders) {
    this.host = host
    this.port = port
    this.headers = headers
  }

  public async postLog(log: unknown): Promise<unknown> {
    return axios.post(
      `https://${this.host}:${this.port}/services/collector/event`,
      log,
      { headers: this.headers }
    )
  }
}
