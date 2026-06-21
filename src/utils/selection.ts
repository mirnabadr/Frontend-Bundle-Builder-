import type { Variant } from '@/types/bundle.types';

/**
 * A selection is keyed by product + variant so every colour is tracked
 * independently. "cam-v4:white" and "cam-v4:black" are separate counts.
 */
export const selectionKey = (productId: string, variantId: string): string =>
  `${productId}:${variantId}`;

/** The one-time (or monthly) active price of a variant, accounting for "free". */
export const variantPrice = (variant: Variant): number =>
  variant.free ? 0 : variant.price;

/** The compare-at price; falls back to the active price when there's no discount. */
export const variantCompareAt = (variant: Variant): number =>
  variant.compareAt ?? variant.price;
