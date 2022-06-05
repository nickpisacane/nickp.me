import * as React from 'react';
import {useInvitee} from './useInvitee';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {Invitee, UpdateInvitee, useSideList} from './firebase';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {fire, fireSad} from './confetti';
import {logEvent} from './firebase';

export const InviteForm = () => {
  const [invitee, updateInvitee] = useInvitee();

  return (
    <Box
      sx={{
        display: 'flex',
        py: 4,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}>
      <Typography sx={{mb: 2}} textAlign="center">
        Can you attend?
      </Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <Button
          variant="contained"
          color="primary"
          sx={{mr: 2}}
          startIcon={
            invitee.canAttend === true ? <CheckCircleIcon /> : undefined
          }
          onClick={() => {
            fire();
            updateInvitee({canAttend: true});
            logEvent('InviteForm:InviteForm:can_attend_click');
          }}>
          Yes
        </Button>
        <Button
          variant="contained"
          color="secondary"
          startIcon={
            invitee.canAttend === false ? <CheckCircleIcon /> : undefined
          }
          onClick={() => {
            fireSad();
            updateInvitee({canAttend: false});
            logEvent('InviteForm:InviteForm:cannot_attend_click');
          }}>
          No
        </Button>
      </Box>
      {invitee.canAttend === true && (
        <DetailForm invitee={invitee} updateInvitee={updateInvitee} />
      )}
      {invitee.canAttend === false && (
        <Typography sx={{mt: 4}} textAlign="center">
          Sorry you can't make it. You can use this link at any time to update
          your entry if your plans change. See you next time!
        </Typography>
      )}
    </Box>
  );
};

const DetailForm: React.FC<{
  invitee: Invitee;
  updateInvitee: UpdateInvitee;
}> = ({invitee, updateInvitee}) => {
  const hasEmptyName = invitee.name.replace(/[^a-zA-Z]/, '') === '';
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        mt: 4,
        width: '100%',
        maxWidth: '400px',
      }}>
      <Typography textAlign="center" variant="subtitle2">
        See you then! You can use this link at any time to modify your entry.
      </Typography>
      <TextField
        sx={{mt: 2}}
        label="Name(s)"
        value={invitee.name}
        onChange={(e) => updateInvitee({name: e.currentTarget.value})}
        error={hasEmptyName}
        helperText={
          hasEmptyName ? 'Please enter your first name(s)' : undefined
        }
        fullWidth
      />
      <TextField
        sx={{mt: 4}}
        label="[Optional] Side(s)"
        value={invitee.willBring ?? ''}
        onChange={(e) => updateInvitee({willBring: e.currentTarget.value})}
        fullWidth
      />
      <SideList />
    </Box>
  );
};

const SideList = () => {
  const sides = useSideList();

  return (
    <Box sx={{mt: 2}}>
      {sides.length === 0 ? (
        <Typography textAlign="center">
          No one has signed up for any sides yet.
        </Typography>
      ) : (
        <Typography textAlign="center">Who is bringing what?</Typography>
      )}
      <List sx={{maxHeight: 300, overflow: 'auto'}}>
        {sides.map((side, i) => (
          <ListItem key={`${side.id}`}>
            <ListItemText primary={side.side} secondary={side.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
