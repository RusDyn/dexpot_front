import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Input,
  Link as MuiLink,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
import Moralis from 'moralis';
import { callApi } from './a/[...slug]';
import Link from 'next/link';
import MenuIcon from '@mui/icons-material/Menu';

interface NavbarProps {}

///
const Home: NextPage<NavbarProps> = () => {
  const [address, setAddress] = useState('');
  const [lastAddresses, setLastAddresses] = useState([]);
  const [count, setCount] = useState(0);
  const [showConnect, setShowConnect] = useState(false);
  const onGoClick = () => {
    const url = `/a/${address}`;
    window.location.replace(url);
  };

  const onConnect = async () => {
    const result = await Moralis.authenticate();
    console.log(result);
  };

  const currentUser = showConnect ? Moralis.User.current() : undefined;
  const accounts = currentUser?.attributes?.accounts || [];

  const onRandomClick = async () => {
    const { address } = await callApi('randomAddress');
    const url = `/a/${address}`;
    window.location.replace(url);
  };

  const onLogout = async () => {
    Moralis.User.logOut();
  };
  const initMoralis = async () => {
    await Moralis.start({
      appId: process.env.NEXT_PUBLIC_MORALIS_APP,
      serverUrl: process.env.NEXT_PUBLIC_MORALIS_SERVER,
    });
    setShowConnect(true);

    const items = await callApi('lastAddresses');
    setLastAddresses(items);

    const info = await callApi('info');
    const { count } = info;
    setCount(count);
  };
  useEffect(() => {
    initMoralis();
  }, []);

  return (
    <main>
      <AppBar position="static">
        <Toolbar variant="dense">
          {/*
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          */}
          <MuiLink href={'/'}>
            <Typography variant="h6" color="textPrimary" component="div">
              Home
            </Typography>
          </MuiLink>
        </Toolbar>
      </AppBar>
      <Container maxWidth="xl" sx={{ minHeight: '100vh' }}>
        <Typography variant={'h1'} align="center">
          DEXPORT
        </Typography>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant={'body1'} align="center">
              Made by Alex "Dyn" Pavlov (SOLO)
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={'body1'} align="center">
              Special for{' '}
              <MuiLink href={'https://web3.ethglobal.com/'}>ROAD2WEB3</MuiLink>{' '}
              Hackaton
            </Typography>
          </Grid>
          <Grid container item xs={12} md={8} sx={{ paddingTop: 10 }}>
            <Grid item>
              <Typography variant={'h4'}>
                Enter your wallet address in Polygon
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant={'body1'}>
                And receive the most detailed analytics of your portfolio as
                charts and valuable indicators. This includes:
              </Typography>
              <Typography variant={'body1'}>- Balance history</Typography>
              <Typography variant={'body1'}>- Return history</Typography>
              <Typography variant={'body1'}>
                - Assets allocation (soon)
              </Typography>
              <Typography variant={'body1'}>
                - Traders indicators (soon){' '}
              </Typography>
              <Typography variant={'body1'}>
                - Revenue per month, CAGR, etc (ssssooon)
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant={'h4'}>
                Learn, improve and share with your friends
              </Typography>
            </Grid>
          </Grid>
          <Grid
            item
            container
            alignContent={'center'}
            justifyItems="center"
            justifyContent={'center'}
            textAlign="center"
            xs={12}
            md={4}
            spacing={1}
          >
            <Grid item></Grid>
            <Grid item xs={12}>
              <Input
                title={'enter wallet address'}
                placeholder={'enter wallet address'}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                sx={{ minWidth: '200px' }}
                size={'large'}
                onClick={onGoClick}
              >
                GO
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                sx={{ minWidth: '200px' }}
                size={'large'}
                variant={'outlined'}
                onClick={onRandomClick}
              >
                I'm feeling lucky
              </Button>
            </Grid>
            {showConnect && !currentUser && (
              <Grid item xs={12}>
                <Button
                  sx={{ minWidth: '200px' }}
                  size={'large'}
                  variant={'contained'}
                  onClick={onConnect}
                >
                  Connect
                </Button>
              </Grid>
            )}
            {currentUser && (
              <>
                <Typography variant={'caption'} align={'center'}>
                  Wallet connected
                </Typography>
                <Button
                  sx={{ minWidth: 0, padding: '0 10px', marginLeft: 1 }}
                  size={'small'}
                  variant={'contained'}
                  onClick={onLogout}
                >
                  X
                </Button>
              </>
            )}
            <Grid container item>
              {accounts.map((address) => (
                <Grid xs={12} item key={address}>
                  <Link href={`/a/${address}`}>
                    <MuiLink href={`/a/${address}`}>
                      <Typography variant={'body2'}>{address}</Typography>
                    </MuiLink>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} sx={{ paddingTop: 10 }}>
            <Typography variant={'h4'}>Analyzed: {count} addresses</Typography>
            <Typography variant={'h6'}>Last:</Typography>
          </Grid>
          <Grid item container>
            {lastAddresses.map((address) => (
              <Grid xs={12} item key={address}>
                <Link href={`/a/${address}`}>
                  <MuiLink href={`/a/${address}`}>
                    <Typography variant={'body2'}>{address}</Typography>
                  </MuiLink>
                </Link>
              </Grid>
            ))}
          </Grid>
          <Grid item></Grid>
          <Grid item></Grid>
        </Grid>
      </Container>
    </main>
  );
};

Home.propTypes = {};

export default Home;
