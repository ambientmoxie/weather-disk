// Generates a random number between two values
function randomInRange(minValue, maxValue) {
  return Math.random() * (maxValue - minValue) + minValue;
}

// Equivalent of Processing's remap function
function remap(value, oldMin, oldMax, newMin, newMax) {
  return ((value - oldMin) / (oldMax - oldMin)) * (newMax - newMin) + newMin;
}

// Generates a random but consistent number between two values using a seed
function hashToRange(seed, minRange, maxRange) {
  // Security checks before manipulations
  if (typeof seed !== "number") {
    throw new Error("Seed must be a number");
  }
  if (typeof minRange !== "number" || typeof maxRange !== "number") {
    throw new Error("minRange and maxRange must be numbers");
  }
  if (minRange >= maxRange) {
    throw new Error("minRange must be less than maxRange");
  }

  // Bitwise operations and mathematical transformations
  let hash = seed;
  hash = (hash << 5) - hash + (hash >>> 3);
  hash = hash * 2654435761;
  hash = (hash ^ (hash >>> 16)) & 0xffffffff;

  const range = maxRange - minRange; // Calculate the range
  const hashedValue = Math.abs(hash % range); // Use modulo to bring the number within the range 0 to (range - 1)
  const finalValue = minRange + hashedValue; // Offset the value by minRange to bring it within the desired range

  return finalValue;
}

export { randomInRange, remap, hashToRange };
