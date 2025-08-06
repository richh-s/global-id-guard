import 'dotenv/config'    // auto-loads .env
import app from './app'
import { config } from './config'

const PORT = config.PORT
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
