
import { User, Child, PottyEvent } from '../types';

const KEYS = {
  SESSION: 'potty_tracker_session', // Current logged in user
  ACCOUNTS: 'potty_tracker_accounts', // All registered users on this device
  CHILDREN: 'potty_tracker_children',
  EVENTS: 'potty_tracker_events',
  INVITES: 'potty_tracker_invites'
};

const getJSON = <T>(key: string, defaultValue: T): T => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const setJSON = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const db = {
  // Account Management
  async signup(data: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    partnerToken?: string;
  }): Promise<User> {
    const accounts = getJSON<User[]>(KEYS.ACCOUNTS, []);
    const cleanEmail = data.email.trim().toLowerCase();
    
    // Check if email already exists
    const existing = accounts.find(a => a.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error("An account with this email already exists.");
    }

    // Handle family linking if token is provided
    let familyId = `family-${Math.random().toString(36).substr(2, 5)}`;
    if (data.partnerToken) {
      // In a real app we'd validate the token against a server. 
      // For this demo, we'll simulate finding a familyId if they typed something.
      familyId = 'shared-family-' + data.partnerToken.toLowerCase();
    }

    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: cleanEmail,
      name: `${data.firstName} ${data.lastName}`,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password, // Plain text for local demo
      familyId: familyId
    };

    setJSON(KEYS.ACCOUNTS, [...accounts, newUser]);
    setJSON(KEYS.SESSION, newUser);
    return newUser;
  },

  async login(email: string, password: string): Promise<User> {
    const accounts = getJSON<User[]>(KEYS.ACCOUNTS, []);
    const cleanEmail = email.trim().toLowerCase();
    const user = accounts.find(a => a.email.toLowerCase() === cleanEmail);
    
    if (!user) {
      throw new Error("No account found with this email.");
    }
    
    if (user.password !== password) {
      throw new Error("Incorrect password.");
    }

    setJSON(KEYS.SESSION, user);
    return user;
  },

  async findUserByEmail(email: string): Promise<User | null> {
    const accounts = getJSON<User[]>(KEYS.ACCOUNTS, []);
    const cleanEmail = email.trim().toLowerCase();
    return accounts.find(a => a.email.toLowerCase() === cleanEmail) || null;
  },

  async getAllAccounts(): Promise<User[]> {
    return getJSON<User[]>(KEYS.ACCOUNTS, []);
  },

  // Session & Auth
  async setSession(user: User) {
    setJSON(KEYS.SESSION, user);
  },

  async getCurrentUser(): Promise<User | null> {
    return getJSON<User | null>(KEYS.SESSION, null);
  },

  async clearSession() {
    localStorage.removeItem(KEYS.SESSION);
  },

  // Invitation Tokens (Mocked for local)
  async createToken(inviteeEmail: string, familyId: string): Promise<string> {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  },

  async validateToken(token: string): Promise<string | null> {
    return 'local-family';
  },

  // Children
  async getChildren(familyId: string): Promise<Child[]> {
    const all = getJSON<Child[]>(KEYS.CHILDREN, []);
    return all.filter(c => c.familyId === familyId);
  },

  async addChild(familyId: string, name: string): Promise<Child> {
    const children = getJSON<Child[]>(KEYS.CHILDREN, []);
    const newChild: Child = {
      id: Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      familyId
    };
    setJSON(KEYS.CHILDREN, [...children, newChild]);
    return newChild;
  },

  // Events
  async getEvents(childId: string): Promise<PottyEvent[]> {
    const all = getJSON<PottyEvent[]>(KEYS.EVENTS, []);
    return all.filter(e => e.childId === childId);
  },

  async saveEvent(event: Omit<PottyEvent, 'id'>): Promise<string> {
    const events = getJSON<PottyEvent[]>(KEYS.EVENTS, []);
    const id = Math.random().toString(36).substr(2, 9);
    const newEvent = { ...event, id };
    setJSON(KEYS.EVENTS, [...events, newEvent]);
    return id;
  },

  async deleteEvent(eventId: string) {
    const events = getJSON<PottyEvent[]>(KEYS.EVENTS, []);
    setJSON(KEYS.EVENTS, events.filter(e => e.id !== eventId));
  },

  async updateEvent(eventId: string, timestamp: number) {
    const events = getJSON<PottyEvent[]>(KEYS.EVENTS, []);
    setJSON(KEYS.EVENTS, events.map(e => e.id === eventId ? { ...e, timestamp } : e));
  }
};
