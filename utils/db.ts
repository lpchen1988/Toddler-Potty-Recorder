
import { User, Child, PottyEvent, InviteToken } from '../types';

const USERS_KEY = 'potty_users_v2';
const CHILDREN_KEY = 'potty_children_v2';
const EVENTS_KEY = 'potty_events_v2';
const SESSION_KEY = 'potty_session_v2';
const TOKENS_KEY = 'potty_invite_tokens';

export const db = {
  // Auth
  getUsers: (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),
  saveUser: (user: User) => {
    const users = db.getUsers();
    localStorage.setItem(USERS_KEY, JSON.stringify([...users, user]));
  },
  
  setSession: (user: User | null) => {
    if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    else localStorage.removeItem(SESSION_KEY);
  },
  getSession: (): User | null => {
    const s = localStorage.getItem(SESSION_KEY);
    return s ? JSON.parse(s) : null;
  },

  // Invitation Tokens
  getTokens: (): InviteToken[] => JSON.parse(localStorage.getItem(TOKENS_KEY) || '[]'),
  createToken: (inviteeEmail: string, familyId: string): string => {
    const token = Math.random().toString(36).substring(2, 8).toUpperCase();
    const tokens = db.getTokens();
    tokens.push({ token, familyId, inviteeEmail });
    localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
    return token;
  },
  validateToken: (token: string): string | null => {
    const tokens = db.getTokens();
    const found = tokens.find(t => t.token === token);
    return found ? found.familyId : null;
  },

  // Children
  getChildren: (familyId: string): Child[] => {
    const all = JSON.parse(localStorage.getItem(CHILDREN_KEY) || '{}');
    return all[familyId] || [];
  },
  addChild: (familyId: string, child: Child) => {
    const all = JSON.parse(localStorage.getItem(CHILDREN_KEY) || '{}');
    if (!all[familyId]) all[familyId] = [];
    all[familyId].push(child);
    localStorage.setItem(CHILDREN_KEY, JSON.stringify(all));
  },

  // Events
  getEvents: (childId: string): PottyEvent[] => {
    const all = JSON.parse(localStorage.getItem(EVENTS_KEY) || '{}');
    return all[childId] || [];
  },
  saveEvents: (childId: string, events: PottyEvent[]) => {
    const all = JSON.parse(localStorage.getItem(EVENTS_KEY) || '{}');
    all[childId] = events;
    localStorage.setItem(EVENTS_KEY, JSON.stringify(all));
  }
};
