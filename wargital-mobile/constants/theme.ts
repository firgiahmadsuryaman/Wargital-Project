import { Platform } from 'react-native';

const tintColorLight = '#C0772C';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#1F1F1F',
    background: '#FFFBE6',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    cardBackground: '#FFFFFF',
    primary: '#C0772C',
    secondaryText: '#666666',
    border: '#E5E5E5',
    inputBackground: '#FFFBE6',
    success: '#6E8048',
    warning: '#D97706',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    cardBackground: '#000',
    primary: '#C0772C',
    secondaryText: '#9BA1A6',
    border: '#333',
    inputBackground: '#333',
    success: '#6E8048',
    warning: '#D97706',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
});
