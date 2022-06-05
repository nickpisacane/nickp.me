import * as React from 'react';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {logEvent} from './firebase';

export const InviteInfo = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        mt: 4,
      }}>
      <Typography textAlign="center">Saturday June 18th at 6 PM</Typography>
      <Link
        // href="https://goo.gl/maps/F6hV1NiCD9anMHtT9"
        href="http://maps.apple.com/?address=2794+St+Marys+Way+Salt+Lake+City,+UT+84108&t=m"
        onClick={() => {
          logEvent('InviteInfo:InviteInfo:map_click');
        }}
        sx={{textAlign: 'center'}}>
        2794 St Marys Way Salt Lake City, UT 84108
      </Link>
    </Box>
  );
};
