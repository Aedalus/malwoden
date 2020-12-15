/**
 * An interface for random number generators.
 * Any random number generator from this library will implement the following,
 * and this library can use any custom generator that implements the following.
 */
export interface IRNG {
  next(min?: number, max?: number): number;
  nextInt(min?: number, max?: number): number;
  nextBoolean(): boolean;
  nextItem<T>(array: T[]): T | undefined;
  shuffle<T>(array: T[]): T[];
  reset(): void;
}
