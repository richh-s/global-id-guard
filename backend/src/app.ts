// src/app.ts
import express from 'express'
import cors from 'cors'

import authRoutes from './routes/authRoutes'
import verifyRoutes from './routes/verifyRoutes'
import verificationRequestsRoutes from './routes/verificationRequestRoutes' // ← note the plural
import dashboardRoutes from './routes/dashboardRoutes'
import auditLogRoutes from './routes/auditLogRoutes'
import addressVerificationRoutes from './routes/addressVerificationRoutes'

import configRoutes from './routes/configRoutes'
import { errorMiddleware } from './middlewares/errorMiddleware'
import documentRoutes from './routes/documentRoutes'
import { UPLOAD_DIR } from './config/uploads'
import metricsRoutes from './routes/metricsRoutes'
import fraudDetectionRoutes from './routes/fraudDetectionRoutes'

const app = express()

// CORS (tighten in prod)
app.use(cors())

// Body parsers (needed so req.body is not undefined)
app.use(express.json({ limit: '5mb' }))              // JSON bodies
app.use(express.urlencoded({ extended: true }))      // form-urlencoded bodies

// (Multipart/form-data is parsed per-route via multer)

// Optional: quick health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/verify', verifyRoutes)
app.use('/api/verification-requests', verificationRequestsRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/audit-logs', auditLogRoutes)
app.use('/api/address-verify', addressVerificationRoutes)
app.use('/api/fraud-detection', fraudDetectionRoutes);
app.use('/api/config', configRoutes)
app.use('/api/documents', documentRoutes)
app.use('/files', express.static(UPLOAD_DIR))
app.use('/api/metrics', metricsRoutes)
// Global error handler (after routes)
app.use(errorMiddleware)

export default app
