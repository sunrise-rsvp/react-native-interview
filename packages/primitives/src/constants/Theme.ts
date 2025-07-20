import { DarkTheme } from '@react-navigation/native';
import { MD3DarkTheme, configureFonts } from 'react-native-paper';
import { Colors } from './Colors';

export const PaperTheme = {
  ...MD3DarkTheme,
  fonts: configureFonts({ config: { fontFamily: 'Poppins' } }),
};

export const SunriseTheme = {
  dark: true,
  fonts: {
    regular: {
      fontFamily: 'Poppins',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Poppins',
      fontWeight: '400',
    },
    light: {
      fontFamily: 'Poppins-Light',
      fontWeight: '300',
    },
    bold: {
      fontFamily: 'Poppins-Bold',
      fontWeight: '700',
    },
    heavy: {
      fontFamily: 'Poppins-Bold',
      fontWeight: '700',
    },
  },
  colors: {
    ...DarkTheme.colors,
    primary: Colors.purple0,
    background: Colors.purple0,
    card: Colors.purple0,
    text: Colors.text,
  },
} as const;
