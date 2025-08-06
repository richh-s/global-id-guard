import pino from 'pino'

/**
 * Centralized logger for the application.
 * Supports different levels and structured JSON output.
 */
export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    process.env.NODE_ENV === 'production'
      ? undefined
      : { target: 'pino-pretty', options: { colorize: true } },
})
