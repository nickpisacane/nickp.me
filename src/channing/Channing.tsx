import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';

const SIZE = 128;
const CONTAINER_SIZE = SIZE * 1.1;

export const Channing = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
      <Typography variant="h4" textAlign="center" sx={{mb: 2}}>
        Your Invited!
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: CONTAINER_SIZE,
          height: CONTAINER_SIZE,
          mb: 2,
        }}>
        <Box
          sx={{
            width: CONTAINER_SIZE,
            height: CONTAINER_SIZE,
            borderRadius: CONTAINER_SIZE / 2,
            position: 'absolute',
            zIndex: 0,
            backgroundImage:
              'linear-gradient(124deg, #ff2400, #e81d1d, #e8b71d, #e3e81d, #1de840, #1ddde8, #2b1de8, #dd00f3, #dd00f3);',
            animation: 'avatar-pulsate 3s ease-in-out infinite',
          }}></Box>
        <Avatar
          alt="Channing"
          src="/img/channing.jpg"
          sx={{width: SIZE, height: SIZE}}
        />
      </Box>
      <Typography variant="h4" textAlign="center">
        Channing's 35th!
      </Typography>
    </Box>
  );
};
