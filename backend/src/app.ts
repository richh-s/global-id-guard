// src/app.ts

import express from 'express'
import cors from 'cors'
import { config } from './config'
import authRoutes from './routes/authRoutes'
import verifyRoutes from './routes/verifyRoutes'
import verificationRequestsRoutes from './routes/verificationRequestRoutes'
import dashboardRoutes from './routes/dashboardRoutes'
import auditLogRoutes from './routes/auditLogRoutes'
import addressVerificationRoutes from './routes/addressVerificationRoutes'
import fraudDetailsRoutes from './routes/fraudDetailsRoutes'
import configRoutes from './routes/configRoutes'
import { errorMiddleware } from './middlewares/errorMiddleware'

const app = express()

// Allow CORS from any origin (you can lock this down in production)
app.use(cors())

// Parse incoming JSON payloads
app.use(express.json())

// Mount all API routes under /api
app.use('/api/auth', authRoutes)
app.use('/api/verify', verifyRoutes)
app.use('/api/verification-requests', verificationRequestsRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/audit-logs', auditLogRoutes)
app.use('/api/address-verify', addressVerificationRoutes)
app.use('/api/fraud-details', fraudDetailsRoutes)
app.use('/api/config', configRoutes)

// Global error handler (must come after all routes)
app.use(errorMiddleware)

export default app
