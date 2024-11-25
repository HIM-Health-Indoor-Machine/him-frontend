import { ref, watch } from "vue";

export function useProcessedChallenges(todayChallenges, challenges) {
  const processedChallenges = ref([]);

  const updateProcessedChallenges = () => {
    processedChallenges.value = todayChallenges.value
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
  };

  watch([todayChallenges, challenges], updateProcessedChallenges, {
    deep: true,
  });

  updateProcessedChallenges();
  return {
    processedChallenges,
  };
}
