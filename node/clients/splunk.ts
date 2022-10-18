import {  IOClient, RequestConfig } from '@vtex/api'

export default class Splunk extends IOClient {
  host: string | undefined
  
  public setup(host: string){
    this.host = host
  }
  
  public async postLog(log: any, conf?: RequestConfig): Promise<string> {
    return this.http.post(
      `http://${this.host}/services/collector/event`,
      log,
      conf
    )
  }
}