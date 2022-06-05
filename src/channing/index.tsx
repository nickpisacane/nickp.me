import * as React from 'react';
import {createRoot} from 'react-dom/client';
import {Channing} from './Channing';
import {InviteForm} from './InviteForm';
import CssBaseline from '@mui/material/CssBaseline';
import {InviteInfo} from './InviteInfo';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import {fetchInvitee, logEvent} from './firebase';
import {ThemeProvider} from '@mui/material/styles';
import {theme} from './theme';
import {fire} from './confetti';

const LoadingOverlay = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
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
    logEvent('index:App:onMount:load');
    setLoading(true);
    fetchInvitee()
      .catch((err) => {
        logEvent('index:App:onMount:fetch_invitee_failed', {
          errorMessage: err.message,
          errorStack: err.stack,
        });
      })
      .finally(() => {
        setLoading(false);
        setTimeout(fire, 500);
      });
  }, []);

  if (loading) {
    return <LoadingOverlay />;
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          p: 4,
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
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  );
};

const root = createRoot(document.querySelector('#root'));
root.render(<Wrapper />);
