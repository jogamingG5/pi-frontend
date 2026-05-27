export const API_BASE_URL = 'http://localhost:8081/streetleague/api';

export const ENDPOINTS = {
  MATCHES: '/matchs',
  EVENTS: '/events'
} as const;

export const STATUS_COLORS: Record<string, string> = {
  SCHEDULED: 'bg-blue-500',
  ONGOING: 'bg-green-500',
  COMPLETED: 'bg-gray-500',
  CANCELLED: 'bg-red-500'
};

export const TYPE_COLORS: Record<string, string> = {
  LEAGUE: 'bg-purple-500',
  FRIENDLY: 'bg-amber-500'
};
