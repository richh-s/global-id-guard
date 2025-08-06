import { query } from '../config/database'

export interface AppConfig {
  supportedCountries: string[]
}

/**
 * Reads a single-row config table.
 */
export async function getConfig(): Promise<AppConfig> {
  const rows = await query<AppConfig>(
    'SELECT supported_countries FROM app_config LIMIT 1'
  )
  return { supportedCountries: rows[0].supportedCountries }
}

/**
 * Updates the global config.
 */
export async function updateConfig(
  updates: Partial<AppConfig>
): Promise<AppConfig> {
  // Example: only one row with ID=1
  const rows = await query<AppConfig>(
    `UPDATE app_config
     SET supported_countries = $1
     WHERE id = 1
     RETURNING supported_countries`,
    [updates.supportedCountries]
  )
  return { supportedCountries: rows[0].supportedCountries }
}
