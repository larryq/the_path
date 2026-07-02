// Simple seeded pseudo-random number generator
// Same seed always produces the same sequence — deterministic across sessions
// Usage:
//   const rand = seededRandom(42)
//   const value = rand()  // 0.0 to 1.0

export function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
