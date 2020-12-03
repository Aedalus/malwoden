export interface RNG {
  next(min?: number, max?: number): number;
  nextInt(min?: number, max?: number): number;
  nextBoolean(): boolean;
  nextItem<T>(array: T[]): T | undefined;
  shuffle<T>(array: T[]): T[];
  reset(): void;
}
