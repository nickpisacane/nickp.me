import * as React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';

export const Channing = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
      <Typography variant="h4" textAlign="center">
        Channing is turning 35!
      </Typography>
      <Avatar
        alt="Channing"
        src="/img/channing.jpg"
        sx={{width: 128, height: 128}}
      />
    </Box>
  );
};
