export const SUPPORTED_SPORTS = [
  { name: "Cricket", type: "outdoor", icon: "🏏", minPlayers: 11, maxPlayers: 15 },
  { name: "Football", type: "outdoor", icon: "⚽", minPlayers: 11, maxPlayers: 18 },
  { name: "Basketball", type: "outdoor", icon: "🏀", minPlayers: 5, maxPlayers: 12 },
  { name: "Volleyball", type: "outdoor", icon: "🏐", minPlayers: 6, maxPlayers: 12 },
  { name: "Badminton", type: "indoor", icon: "🏸", minPlayers: 1, maxPlayers: 2 },
  { name: "Table Tennis", type: "indoor", icon: "🏓", minPlayers: 1, maxPlayers: 2 },
  { name: "Chess", type: "indoor", icon: "♟️", minPlayers: 1, maxPlayers: 1 },
  { name: "Kho-Kho", type: "outdoor", icon: "🏃", minPlayers: 9, maxPlayers: 12 },
  { name: "Kabaddi", type: "outdoor", icon: "🤼", minPlayers: 7, maxPlayers: 12 },
  { name: "Athletics", type: "outdoor", icon: "🏃‍♂️", minPlayers: 1, maxPlayers: 1 },
] as const;

export const DEPARTMENTS = [
  "Computer Engineering",
  "Information Technology",
  "Artificial Intelligence & Data Science",
  "Electronics & Telecommunication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Chemical Engineering",
] as const;

export const ACADEMIC_YEARS = ["FE", "SE", "TE", "BE"] as const;

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
