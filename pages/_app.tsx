import type { AppProps } from 'next/app';
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider, Theme } from '@mui/material/styles';
import { CacheProvider, EmotionCache } from '@emotion/react';

import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

declare module '@mui/private-theming/defaultTheme' {
  // eslint-disable-next-line no-unused-vars
  interface DefaultTheme extends Theme {}
}

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const MyApp = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      // @ts-ignore
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <title>Equite | Public portfolio tracker</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta
          key="twt-description"
          property="twitter:description"
          content="DEX Portfolio tracker"
          data-rh="true"
        />
        <meta
          key="og-type"
          property="og:type"
          content="website"
          data-rh="true"
        />
        <meta
          key="og-title"
          property="og:title"
          content="DEX portfolio tracker"
          data-rh="true"
        />
        <meta
          key="og-locale"
          property="og:locale"
          content="en_EN"
          data-rh="true"
        />
        <meta
          key="og-site_name"
          property="og:site_name"
          content="DEXpot"
          data-rh="true"
        />
      </Head>
      <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
             <Component {...pageProps} />
          </ThemeProvider>
      </CacheProvider>
    </>
  );
};


MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
