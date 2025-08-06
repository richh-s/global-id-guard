import { z } from 'zod'

// Define and validate all environment variables here
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(32),
})

export type Env = z.infer<typeof envSchema>
export const config = envSchema.parse(process.env)
