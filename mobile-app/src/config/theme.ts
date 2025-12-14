import { MD3LightTheme } from 'react-native-paper';

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#3b82f6', // Blue 500
    onPrimary: '#ffffff',
    secondary: '#0ea5e9', // Sky 500
    background: '#0f172a', // Slate 900
    surface: '#1e293b', // Slate 800
    onSurface: '#f8fafc', // Slate 50
    text: '#f8fafc',
    error: '#ef4444',
    success: '#22c55e',
    warning: '#eab308',
    // Custom gradients
    gradients: {
      primary: ['#0f172a', '#1e1b4b'], // Slate 900 -> Indigo 950
      card: ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)'],
      button: ['#3b82f6', '#8b5cf6'], // Blue -> Purple
    },
  },
  roundness: 16,
};
