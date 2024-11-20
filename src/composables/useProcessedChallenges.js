import { computed } from "vue";

export function useProcessedChallenges(todayChallenges, challenges) {
  const processedChallenges = computed(() => {
    return todayChallenges.value
      .filter((todayChallenge) => {
        return challenges.value.some(
          (challenge) => challenge.id === todayChallenge.challengeId
        );
      })
      .map((todayChallenge) => {
        const matchedChallenge = challenges.value.find(
          (challenge) => challenge.id === todayChallenge.challengeId
        );
        return {
          ...todayChallenge,
          title: matchedChallenge ? matchedChallenge.title : "Unknown",
        };
      });
  });

  return {
    processedChallenges,
  };
}
