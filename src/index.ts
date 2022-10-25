import { config } from 'dotenv'

config({ path: './src/.env' })

// eslint-disable-next-line import/first
import { app, server } from './server'

export { app, server }
