import { createTamagui } from '@tamagui/core';
import { config } from '@tamagui/config/v3';

const appConfig = createTamagui({
  ...config,
  tokens: {
    ...config.tokens,
    color: {
      ...config.tokens.color,
      primary: '#041F2B',
      primaryLight: '#0a3a4f',
      primaryDark: '#03151d',
      accent: '#0ea5e9',
      background: '#ffffff',
      backgroundSoft: '#f8fafb',
      text: '#1a1a1a',
      textSecondary: '#4a5568',
      textTertiary: '#718096',
      border: '#e2e8f0',
      borderLight: '#f1f5f9',
    },
  },
});

export default appConfig;

export type Conf = typeof appConfig;

declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}
