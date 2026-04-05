import type {
  DashboardMetric,
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
    joined: true,
    state: "OPEN",
    answerLabel: "Argentina vs Uruguay",
    options: [
      { id: "1", label: "Argentina vs Uruguay", value: "arg-uru" },
      { id: "2", label: "France vs Portugal", value: "fra-por" }
    ]
  },
  {
    id: "captain-clutch",
    title: "Captain Clutch",
    description: "Call the player with the first match-winning contribution.",
    reward: "+180 challenge points",
    difficulty: "High",
    deadline: "Closes in 12h",
    joined: false,
    state: "OPEN",
    answerLabel: null,
    options: [
      { id: "3", label: "Yes", value: "yes" },
      { id: "4", label: "No", value: "no" }
    ]
  },
  {
    id: "clean-sheet-grid",
    title: "Clean Sheet Grid",
    description: "Lock two keepers to finish with a combined clean sheet.",
    reward: "+90 challenge points",
    difficulty: "Low",
    deadline: "Closes in 1d",
    joined: false,
    state: "LOCKED",
    answerLabel: null,
    options: [
      { id: "5", label: "Yes", value: "yes" },
      { id: "6", label: "No", value: "no" }
    ]
  }
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
  "Survivor picks now enforce one entry per matchday and no reused nations.",
  "Settlement logic updates alive status and leaderboard state from Prisma."
];
