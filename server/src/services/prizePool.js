// Plan prices in INR
const PLAN_PRICES = {
  monthly: 499,
  yearly:  3999 / 12  // monthly equivalent
};

// Prize pool distribution as per PRD
const POOL_SHARE = {
  '5-match': 0.40,
  '4-match': 0.35,
  '3-match': 0.25
};

// Calculate total prize pool from active subscribers
export const calculatePrizePool = (subscribers) => {
  let total = 0;

  subscribers.forEach(sub => {
    const monthlyAmount = PLAN_PRICES[sub.plan] || PLAN_PRICES.monthly;
    // 10% of each subscription goes to prize pool
    total += monthlyAmount * 0.10;
  });

  return total;
};

// Split pool into tiers
export const splitPool = (totalPool, jackpotRollover = 0) => {
  const jackpot = (totalPool * POOL_SHARE['5-match']) + jackpotRollover;

  return {
    '5-match': jackpot,
    '4-match': totalPool * POOL_SHARE['4-match'],
    '3-match': totalPool * POOL_SHARE['3-match']
  };
};

// Calculate prize per winner in each tier
export const calculatePrizePerWinner = (pool, winners) => {
  if (!winners || winners.length === 0) return 0;
  return pool / winners.length;
};