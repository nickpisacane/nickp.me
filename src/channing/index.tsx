import * as React from 'react';
import {createRoot} from 'react-dom/client';
import {Channing} from './Channing';
import {InviteForm} from './InviteForm';
import CssBaseline from '@mui/material/CssBaseline';
import {InviteInfo} from './InviteInfo';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import {fetchInvitee} from './firebase';

const LoadingOverlay = () => {
  return (
    <Box
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.25)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <CircularProgress />
    </Box>
  );
};

const App = () => {
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    setLoading(true);
    fetchInvitee().finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <>
      {loading && <LoadingOverlay />}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}>
        <Channing />
        <InviteInfo />
        <InviteForm />
      </Box>
    </>
  );
};

const Wrapper = () => {
  return (
    <>
      <CssBaseline />
      <App />
    </>
  );
};

const root = createRoot(document.querySelector('#root'));
root.render(<Wrapper />);
