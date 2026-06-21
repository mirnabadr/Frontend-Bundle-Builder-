import { formatMoney, formatMonthly } from '@utils/formatMoney';

type PriceVariant = 'card' | 'review';

interface PriceTagProps {
  price: number;
  compareAt?: number;
  free?: boolean;
  monthly?: boolean;
  variant?: PriceVariant;
}

const format = (value: number, monthly?: boolean) =>
  monthly ? formatMonthly(value) : formatMoney(value);

/**
 * Compare-at (struck-through) price + active price. Colours differ by context:
 * on cards the active price is neutral grey with a red strike; in the review
 * panel the active price is brand purple with a grey strike. "free" shows FREE.
 */
const PriceTag = ({
  price,
  compareAt,
  free = false,
  monthly = false,
  variant = 'card',
}: PriceTagProps) => {
  const showCompare = compareAt !== undefined && compareAt > price;

  if (variant === 'review') {
    // Stacked on mobile/side-by-side, inline (price beside strike) at xl —
    // matching the wide bottom-review frame. Sizes bump 14px → 16px at xl.
    return (
      <div className="flex flex-col items-end xl:flex-row xl:items-baseline xl:gap-2.5">
        {showCompare && (
          <span className="text-sm leading-4 font-medium text-muted line-through tracking-[0.07px] xl:text-base">
            {format(compareAt!, monthly)}
          </span>
        )}
        <span className="text-sm leading-4 font-semibold text-brand tracking-[0.07px] xl:text-base">
          {free ? 'FREE' : format(price, monthly)}
        </span>
      </div>
    );
  }

  // Card variant: stacked in the narrow side-by-side layout, inline (compare-at
  // beside the price) in the full-width 5-across layout — matching both frames.
  return (
    <div className="flex flex-col items-end gap-[3px] xl:flex-row xl:items-baseline xl:gap-1.5">
      {showCompare && (
        <span className="text-base leading-4 font-normal text-sale line-through tracking-[0.6px]">
          {format(compareAt!, monthly)}
        </span>
      )}
      <span className="text-base leading-4 font-normal text-ink-gray tracking-[0.6px]">
        {free ? 'FREE' : format(price, monthly)}
      </span>
    </div>
  );
};

export default PriceTag;
