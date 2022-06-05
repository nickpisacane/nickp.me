import {initializeApp} from 'firebase/app';
import {
  getFirestore,
  Timestamp,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  onSnapshot,
  collection,
} from 'firebase/firestore';
import {getAnalytics, logEvent as logEventImpl} from 'firebase/analytics';
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

const isDev = () =>
  window.location.hostname === 'localhost' ||
  window.location.hostname.startsWith('192.');

const getInviteeCollectionName = () => {
  return isDev() ? 'invitees_dev' : 'invitees';
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);
const emitter = new EventEmitter();

export const logEvent = (
  event: string,
  eventData: Record<string, string> = {},
) => {
  const inviteeEventData: Record<string, string> = {};
  try {
    const current = getInvitee();
    Object.assign(inviteeEventData, {
      __invitee_id: current.id,
      __invitee_name: current.name,
      __invitee_can_attend: current.canAttend ?? 'NULL',
      __invitee_will_bring: current.willBring ?? 'NULL',
    });
  } catch {
    // NOOP
  }
  const actualEventData = {...eventData, ...inviteeEventData};
  if (isDev()) {
    console.info('[LOG EVENT]:', event, actualEventData);
    return;
  }

  logEventImpl(analytics, event, actualEventData);
};

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
        logEvent('firebase:createInviteeFromURI:parse_success');
        return {
          id: data.id,
          name: data.name,
        };
      }
    } catch (err) {
      logEvent('firebase:createInviteeFromURI:parse_failed', {
        errorMessage: err.message,
        errorStack: err.stack,
      });
    }
  }
  if (isDev()) {
    return {
      id: 'test',
      name: 'Dev User',
    };
  }
  logEvent('firebase:createInviteeFromURI:create_empty_invitee');
  return {
    id: uuid.v4(),
    name: '',
  };
};

const invitee = createInviteeFromURI();

export const fetchInvitee = async () => {
  const inviteeSnap = await getDoc(
    doc(db, getInviteeCollectionName(), invitee.id),
  );
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
    await setDoc(doc(db, getInviteeCollectionName(), invitee.id), invitee);
    emitter.emit('change', invitee);

    emitter.emit('message', {
      type: 'info',
      message: 'Your changes have been saved',
    } as Message);
  } catch (err) {
    invitee.lastSave = prevLastSave;
    logEvent('firebase:saveInvitee:save_failed', {
      errorMessage: err.message,
      errorStack: err.stack,
    });
    emitter.emit('message', {
      type: 'error',
      message: 'Failed to save your RSVP. Please contact Nick at 858-342-4071',
    } as Message);
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

export type Message = {
  type: 'info' | 'error';
  message: string;
};

export const useMessage = (): [Message | null, () => void] => {
  const [message, setMessage] = React.useState<Message | null>(null);

  const clear = () => {
    setMessage(null);
  };

  React.useEffect(() => {
    const handler = (message: Message) => {
      setMessage(message);
    };

    emitter.on('message', handler);

    return () => {
      emitter.removeListener('message', handler);
    };
  }, []);

  return [message, clear];
};

export type Side = {
  id: string;
  name: string;
  side: string;
};

export const useSideList = (): Side[] => {
  const [sides, setSides] = React.useState<Side[]>([]);

  React.useEffect(() => {
    const q = query(
      collection(db, getInviteeCollectionName()),
      where('canAttend', '==', true),
    );
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
