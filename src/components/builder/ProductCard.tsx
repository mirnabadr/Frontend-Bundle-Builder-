import type { Product } from '@/types/bundle.types';
import { selectActiveVariant, selectQuantities } from '@store/slices/bundleSlice';
import { useAppSelector } from '@store/hooks';
import { selectionKey } from '@utils/selection';

import Badge from '@components/ui/Badge';
import PriceTag from '@components/ui/PriceTag';
import QuantityStepper from '@components/ui/QuantityStepper';
import VariantSelector from './VariantSelector';

interface ProductCardProps {
  product: Product;
}

/**
 * The product images are square PNGs (e.g. 713×713) with transparent padding,
 * shown `object-contain` so the whole product is always visible (never cropped).
 *
 * In the full-width (xl) layout each card has its OWN image-box height — these
 * are the Figma image-frame heights. The card stacks from the top
 * (justify-start) with a 15px bottom pad, so the leftover space falls at the
 * bottom of the card; because each image box is a different height, the bottom
 * gap differs per card — exactly matching the design.
 *
 * Pan v3 is the exception: its box flex-grows to fill the card (Figma: the image
 * frame is `flex: 1`), so its image is the largest and sits directly below the
 * Save badge.
 */
/**
 * xl image-box heights, sized to fit the Figma card height of 331px
 * (331 − 30 padding − 19 gap = 282px shared between the image box and the text
 * section). Cards with taller text (Floodlight's 3-line desc, Battery's 4-line)
 * get a shorter box; cards with short text get a taller one. Pan v3 reserves a
 * top gap (pt) so it drops below the Save badge.
 */
const XL_IMAGE_BOX: Record<string, string> = {
  'cam-v4': 'xl:h-[117px]',
  'cam-pan-v3': 'xl:h-[130px] xl:pt-[14px]',
  'floodlight-v2': 'xl:h-[130px]',
  'duo-doorbell': 'xl:h-[118px]',
  'battery-cam-pro': 'xl:h-[92px]',
};
const XL_IMAGE_BOX_DEFAULT = 'xl:h-[150px]';

/**
 * Per-product image alignment inside the xl box (object-position only — the
 * image always fills the box via h-full/w-full + object-contain, so it is never
 * cropped). Pan v3 and the Floodlight anchor right (Figma: image in the right
 * corner, clear of the left-aligned badge); everything else centres.
 */
const XL_IMAGE_POS: Record<string, string> = {
  'cam-pan-v3': 'object-[right_center]',
  'floodlight-v2': 'object-right',
};
const XL_IMAGE_POS_DEFAULT = 'object-center';

/**
 * Per-product description font size at xl. The design uses 14px (130%) for the
 * descriptions, except the Floodlight, which stays 12px so its longer 3-line
 * text keeps "…with a 160°" on the first line.
 */
const XL_DESC_CLASS: Record<string, string> = {
  'floodlight-v2': 'xl:text-xs xl:leading-[15.6px]', // 12px / 130%
};
const XL_DESC_CLASS_DEFAULT = 'xl:text-sm xl:leading-[18.2px]'; // 14px / 130%

/**
 * Card gap between the image box and the text section. Figma is 19px; the
 * Floodlight tightens to 11px to free vertical room for a larger image while
 * the card stays exactly 331px.
 */
const XL_CARD_GAP: Record<string, string> = {
  'floodlight-v2': 'xl:gap-[11px]',
};
const XL_CARD_GAP_DEFAULT = 'xl:gap-[19px]';

/**
 * A builder product card. Responsive: horizontal (image left) in the side-by-side
 * layout (< xl), vertical (image on top) in the full-width 5-across layout (xl+).
 * The stepper is bound to the product's *active* variant, and the card shows its
 * selected state whenever it has any units across variants.
 */
const ProductCard = ({ product }: ProductCardProps) => {
  const activeVariantMap = useAppSelector(selectActiveVariant);
  const quantities = useAppSelector(selectQuantities);

  const activeVariantId = activeVariantMap[product.id] ?? product.variants[0].id;
  const activeVariant =
    product.variants.find((v) => v.id === activeVariantId) ?? product.variants[0];
  const cardQuantity = quantities[selectionKey(product.id, activeVariant.id)] ?? 0;

  const totalQuantity = product.variants.reduce(
    (sum, v) => sum + (quantities[selectionKey(product.id, v.id)] ?? 0),
    0,
  );
  const isSelected = totalQuantity > 0;
  const hasVariants = product.variants.length > 1;
  const xlBox = XL_IMAGE_BOX[product.id] ?? XL_IMAGE_BOX_DEFAULT;
  const xlImgPos = XL_IMAGE_POS[product.id] ?? XL_IMAGE_POS_DEFAULT;
  const xlDesc = XL_DESC_CLASS[product.id] ?? XL_DESC_CLASS_DEFAULT;
  const xlGap = XL_CARD_GAP[product.id] ?? XL_CARD_GAP_DEFAULT;

  return (
    <div
      className={`flex h-full items-center rounded-card bg-white p-[11px] xl:h-[331px] xl:flex-col xl:items-stretch xl:justify-center ${xlGap} xl:py-[15px] ${
        isSelected ? 'gap-[19px]' : 'gap-[13px]'
      } ${isSelected ? 'outline outline-2 -outline-offset-2 outline-brand/70' : ''}`}
    >
      {/* Image area: 101px-wide square at the side-by-side sizes; at xl a
          full-width white box whose height is set per product (XL_IMAGE_BOX) —
          Pan v3 flex-grows to fill, so its image is largest and sits right
          under the badge. */}
      <div
        className={`relative w-[101px] shrink-0 self-stretch xl:w-full xl:shrink-0 xl:self-auto xl:overflow-hidden xl:rounded-[5px] xl:bg-white ${xlBox}`}
      >
        {/* < xl : square, contained image on the left */}
        <img
          src={product.image}
          alt={product.name}
          className="h-full max-h-[137px] w-full object-contain xl:hidden"
        />
        {/* xl : whole product, contained (never cropped), filling the box.
            h-full/w-full give object-contain a box to fit into, so the image
            always shows in full and the sections sit below it. */}
        <img
          src={product.image}
          alt=""
          aria-hidden
          className={`hidden h-full w-full object-contain xl:block ${xlImgPos}`}
        />
        {product.badge && (
          <Badge label={product.badge} className="absolute left-0 top-0" />
        )}
      </div>

      {/* Content column — natural height at xl (not flex-1) so the leftover
          space falls at the card bottom, giving each card its own bottom gap. */}
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 xl:w-full xl:flex-none xl:gap-[10px]">
        <div className="flex flex-col gap-2.5">
          {/* leading-[1.15] keeps two-line titles from cramping. At xl the title
              tracking drops to 0 so "Wyze Cam Floodlight v2" fits on one line
              (with 0.6px it overflowed 203px and wrapped), matching the Figma. */}
          <h3 className="text-base font-semibold leading-[1.15] tracking-[0.6px] text-ink xl:text-lg xl:tracking-normal">
            {product.name}
          </h3>
          {/* Figma: Gilroy-Medium, 0.6px tracking. 12px in the narrow layout,
              14px (130%) at xl per the design — except the Floodlight, which
              stays 12px (XL_DESC_CLASS) to keep "…with a 160°" on line 1. */}
          {product.description && (
            <p
              className={`text-xs font-medium leading-[15.6px] tracking-[0.6px] text-ink/75 ${xlDesc}`}
            >
              {product.description}{' '}
              {product.learnMoreUrl && (
                <a
                  href={product.learnMoreUrl}
                  className="font-medium text-[#0000EE] underline"
                  onClick={(e) => e.preventDefault()}
                >
                  Learn More
                </a>
              )}
            </p>
          )}
          {hasVariants && (
            <VariantSelector
              productId={product.id}
              variants={product.variants}
              activeVariantId={activeVariant.id}
            />
          )}
        </div>

        {/* < xl : mt-auto pins the price to the card bottom (image-left layout).
            xl : no mt-auto — the card centres image + text + price with a 19px
            gap (Figma Frame 543: justify-center), so there's no empty space
            between the text and the price, and blocks align across cards. */}
        <div className="mt-auto flex items-end justify-between gap-4 xl:mt-0 xl:items-center">
          <QuantityStepper
            productId={product.id}
            variantId={activeVariant.id}
            quantity={cardQuantity}
            variant="card"
            locked={product.locked}
          />
          <PriceTag
            price={activeVariant.price}
            compareAt={activeVariant.compareAt}
            free={activeVariant.free}
            monthly={product.monthly}
            variant="card"
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
