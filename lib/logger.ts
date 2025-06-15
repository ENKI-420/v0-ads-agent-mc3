interface LogLevel {
  ERROR: "error"
  WARN: "warn"
  INFO: "info"
  DEBUG: "debug"
}

const LOG_LEVELS: LogLevel = {
  ERROR: "error",
  WARN: "warn",
  INFO: "info",
  DEBUG: "debug",
}

interface LogEntry {
  level: keyof LogLevel
  message: string
  timestamp: string
  metadata?: Record<string, any>
  error?: Error
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === "development"
  private logLevel = process.env.LOG_LEVEL || "info"

  private shouldLog(level: keyof LogLevel): boolean {
    const levels = ["debug", "info", "warn", "error"]
    const currentLevelIndex = levels.indexOf(this.logLevel)
    const messageLevelIndex = levels.indexOf(level)
    return messageLevelIndex >= currentLevelIndex
  }

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, metadata, error } = entry
    let logMessage = `[${timestamp}] ${level.toUpperCase()}: ${message}`

    if (metadata) {
      logMessage += ` | Metadata: ${JSON.stringify(metadata)}`
    }

    if (error) {
      logMessage += ` | Error: ${error.message}`
      if (this.isDevelopment) {
        logMessage += ` | Stack: ${error.stack}`
      }
    }

    return logMessage
  }

  private createLogEntry(
    level: keyof LogLevel,
    message: string,
    metadata?: Record<string, any>,
    error?: Error,
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      metadata,
      error,
    }
  }

  private writeLog(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return

    const formattedLog = this.formatLog(entry)

    // Console output
    switch (entry.level) {
      case "error":
        console.error(formattedLog)
        break
      case "warn":
        console.warn(formattedLog)
        break
      case "info":
        console.info(formattedLog)
        break
      case "debug":
        console.debug(formattedLog)
        break
    }

    // In production, you might want to send logs to external services
    if (!this.isDevelopment) {
      this.sendToExternalService(entry)
    }
  }

  private async sendToExternalService(entry: LogEntry): Promise<void> {
    // Example: Send to logging service like DataDog, LogRocket, etc.
    // This is a placeholder for production logging integration
    try {
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // })
    } catch (error) {
      console.error("Failed to send log to external service:", error)
    }
  }

  debug(message: string, metadata?: Record<string, any>): void {
    const entry = this.createLogEntry("debug", message, metadata)
    this.writeLog(entry)
  }

  info(message: string, metadata?: Record<string, any>): void {
    const entry = this.createLogEntry("info", message, metadata)
    this.writeLog(entry)
  }

  warn(message: string, metadata?: Record<string, any>): void {
    const entry = this.createLogEntry("warn", message, metadata)
    this.writeLog(entry)
  }

  error(message: string, metadata?: Record<string, any>, error?: Error): void {
    const entry = this.createLogEntry("error", message, metadata, error)
    this.writeLog(entry)
  }
}

export const logger = new Logger()
