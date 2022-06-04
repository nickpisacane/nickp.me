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
      }}>
      <Typography sx={{mb: 2}}>Can you attend?</Typography>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}>
        <Button
          variant={invitee.canAttend === true ? 'outlined' : 'contained'}
          color="success"
          sx={{mr: 2}}
          onClick={() => updateInvitee({canAttend: true})}>
          Yes
        </Button>
        <Button
          variant={invitee.canAttend === false ? 'outlined' : 'contained'}
          color="error"
          onClick={() => updateInvitee({canAttend: false})}>
          No
        </Button>
      </Box>
      {invitee.canAttend === true && (
        <DetailForm invitee={invitee} updateInvitee={updateInvitee} />
      )}
      {invitee.canAttend === false && (
        <Typography sx={{mt: 4}}>
          Sorry you can't make it. See you next time!
        </Typography>
      )}
    </Box>
  );
};

const DetailForm: React.FC<{
  invitee: Invitee;
  updateInvitee: UpdateInvitee;
}> = ({invitee, updateInvitee}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        mt: 4,
      }}>
      <TextField
        label="Name(s)"
        value={invitee.name}
        onChange={(e) => updateInvitee({name: e.currentTarget.value})}
      />
      <TextField
        sx={{mt: 4}}
        label="Side(s)"
        helperText="[OPTIONAL] Please let us know what sides you can bring"
        value={invitee.willBring ?? ''}
        onChange={(e) => updateInvitee({willBring: e.currentTarget.value})}
      />
      <SideList />
    </Box>
  );
};

const SideList = () => {
  const sides = useSideList();
  return (
    <List sx={{maxHeight: 300, overflowX: 'auto'}}>
      {sides.map((side, i) => (
        <ListItem key={`${side.id}`}>
          <ListItemText primary={side.side} secondary={side.name} />
        </ListItem>
      ))}
    </List>
  );
};
