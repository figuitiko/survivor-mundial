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
  isLocked?: boolean;
  selectedTeam?: string | null;
};

export type StatChallenge = {
  id: string;
  title: string;
  description: string;
  reward: string;
  difficulty: "Low" | "Medium" | "High";
  deadline: string;
  joined: boolean;
  state: "OPEN" | "LOCKED" | "SETTLED";
  answerLabel?: string | null;
  options: ChallengeOptionView[];
};

export type LeaderboardEntry = {
  rank: number;
  player: string;
  nation: string;
  streak: number;
  points: number;
  challengeBonusPoints?: number;
  status: "ALIVE" | "ELIMINATED";
  isCurrentUser?: boolean;
};

export type UserProfile = {
  name: string;
  username: string;
  favoriteNation: string;
  bio: string;
  streakGoal: number;
};

export type ChallengeOptionView = {
  id: string;
  label: string;
  value: string;
};

export type UsedTeam = {
  id: string;
  team: string;
  matchday: string;
  outcome: "PENDING" | "WON" | "LOST" | "MISSED";
};

export type PickHistoryEntry = {
  id: string;
  matchday: string;
  selectedTeam: string;
  opponent: string;
  kickoff: string;
  outcome: "PENDING" | "WON" | "LOST" | "MISSED";
  pointsAwarded: number;
};

export type ChallengeHistoryEntry = {
  id: string;
  title: string;
  answer: string;
  state: "OPEN" | "LOCKED" | "SETTLED";
  bonusPointsAwarded: number;
  isCorrect: boolean | null;
};
