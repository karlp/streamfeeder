//  import '@mdi/font/css/materialdesignicons.min.css';
import 'vuetify/styles';
import { createVuetify, type ThemeDefinition } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'


const themeTweak: ThemeDefinition = {
  dark: true,
  // pretty much extracted from tweak.au
  colors: {
    background: '#333333',
    primary: '#90ffa0', // lime green
    secondary: '#639fab', // pacific blue,
  },
}


export const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    themes: {
      themeTweak,
    },
    defaultTheme: 'themeTweak',
    variations: {
      colors: ['primary'],
      lighten: 3,
      darken: 3
    },
  },
});