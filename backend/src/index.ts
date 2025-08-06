import dotenv from 'dotenv'
dotenv.config()

import app from './app'
import { config } from './config'

const PORT = config.PORT
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
