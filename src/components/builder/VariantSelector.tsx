import type { Variant } from '@/types/bundle.types';
import { setActiveVariant } from '@store/slices/bundleSlice';
import { useAppDispatch } from '@store/hooks';

interface VariantSelectorProps {
  productId: string;
  variants: Variant[];
  activeVariantId: string;
}

/**
 * Row of colour chips. Selecting one makes it the product's active variant, which
 * the card's stepper is then bound to (each variant keeps its own quantity).
 */
const VariantSelector = ({ productId, variants, activeVariantId }: VariantSelectorProps) => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-wrap items-end gap-1">
      {variants.map((variant) => {
        const isActive = variant.id === activeVariantId;
        return (
          <button
            key={variant.id}
            type="button"
            onClick={() => dispatch(setActiveVariant({ productId, variantId: variant.id }))}
            className={`flex h-[26px] items-center justify-center gap-0.5 rounded-[2px] px-1 py-px outline -outline-offset-[0.5px] transition-colors ${
              isActive
                ? 'bg-[rgba(29,240,187,0.04)] outline-[0.5px] outline-chip-active'
                : 'bg-white outline-[0.5px] outline-chip-border'
            }`}
            // a11y: passed via spread so the editor's HTML linter doesn't misread the JSX expression
            {...{ 'aria-pressed': isActive }}
          >
            {variant.swatch && (
              <span className="flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-[5px]">
                {/* Swatch PNGs have transparent padding; zoom slightly so the
                    product fills the chip (keeps swatch and label visually close). */}
                <img src={variant.swatch} alt="" className="h-full w-full scale-[1.3] object-cover" />
              </span>
            )}
            <span className="text-[10px] font-medium leading-[10px] tracking-[0.6px] text-ink">
              {variant.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default VariantSelector;
