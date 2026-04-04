import type {
  DashboardMetric,
  LeaderboardEntry,
  MatchCard,
  NavigationItem,
  StatChallenge,
  UserProfile
} from "@/lib/types";

export const navigationItems: NavigationItem[] = [
  { href: "/dashboard", label: "Dashboard", shortLabel: "Dash" },
  { href: "/picks", label: "Matchday Picks", shortLabel: "Picks" },
  { href: "/challenges", label: "Challenges", shortLabel: "Stats" },
  { href: "/leaderboard", label: "Leaderboard", shortLabel: "Board" },
  { href: "/profile", label: "Profile", shortLabel: "You" }
];

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: "Current Streak",
    value: "06",
    detail: "Alive after Matchday 4, above 68% of the field."
  },
  {
    label: "Challenge Wins",
    value: "14",
    detail: "Top percentile on shots, corners, and clean-sheet props."
  },
  {
    label: "Survivor Pool",
    value: "412",
    detail: "Entrants remaining from the original 1,280 bracket."
  }
];

export const matchdayMatches: MatchCard[] = [
  {
    id: "md5-arg-uru",
    homeTeam: "Argentina",
    awayTeam: "Uruguay",
    kickoff: "Sat 19:00",
    venue: "Monterrey",
    group: "Quarterfinal",
    confidence: 0.78,
    trend: "up"
  },
  {
    id: "md5-bra-col",
    homeTeam: "Brazil",
    awayTeam: "Colombia",
    kickoff: "Sat 22:00",
    venue: "Guadalajara",
    group: "Quarterfinal",
    confidence: 0.64,
    trend: "steady"
  },
  {
    id: "md5-fra-por",
    homeTeam: "France",
    awayTeam: "Portugal",
    kickoff: "Sun 18:30",
    venue: "CDMX",
    group: "Quarterfinal",
    confidence: 0.59,
    trend: "down"
  }
];

export const statChallenges: StatChallenge[] = [
  {
    id: "corners-chaos",
    title: "Corners Chaos",
    description: "Pick the quarterfinal with the highest corner count.",
    reward: "+120 challenge points",
    difficulty: "Medium",
    deadline: "Closes in 9h",
    joined: true
  },
  {
    id: "captain-clutch",
    title: "Captain Clutch",
    description: "Call the player with the first match-winning contribution.",
    reward: "+180 challenge points",
    difficulty: "High",
    deadline: "Closes in 12h",
    joined: false
  },
  {
    id: "clean-sheet-grid",
    title: "Clean Sheet Grid",
    description: "Lock two keepers to finish with a combined clean sheet.",
    reward: "+90 challenge points",
    difficulty: "Low",
    deadline: "Closes in 1d",
    joined: false
  }
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, player: "Camila R.", nation: "MEX", streak: 9, points: 1840, delta: "+2" },
  { rank: 2, player: "Iker T.", nation: "ESP", streak: 8, points: 1790, delta: "+1" },
  { rank: 3, player: "Mara V.", nation: "ARG", streak: 8, points: 1768, delta: "-1" },
  { rank: 4, player: "You", nation: "USA", streak: 6, points: 1686, delta: "+5" },
  { rank: 5, player: "Leo S.", nation: "BRA", streak: 6, points: 1654, delta: "+3" }
];

export const profile: UserProfile = {
  name: "Frank Ortega",
  username: "frankplayssurvivor",
  favoriteNation: "Mexico",
  bio: "Tracking survivor edges through venue splits, tempo, and squad rotation.",
  streakGoal: 10
};

export const appHighlights = [
  "Protected survivor pool workspace ready for real auth wiring.",
  "Matchday pick forms validated with Zod and server action stubs.",
  "Stat challenge flow designed for future live odds and syncing."
];
