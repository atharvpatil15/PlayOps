export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  TOURNAMENTS: "/tournaments",
  LIVE: "/live",
  RESULTS: "/results",
  POINTS_TABLE: "/points-table",
  VERIFY_CERTIFICATE: (code: string) => `/verify/${code}`,

  // Player Dashboard Routes
  PLAYER_DASHBOARD: "/player/dashboard",
  PLAYER_PROFILE: "/player/profile",
  PLAYER_TEAM: "/player/team",
  PLAYER_MATCHES: "/player/matches",
  PLAYER_PERFORMANCE: "/player/performance",
  PLAYER_NOTIFICATIONS: "/player/notifications",
  PLAYER_CERTIFICATES: "/player/certificates",

  // Admin Dashboard Routes
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_TOURNAMENTS: "/admin/tournaments",
  ADMIN_PLAYERS: "/admin/players",
  ADMIN_TEAMS: "/admin/teams",
  ADMIN_SPORTS: "/admin/sports",
  ADMIN_MATCHES: "/admin/matches",
  ADMIN_VENUES: "/admin/venues",
  ADMIN_NOTIFICATIONS: "/admin/notifications",
  ADMIN_CERTIFICATES: "/admin/certificates",
  ADMIN_REPORTS: "/admin/reports",
  ADMIN_SETTINGS: "/admin/settings",
} as const;
