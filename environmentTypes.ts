type Environment = 'development' | 'production' | 'test';

interface DevConfig {
  debugMode: boolean;
  logLevel: 'verbose' | 'debug';
}

interface ProdConfig {
  optimize: boolean;
  logLevel: 'warn' | 'error';
}

interface TestConfig {
  mockData: boolean;
  logLevel: 'silent' | 'debug';
}

export type ConfigType<E extends Environment> = E extends 'development'
  ? DevConfig
  : E extends 'production'
    ? ProdConfig
    : TestConfig;

const environment = (process.env.NODE_ENV || 'development') as Environment;

export const config: ConfigType<typeof environment> = (() => {
  switch (environment) {
    case 'development':
      return {
        debugMode: true,
        logLevel: 'debug',
      } as ConfigType<'development'>;

    case 'production':
      return {
        optimize: true,
        logLevel: 'error',
      } as ConfigType<'production'>;

    case 'test':
      return {
        mockData: true,
        logLevel: 'silent',
      } as ConfigType<'test'>;

    default:
      throw new Error(`Unknown environment: ${environment}`);
  }
})();
