import type { Product } from '@/types/bundle.types';
import { selectQuantities, setQuantity } from '@store/slices/bundleSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { selectionKey } from '@utils/selection';

import PriceTag from '@components/ui/PriceTag';
import { PlanLogoIcon } from '@components/ui/icons';

interface PlanCardProps {
  product: Product;
}

/**
 * Plan step card. The plan is a single monthly subscription, so instead of a
 * quantity stepper it toggles selected / not selected.
 */
const PlanCard = ({ product }: PlanCardProps) => {
  const dispatch = useAppDispatch();
  const quantities = useAppSelector(selectQuantities);
  const variant = product.variants[0];
  const key = selectionKey(product.id, variant.id);
  const isSelected = (quantities[key] ?? 0) > 0;

  return (
    <div
      className={`flex items-center gap-3 rounded-card bg-white p-4 ${
        isSelected ? 'outline outline-2 -outline-offset-2 outline-brand/70' : ''
      }`}
    >
      <PlanLogoIcon className="h-10 w-auto shrink-0" />

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <h3 className="text-base font-bold leading-4 text-ink-900">
          Cam <span className="text-brand">Unlimited</span>
        </h3>
        {product.description && (
          <p className="text-xs font-medium leading-[15.6px] tracking-[0.6px] text-ink/75">
            {product.description}
          </p>
        )}
      </div>

      <PriceTag price={variant.price} compareAt={variant.compareAt} monthly variant="review" />

      <button
        type="button"
        onClick={() => dispatch(setQuantity({ productId: product.id, variantId: variant.id, quantity: isSelected ? 0 : 1 }))}
        className={`rounded-[4px] border px-4 py-2 text-sm font-semibold transition-colors ${
          isSelected
            ? 'border-brand bg-brand text-white'
            : 'border-brand bg-white text-brand hover:bg-brand/5'
        }`}
      >
        {isSelected ? 'Selected' : 'Select'}
      </button>
    </div>
  );
};

export default PlanCard;
