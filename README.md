# Logs Stream Client Example

Basic implementation that consumed VTEX IO Logs Stream to foward for Splunk.

## Architecture Overview

![Overview](https://github.com/vtex-apps/splunk-log-forwarder/blob/main/docs/architecture-overview.png?raw=true "High level architecture")

VTEX IO Logs API is implemented using [Server-sent events](https://en.wikipedia.org/wiki/Server-sent_events). It enables servers to stream messages to clients through HTTP.

This is a simple client implementation that receives VTEX Logs in a stream through server-sent events, bull them, to send to a Splunk HTTP Event Collector.

## VTEX Logs Stream API

### Authorization

Authorization is needed, for a client to call Logs Stream API

First thing required is to have Application Credentials that allow logs to be consumed from stream.

To make this, go to your VTEX Account admin, at the Roles panel and create a new Role for Logs consumption. This role should have `Application Logs Stream` as product added, with `Read logs stream` permission.

![new role panel](https://github.com/vtex-apps/splunk-log-forwarder/blob/main/docs/VTEX%20new%20roles%20panel.png?raw=true "New role panel")

With the new role created, an application key could be created using the given role as following.

![add app key](https://github.com/vtex-apps/splunk-log-forwarder/blob/main/docs/VTEX%20add%20aplication%20key%20panel.png?raw=true "Add Applicaton Key")

Application Key and Token generated previously, can now be used to authenticate your client, so requests to the Logs Stream API is authorized.

To exchange authenticate your client the following API could be used.

curl https://vtexid.vtex.com.br/api/vtexid/pub/authenticate/default?user={{key}}&pass={{token}}

This call will return a similar payload.

```
{
    "authStatus": "Success",
    "authCookie": {
        "Name": "VtexIdclientAutCookie",
        "Value": "<token>"
    },
    "accountAuthCookie": null,
    "expiresIn": 86399,
    "userId": "..."
}
```

The token inside `authCookie.Value` is the one needed to for this API to work.

### Requests to the Logs stream


With the proper Auth token set `TOKEN=<token>`. API calls could be made as following.

```
curl http://infra.io.vtex.com/skidder/v1/{{account}}/{{workspace}}/logs/stream -H "Authorization: $TOKEN" -H 'User-Agent: test' -H 'Accept: text/event-stream'
```

Returing data example

```
event:message
data:{"level":"warn","app":"<app-vendor>.<app-name>@<app-version>","account":"<account>","workspace":"<workspace>","production":true,"data":{"signal":"SIGTERM"},"operationId":"","requestId":""}
```

Server will keep sending those events to the client as long as logs are available at the stream.
If connection is aborted by the client, the server will stop sending the data. 

Clients could resume the stream at the point they stopped consuming. The server keep this state reading the `User-Agent` header. User-Agent could be changed to get all events from the begin.

## Event types

There are two kinds of events at the Logs stream. `Logs` and `Metrics`.

Metric events are identified by the attribute `type: metric/status`, where logs have no type assigned to them.

Logs have different log levels, that could be defined by the application developer, as described [here](https://developers.vtex.com/vtex-developer-docs/docs/vtex-io-documentation-managing-application-logs#implementing-the-vtex-io-logging-service).

## Implementation details


## Scripts

Following scripts are available to be used with [yarn](https://classic.yarnpkg.com/en/docs/install/):

- `yarn build` - Builds the service generating final files in the `dist` folder. This will use `tsc` to convert the `TypeScript` files to pure `JavaScript`
- `yarn start` - Builds the service and start it on `localhost` in `prodution` mode
- `yarn dev` - Builds the service and start it service on `localhost` in `development` mode
- `yarn watch` - Starts the service on `localhost` with [nodemon](https://github.com/remy/nodemon) and [ts-node](https://typestrong.org/ts-node/), and automatically restarts the server when `src` files are changed
- `yarn debug` - Starts the service on `localhost` ready for debugging the execution
- `yarn lint` - Lints and formats the code
