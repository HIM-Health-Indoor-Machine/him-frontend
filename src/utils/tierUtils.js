import { tierImages } from '@/assets/imageAssets';
import { tierData } from '@/utils/tierData';

export const getTierIcon = (tier) => {
    return tierImages[tier] || tierImages['IRON']; 
};

export const getNextTierIcon = (tier) => {
    const nextTier = {
        BRONZE: 'SILVER',
        SILVER: 'GOLD',
        GOLD: 'PLATINUM',
        PLATINUM: 'EMERALD',
        EMERALD: 'DIAMOND',
        DIAMOND: 'MASTER',
        MASTER: 'LEGEND',
        LEGEND: 'GOAT',
        GOAT: null, 
    }[tier];
    return nextTier ? tierImages[nextTier] : tierImages['BRONZE']; 
};

export const getNextExp = (tier) => {
    const tierInfo = tierData[tier];
    if (!tierInfo) {
        throw new Error(`Invalid tier: ${tier}`);
    }
    return tierInfo.nextExp;
};
