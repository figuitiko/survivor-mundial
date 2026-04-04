import { SurvivorStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { formatKickoff } from "@/lib/survivor";
import { getRequiredSession } from "@/lib/auth";

export async function getCurrentUserOrThrow() {
  const session = await getRequiredSession();
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) {
    throw new Error(`User record missing for ${session.user.email}.`);
  }

  return user;
}

export async function getCurrentMatchday() {
  return prisma.matchday.findFirst({
    where: { settledAt: null },
    orderBy: { order: "asc" },
    include: {
      matches: {
        orderBy: { kickoffAt: "asc" }
      }
    }
  });
}

export async function getPicksPageData() {
  const user = await getCurrentUserOrThrow();
  const currentMatchday = await getCurrentMatchday();

  const [usedTeams, pickHistory, currentPick] = await Promise.all([
    prisma.pick.findMany({
      where: { userId: user.id },
      orderBy: [{ matchday: { order: "asc" } }],
      select: {
        id: true,
        selectedTeam: true,
        outcome: true,
        matchday: { select: { title: true, order: true } }
      }
    }),
    prisma.pick.findMany({
      where: { userId: user.id },
      orderBy: [{ matchday: { order: "desc" } }],
      include: {
        match: true,
        matchday: true
      }
    }),
    currentMatchday
      ? prisma.pick.findUnique({
          where: {
            userId_matchdayId: {
              userId: user.id,
              matchdayId: currentMatchday.id
            }
          }
        })
      : null
  ]);

  return {
    user,
    currentMatchday,
    currentPick,
    usedTeams: usedTeams.map((pick) => ({
      id: pick.id,
      team: pick.selectedTeam,
      matchday: `MD${pick.matchday.order}`,
      outcome: pick.outcome
    })),
    pickHistory: pickHistory.map((pick) => ({
      id: pick.id,
      matchday: pick.matchday.title,
      selectedTeam: pick.selectedTeam,
      opponent:
        pick.selectedTeam === pick.match.homeTeam ? pick.match.awayTeam : pick.match.homeTeam,
      kickoff: formatKickoff(pick.match.kickoffAt),
      outcome: pick.outcome,
      pointsAwarded: pick.pointsAwarded
    }))
  };
}

export async function getDashboardData() {
  const user = await getCurrentUserOrThrow();
  const currentMatchday = await getCurrentMatchday();

  const [aliveCount, leaderboardRows, recentPicks] = await Promise.all([
    prisma.user.count({ where: { survivorStatus: SurvivorStatus.ALIVE } }),
    prisma.user.findMany({
      orderBy: [
        { survivorStatus: "asc" },
        { currentStreak: "desc" },
        { survivorPoints: "desc" },
        { longestStreak: "desc" },
        { name: "asc" }
      ],
      take: 5
    }),
    prisma.pick.findMany({
      where: { userId: user.id },
      orderBy: [{ matchday: { order: "desc" } }],
      take: 4,
      include: {
        match: true,
        matchday: true
      }
    })
  ]);

  return {
    user,
    currentMatchday,
    aliveCount,
    leaderboardRows,
    recentPicks: recentPicks.map((pick) => ({
      id: pick.id,
      matchday: pick.matchday.title,
      selectedTeam: pick.selectedTeam,
      opponent:
        pick.selectedTeam === pick.match.homeTeam ? pick.match.awayTeam : pick.match.homeTeam,
      kickoff: formatKickoff(pick.match.kickoffAt),
      outcome: pick.outcome,
      pointsAwarded: pick.pointsAwarded
    }))
  };
}

export async function getLeaderboardData() {
  const [user, rows] = await Promise.all([
    getCurrentUserOrThrow(),
    prisma.user.findMany({
      orderBy: [
        { survivorStatus: "asc" },
        { currentStreak: "desc" },
        { survivorPoints: "desc" },
        { longestStreak: "desc" },
        { name: "asc" }
      ]
    })
  ]);

  return rows.map((row, index) => ({
    rank: index + 1,
    player: row.name,
    nation: row.favoriteNation ?? "N/A",
    streak: row.currentStreak,
    points: row.survivorPoints,
    status: row.survivorStatus,
    isCurrentUser: row.id === user.id
  }));
}

export async function getSurvivorStandingsSnapshot() {
  const users = await prisma.user.findMany({
    orderBy: [
      { survivorStatus: "asc" },
      { currentStreak: "desc" },
      { survivorPoints: "desc" },
      { longestStreak: "desc" },
      { name: "asc" }
    ]
  });

  return {
    totalPlayers: users.length,
    alivePlayers: users.filter((user) => user.survivorStatus === SurvivorStatus.ALIVE).length,
    users
  };
}

export { SurvivorStatus };
