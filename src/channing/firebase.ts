import {initializeApp} from 'firebase/app';
import {
  getFirestore,
  Timestamp,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  collection,
} from 'firebase/firestore';
import * as uuid from 'uuid';
import * as EventEmitter from 'eventemitter3';
import * as debounce from 'lodash/debounce';
import * as React from 'react';
import {parse} from 'query-string';

const firebaseConfig = {
  apiKey: 'AIzaSyDc_dOjbidHuxYj_rsGt_acHPLlDQWfTjA',
  authDomain: 'channing-birthday-invite-2022.firebaseapp.com',
  projectId: 'channing-birthday-invite-2022',
  storageBucket: 'channing-birthday-invite-2022.appspot.com',
  messagingSenderId: '16665373884',
  appId: '1:16665373884:web:0eff3b9328bc03fb2474b9',
  measurementId: 'G-4W1SR61T92',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const emitter = new EventEmitter();

export type Invitee = {
  id: string;
  name: string;
  canAttend?: boolean;
  willBring?: string;
  lastSave?: Timestamp;
};

const createInviteeFromURI = (): Invitee => {
  const query = parse(window.location.search);
  if (typeof query.init === 'string') {
    try {
      const data = JSON.parse(atob(query.init));
      if (typeof data.id === 'string' && typeof data.name === 'string') {
        return {
          id: data.id,
          name: data.name,
        };
      }
    } catch {
      // NOOP
    }
  }
  return {
    id: uuid.v4(),
    name: '',
  };
};

const invitee = createInviteeFromURI();

export const fetchInvitee = async () => {
  const inviteeSnap = await getDoc(doc(db, 'invitees', invitee.id));
  if (!inviteeSnap.exists()) {
    return;
  }

  updateInvitee(inviteeSnap.data());
};

export const getInvitee = (): Invitee => invitee;

export type UpdateInvitee = (updates: Partial<Omit<Invitee, 'id'>>) => void;

export const updateInvitee: UpdateInvitee = (updates) => {
  Object.assign(invitee, updates);
  emitter.emit('change', invitee);
  debouncedSave();
};

export const saveInvitee = async (): Promise<void> => {
  const prevLastSave = invitee.lastSave;
  invitee.lastSave = Timestamp.fromDate(new Date());
  try {
    await setDoc(doc(db, 'invitees', invitee.id), invitee);
    emitter.emit('change', invitee);
  } catch (err) {
    invitee.lastSave = prevLastSave;
    emitter.emit(
      'error',
      'Failed to save your RSVP. Please contact Nick at 858-342-4071',
    );
  }
};

const debouncedSave = debounce(() => {
  saveInvitee().catch((err) => {
    console.log('Error saving: ', err);
  });
}, 500);

type Subscription = {
  release: () => void;
};

export const onChange = (fn: (invitee: Invitee) => void): Subscription => {
  const handler = (invitee: Invitee) => {
    fn(invitee);
  };
  emitter.on('change', handler);
  const release = () => {
    emitter.removeListener('change', handler);
  };

  return {
    release,
  };
};

export const onError = (fn: (message: string) => void): Subscription => {
  const handler = (message: string) => {
    fn(message);
  };

  emitter.on('error', handler);

  const release = () => {
    emitter.removeListener('error', handler);
  };

  return {
    release,
  };
};

export type Side = {
  id: string;
  name: string;
  side: string;
};

export const useSideList = (): Side[] => {
  const [sides, setSides] = React.useState<Side[]>([]);

  React.useEffect(() => {
    const q = query(collection(db, 'invitees'), where('canAttend', '==', true));
    const unsubscribe = onSnapshot(q, (snap) => {
      snap.forEach((doc) => {
        const data = doc.data() as Invitee;
        if (data.willBring != null && data.willBring.trim() !== '') {
          setSides((curr) => {
            return [
              {id: data.id, name: data.name, side: data.willBring},
              ...curr.filter((side) => side.id !== data.id),
            ];
          });
        }
      });
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return sides;
};
