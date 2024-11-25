import { computed } from "vue";

export function useAchievedExp(games, expByDifficulty, todayChallenges) {
    const exercises = ["SQUAT", "PUSHUP"];
    const difficultyLevels = ["EASY", "MEDIUM", "HARD"];
    
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

    const groupedByExercise = computed(() => {
        const grouped = {};
      
        exercises.forEach((exercise) => {
          grouped[exercise] = {};
          difficultyLevels.forEach((difficulty) => {
            grouped[exercise][difficulty] = "pending";
          });
        });
      
        games.value.forEach((game) => {
          if (game.achieved) {
            grouped[game.type][game.difficultyLevel] = "completed"; 
          }
        });
      
        return grouped;
      });
    
    return {
        exercises, totalAchievedExp, achievedChallengeCount, groupedByExercise
    };
}