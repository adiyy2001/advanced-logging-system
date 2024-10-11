 
 
import winston from 'winston';
import { DiscriminatedLogEntry, isLogLevelAllowed, LogLevel, LogLevelsByRole } from '../types/logging';
import { Role } from '../types/roles';

const winstonLogger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] [${level.toUpperCase()}]: ${message}`),
  ),
  transports: [new winston.transports.File({ filename: 'logs/app.log' })],
});

class Logger {
  private logs: DiscriminatedLogEntry[] = [];

  public roleLogger: { [R in Role]: (_message: string, _level: LogLevel) => void } = {
    User: (message, level) =>
      this.log({ role: 'User', level: level as LogLevelsByRole<'User'>, message, timestamp: new Date() }),
    Manager: (message, level) =>
      this.log({ role: 'Manager', level: level as LogLevelsByRole<'Manager'>, message, timestamp: new Date() }),
    Admin: (message, level) =>
      this.log({ role: 'Admin', level: level as LogLevelsByRole<'Admin'>, message, timestamp: new Date() }),
    RestrictedUser: (message, level) =>
      this.log({
        role: 'RestrictedUser',
        level: level as LogLevelsByRole<'RestrictedUser'>,
        message,
        timestamp: new Date(),
      }),
  };

  private log<R extends Role>(entry: DiscriminatedLogEntry & { role: R; level: LogLevelsByRole<R> }) {
    if (isLogLevelAllowed(entry.role, entry.level)) {
      this.logs.push(entry);
      Logger.writeToWinston(entry);
    }
  }

  private static writeToWinston(entry: DiscriminatedLogEntry): void {
    winstonLogger.log({
      level: entry.level.toLowerCase(),
      message: `[${entry.role}] ${entry.message}`,
      timestamp: entry.timestamp.toISOString(),
    });
  }

  public filterLogs(filter: (_entry: DiscriminatedLogEntry) => boolean): DiscriminatedLogEntry[] {
    return this.logs.filter(filter);
  }

  public getLogs(): DiscriminatedLogEntry[] {
    return this.logs;
  }
}

const logger = new Logger();
export default logger;
