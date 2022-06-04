import * as React from 'react';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export const InviteInfo = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
      <Typography>4:30 PM on Saturday June 18th</Typography>
      <Link href="https://goo.gl/maps/F6hV1NiCD9anMHtT9">
        2794 St Marys Way Salt Lake City, UT 84108
      </Link>
    </Box>
  );
};
