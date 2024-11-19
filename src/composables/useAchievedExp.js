import { computed } from "vue";

export function useAchievedExp(games, expByDifficulty, todayChallenges) {

    const totalAchievedExp = computed(() => {
        if (Array.isArray(games.value)) {
        return games.value
            .filter((game) => game.achieved)
            .reduce((total, game) => {
            const exp = expByDifficulty[game.difficultyLevel] || 0;
            return total + exp;
            }, 0);
        }
    return 0;
  });

  const achievedChallengeCount = computed(() => {
    if (Array.isArray(todayChallenges.value)) {
        return todayChallenges.value.filter(challenge => challenge.achieved).length;
    }
    return 0;
    });
    
    return {
        totalAchievedExp, achievedChallengeCount
    };
}