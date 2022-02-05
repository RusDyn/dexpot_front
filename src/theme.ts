import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#5040b2',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
      // light: '#7366c1',
      // dark: '#382c7c',
    },
    secondary: {
      main: 'rgba(255, 255, 255, 0.87)',
      // light: will be calculated from palette.primary.main,
      //light: 'rgb(174, 141, 229)',
    },
    text: {
      primary: 'rgba(255, 255, 255, 0.87)',
      secondary: '#9575cd',
    },
    background: {
      paper: '#171d2a',
      default: '#101724',
    },
  },
  typography: {
    fontFamily: ['Roboto', 'sans-serif'].join(','),
  },
  components: {
    MuiTooltip: {
      defaultProps: {
        enterTouchDelay: 100,
      },
    },
  },
});
theme = responsiveFontSizes(theme);
export default theme;
