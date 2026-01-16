import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const isSmallDevice = SCREEN_WIDTH < 375;
export const isMediumDevice = SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;
export const isLargeDevice = SCREEN_WIDTH >= 414;

export const getResponsiveValue = (small: number, medium: number, large: number) => {
  if (isSmallDevice) return small;
  if (isMediumDevice) return medium;
  return large;
};

export const getResponsiveFontSize = (baseSize: number) => {
  const scale = SCREEN_WIDTH / 375;
  return Math.max(baseSize * scale, baseSize * 0.9);
};

export const getResponsivePadding = (basePadding: number) => {
  return getResponsiveValue(basePadding * 0.8, basePadding, basePadding * 1.1);
};

export const getResponsiveMargin = (baseMargin: number) => {
  return getResponsiveValue(baseMargin * 0.8, baseMargin, baseMargin * 1.1);
};

export const SCREEN_DIMENSIONS = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
};
