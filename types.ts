
export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  familyId: string; // Used to link partners
}

export interface Child {
  id: string;
  name: string;
  familyId: string;
}

export interface PottyEvent {
  id: string;
  childId: string;
  timestamp: number; // ms since epoch
}

export interface ChartDataPoint {
  date: string; // Display string for X-axis
  timestamp: number; // Numerical value for X-axis positioning
  timeOfDay: number; // Minutes from 0 to 1439 (00:00 to 23:59) for Y-axis
  fullDate: number;
}

export interface BestFitPoint {
  x: number;
  y: number;
}

export interface AIAdvice {
  summary: string;
  recommendations: string[];
  bestWindow: string;
}

export interface InviteToken {
  token: string;
  familyId: string;
  inviteeEmail: string;
}
