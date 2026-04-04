import { PickOutcome, SurvivorStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { SURVIVOR_MATCHDAY_POINTS } from "@/lib/survivor";

export async function settleMatchday(matchdayId: string) {
  return prisma.$transaction(async (tx) => {
    const matchday = await tx.matchday.findUnique({
      where: { id: matchdayId },
      include: {
        matches: true,
        picks: {
          include: {
            match: true,
            user: true
          }
        }
      }
    });

    if (!matchday) {
      throw new Error("Matchday not found.");
    }

    if (matchday.settledAt) {
      throw new Error(`${matchday.title} is already settled.`);
    }

    if (matchday.matches.length === 0) {
      throw new Error("Cannot settle a matchday with no matches.");
    }

    const unresolvedMatch = matchday.matches.find(
      (match) => match.status !== "FINAL" || !match.winner
    );

    if (unresolvedMatch) {
      throw new Error("All matches must be final with a winner before settlement.");
    }

    const aliveUsers = await tx.user.findMany({
      where: { survivorStatus: SurvivorStatus.ALIVE }
    });

    const picksByUser = new Map(matchday.picks.map((pick) => [pick.userId, pick]));
    const settledAt = new Date();
    let advanced = 0;
    let eliminated = 0;

    for (const user of aliveUsers) {
      const pick = picksByUser.get(user.id);

      if (!pick) {
        await tx.user.update({
          where: { id: user.id },
          data: {
            survivorStatus: SurvivorStatus.ELIMINATED,
            eliminatedAt: settledAt,
            currentStreak: 0
          }
        });
        eliminated += 1;
        continue;
      }

      const won = pick.selectedTeam === pick.match.winner;

      await tx.pick.update({
        where: { id: pick.id },
        data: {
          outcome: won ? PickOutcome.WON : PickOutcome.LOST,
          pointsAwarded: won ? SURVIVOR_MATCHDAY_POINTS : 0,
          settledAt
        }
      });

      if (won) {
        const nextStreak = user.currentStreak + 1;
        await tx.user.update({
          where: { id: user.id },
          data: {
            currentStreak: nextStreak,
            longestStreak: Math.max(user.longestStreak, nextStreak),
            survivorPoints: user.survivorPoints + SURVIVOR_MATCHDAY_POINTS
          }
        });
        advanced += 1;
      } else {
        await tx.user.update({
          where: { id: user.id },
          data: {
            survivorStatus: SurvivorStatus.ELIMINATED,
            eliminatedAt: settledAt,
            currentStreak: 0
          }
        });
        eliminated += 1;
      }
    }

    await tx.matchday.update({
      where: { id: matchday.id },
      data: { settledAt }
    });

    return {
      matchdayId: matchday.id,
      title: matchday.title,
      advanced,
      eliminated,
      settledAt
    };
  });
}
