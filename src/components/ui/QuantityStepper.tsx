import { decrement, increment } from '@store/slices/bundleSlice';
import { useAppDispatch } from '@store/hooks';

import { MinusIcon, PlusIcon } from './icons';

type StepperVariant = 'card' | 'review';

interface QuantityStepperProps {
  productId: string;
  variantId: string;
  quantity: number;
  variant?: StepperVariant;
  /** Lowest quantity the minus button allows (default 0). */
  min?: number;
  /** Required items (e.g. the Sense Hub) render as a disabled stepper. */
  locked?: boolean;
}

const sizing: Record<StepperVariant, { wrap: string; value: string }> = {
  card: { wrap: 'w-20 gap-2.5', value: 'text-base leading-5 font-medium text-ink-900' },
  review: { wrap: 'w-[72px]', value: 'text-sm leading-4 font-semibold text-ink-900' },
};

const btnBase =
  'flex h-5 w-5 items-center justify-center rounded transition-colors';

/**
 * Quantity stepper bound to a single product+variant. Both the product card and
 * the review line render this for the same key, so editing one updates the other
 * automatically (they dispatch the same action against shared Redux state).
 */
const QuantityStepper = ({
  productId,
  variantId,
  quantity,
  variant = 'card',
  min = 0,
  locked = false,
}: QuantityStepperProps) => {
  const dispatch = useAppDispatch();
  const canDecrement = !locked && quantity > min;

  // Per-variant button styling pulled from the Figma states.
  const enabledBtn =
    variant === 'card' ? 'bg-stepper-bg' : 'bg-white';
  const enabledIcon = variant === 'card' ? 'text-stepper-icon' : 'text-ink-gray';
  const lockedBtn = 'bg-stepper-disabled outline outline-1 -outline-offset-1 outline-line';
  const minusDisabledBtn =
    variant === 'card'
      ? 'bg-white outline outline-2 -outline-offset-2 outline-[#E6EBF0]'
      : lockedBtn;

  const minusClass = locked
    ? lockedBtn
    : canDecrement
      ? enabledBtn
      : minusDisabledBtn;
  // Locked (required) glyphs use the design's #575757 (ink-gray) on the disabled
  // #F1F1F2 fill; a non-locked minus at its min stays the lighter disabled grey.
  const minusIconColor = locked ? 'text-ink-gray' : canDecrement ? enabledIcon : 'text-line';
  const plusClass = locked ? lockedBtn : enabledBtn;
  const plusIconColor = locked ? 'text-ink-gray' : enabledIcon;

  return (
    <div
      className={`flex items-center justify-between rounded py-1 ${sizing[variant].wrap}`}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={!canDecrement}
        onClick={() => dispatch(decrement({ productId, variantId }))}
        className={`${btnBase} ${minusClass} ${
          canDecrement ? 'cursor-pointer' : 'cursor-not-allowed'
        }`}
      >
        <MinusIcon className={`h-2.5 w-2 ${minusIconColor}`} />
      </button>

      <span className={sizing[variant].value}>{quantity}</span>

      <button
        type="button"
        aria-label="Increase quantity"
        disabled={locked}
        onClick={() => dispatch(increment({ productId, variantId }))}
        className={`${btnBase} ${plusClass} ${
          locked ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <PlusIcon className={`h-2 w-2 ${plusIconColor}`} />
      </button>
    </div>
  );
};

export default QuantityStepper;
