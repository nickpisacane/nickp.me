import {getInvitee, Invitee, onChange, updateInvitee} from './firebase';
import {useState, useEffect} from 'react';

type InviteeAPI = {
  invitee: Invitee;
  update: typeof updateInvitee;
};

export const useInvitee = (): [Invitee, typeof updateInvitee] => {
  const [invitee, setInvitee] = useState(getInvitee());

  useEffect(() => {
    const sub = onChange((invitee) => {
      setInvitee({...invitee});
    });

    return () => {
      sub.release();
    };
  }, []);

  return [invitee, updateInvitee];
};
