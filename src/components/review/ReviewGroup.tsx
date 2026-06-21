import type { Category, ReviewLine as ReviewLineType } from '@/types/bundle.types';

import ReviewLine from './ReviewLine';

interface ReviewGroupProps {
  category: Category;
  lines: ReviewLineType[];
}

/** A category section in the review panel (subheading + its line items). */
const ReviewGroup = ({ category, lines }: ReviewGroupProps) => (
  <div className="flex flex-col gap-2 border-t border-line pt-[15px]">
    <span className="text-xs font-normal uppercase leading-4 tracking-[0.36px] text-subhead">
      {category}
    </span>
    <div className="flex flex-col gap-3">
      {lines.map((line) => (
        <ReviewLine key={`${line.product.id}:${line.variant.id}`} line={line} />
      ))}
    </div>
  </div>
);

export default ReviewGroup;
