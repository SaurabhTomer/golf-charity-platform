// Generate 5 random numbers between 1 and 45
export const generateRandomNumbers = () => {
  const numbers = [];

  while (numbers.length < 5) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(num)) {
      numbers.push(num);
    }
  }

  return numbers.sort((a, b) => a - b);
};

// Generate 5 numbers based on most frequent user scores
export const generateAlgorithmicNumbers = (allScores) => {
  // Count frequency of each score
  const frequency = {};

  allScores.forEach(({ score }) => {
    frequency[score] = (frequency[score] || 0) + 1;
  });

  // Sort by frequency descending
  const sorted = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .map(([score]) => Number(score));

  // Take top 5, if less than 5 fill with random
  const result = sorted.slice(0, 5);

  while (result.length < 5) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!result.includes(num)) result.push(num);
  }

  return result.sort((a, b) => a - b);
};


// Check how many numbers a user matched
export const checkMatch = (userScores, drawNumbers) => {
  const userNums = userScores.map(s => s.score);
  console.log('User scores:', userNums);
  console.log('Draw numbers:', drawNumbers);
  const matched = userNums.filter(n => drawNumbers.includes(n));
  console.log('Matched:', matched);
  return matched.length;
};

// Get match type based on count
export const getMatchType = (matchCount) => {
  if (matchCount >= 5) return '5-match';
  if (matchCount >= 4) return '4-match';
  if (matchCount >= 3) return '3-match';
  return null;
};