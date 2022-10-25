# Node Service Starter for VTEX IO apps

## Scripts

Following scripts are available to be used with [yarn](https://classic.yarnpkg.com/en/docs/install/):

- `yarn build` - Builds the service generating final files in the `dist` folder. This will use `tsc` to convert the `TypeScript` files to pure `JavaScript`
- `yarn start` - Builds the service and start it on `localhost` in `prodution` mode
- `yarn dev` - Builds the service and start it service on `localhost` in `development` mode
- `yarn watch` - Starts the service on `localhost` with [nodemon](https://github.com/remy/nodemon) and [ts-node](https://typestrong.org/ts-node/), and automatically restarts the server when `src` files are changed
- `yarn debug` - Starts the service on `localhost` ready for debugging the execution
- `yarn test` - Runs tests from `src/__tests__` with `jest`
- `yarn lint` - Lints and formats the code
