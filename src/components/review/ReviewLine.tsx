import type { ReviewLine as ReviewLineType } from '@/types/bundle.types';

import PriceTag from '@components/ui/PriceTag';
import QuantityStepper from '@components/ui/QuantityStepper';

interface ReviewLineProps {
  line: ReviewLineType;
}

/** One configured item in the review panel: thumb, name, synced stepper, price. */
const ReviewLine = ({ line }: ReviewLineProps) => {
  const { product, variant, quantity } = line;

  return (
    <div className="flex items-center gap-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <img
          src={product.image}
          alt={product.name}
          className="h-[41px] w-[41px] shrink-0 rounded-[5px] bg-white object-contain p-0.5"
        />
        <span className="min-w-0 flex-1 text-sm font-medium leading-4 tracking-[0.07px] text-ink-900 xl:text-lg">
          {product.name}
        </span>
        <QuantityStepper
          productId={product.id}
          variantId={variant.id}
          quantity={quantity}
          variant="review"
          locked={product.locked}
        />
      </div>
      {/* The review panel shows the line total (unit price × quantity). */}
      <PriceTag
        price={variant.price * quantity}
        compareAt={variant.compareAt !== undefined ? variant.compareAt * quantity : undefined}
        free={variant.free}
        variant="review"
      />
    </div>
  );
};

export default ReviewLine;
