export type NavigationItem = {
  href: string;
  label: string;
  shortLabel: string;
};

export type DashboardMetric = {
  label: string;
  value: string;
  detail: string;
};

export type MatchCard = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  kickoff: string;
  venue: string;
  group: string;
  confidence: number;
  trend: "up" | "steady" | "down";
};

export type StatChallenge = {
  id: string;
  title: string;
  description: string;
  reward: string;
  difficulty: "Low" | "Medium" | "High";
  deadline: string;
  joined: boolean;
};

export type LeaderboardEntry = {
  rank: number;
  player: string;
  nation: string;
  streak: number;
  points: number;
  delta: string;
};

export type UserProfile = {
  name: string;
  username: string;
  favoriteNation: string;
  bio: string;
  streakGoal: number;
};
