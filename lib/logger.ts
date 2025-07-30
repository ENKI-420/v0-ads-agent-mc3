// lib/logger.ts
type LogLevel = "debug" | "info" | "warn" | "error"

const LOG_LEVEL_MAP: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

class Logger {
  private currentLevel: number

  constructor() {
    const logLevelEnv = process.env.LOG_LEVEL?.toLowerCase() as LogLevel
    this.currentLevel = LOG_LEVEL_MAP[logLevelEnv] || LOG_LEVEL_MAP.info // Default to info
  }

  private writeLog(level: LogLevel, message: string, metadata?: any) {
    if (LOG_LEVEL_MAP[level] >= this.currentLevel) {
      const timestamp = new Date().toISOString()
      const logEntry = {
        timestamp,
        level: level.toUpperCase(),
        message,
        metadata: metadata || {},
      }
      // In a real application, you might send this to a logging service (e.g., Datadog, Sentry)
      // For now, we'll log to console.
      console.log(JSON.stringify(logEntry))
    }
  }

  debug(message: string, metadata?: any) {
    this.writeLog("debug", message, metadata)
  }

  info(message: string, metadata?: any) {
    this.writeLog("info", message, metadata)
  }

  warn(message: string, metadata?: any) {
    this.writeLog("warn", message, metadata)
  }

  error(message: string, metadata?: any) {
    this.writeLog("error", message, metadata)
  }
}

export const logger = new Logger()
