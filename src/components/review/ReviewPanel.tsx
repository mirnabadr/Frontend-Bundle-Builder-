import { useState } from 'react';

import {
  selectCatalog,
  selectPersisted,
  selectPlanLine,
  selectReviewGroups,
  selectTotals,
} from '@store/slices/bundleSlice';
import { useAppSelector } from '@store/hooks';
import { persistenceService } from '@services/persistence.service';
import { formatMoney, formatMonthly } from '@utils/formatMoney';

import PriceTag from '@components/ui/PriceTag';
import { PlanLogoIcon, TruckIcon } from '@components/ui/icons';
import ReviewGroup from './ReviewGroup';

/**
 * "Your security system" — the live summary.
 *
 * Responsive to match both Figma frames:
 *  - < xl  : a compact column (sidebar in the side-by-side layout, or stacked
 *            below the builder on mobile).
 *  - xl+   : a wide 2-column block (line items left, badge/returns/total/checkout
 *            right) sitting full-width below the builder.
 */
const ReviewPanel = () => {
  const catalog = useAppSelector(selectCatalog);
  const groups = useAppSelector(selectReviewGroups);
  const planLine = useAppSelector(selectPlanLine);
  const totals = useAppSelector(selectTotals);
  const persisted = useAppSelector(selectPersisted);

  const [saved, setSaved] = useState(false);
  const [checkedOut, setCheckedOut] = useState(false);

  if (!catalog) return null;

  const handleSave = () => {
    persistenceService.save(persisted);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const financingPill = (
    <span className="rounded-[3px] bg-brand px-2 py-[5px] text-xs font-medium text-white xl:p-2 xl:text-base">
      as low as {formatMonthly(totals.monthly)}
    </span>
  );

  return (
    <aside className="flex flex-col gap-[5px] rounded-[10px] bg-panel pt-[15px]">
      {/* Eyebrow only in the compact layout */}
      <span className="px-[15px] text-xs font-medium uppercase leading-3 tracking-[1.6px] text-ink-700 xl:hidden">
        Review
      </span>

      <div className="flex flex-col gap-2.5 px-5 pb-[31px] pt-5 xl:flex-row xl:justify-center xl:gap-[52px]">
        {/* LEFT — heading + line items */}
        <div className="flex flex-col gap-2.5 xl:w-[552px]">
          <div className="flex flex-col gap-[5px]">
            <h2 className="text-[22px] font-semibold leading-[22px] tracking-[0.6px] text-ink xl:text-[28px] xl:leading-[28px]">
              Your security system
            </h2>
            <p className="text-sm font-medium leading-[18.2px] tracking-[0.6px] text-ink/75 xl:text-base xl:leading-[20.8px]">
              Review your personalized protection system designed to keep what matters most safe.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {groups.map((group) => (
              <ReviewGroup key={group.category} category={group.category} lines={group.lines} />
            ))}

            {/* Plan (monthly, no stepper) */}
            {planLine && (
              <div className="flex flex-col gap-2 border-t border-line pt-[15px]">
                <span className="text-xs font-normal uppercase leading-4 tracking-[0.36px] text-subhead">
                  Plan
                </span>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-[3px]">
                    <PlanLogoIcon className="h-6 w-auto" />
                    <span className="text-base font-bold leading-4 text-ink-900">
                      Cam <span className="text-brand">Unlimited</span>
                    </span>
                  </div>
                  <PriceTag
                    price={planLine.variant.price}
                    compareAt={planLine.variant.compareAt}
                    monthly
                    variant="review"
                  />
                </div>
              </div>
            )}

            {/* Shipping */}
            <div className="flex flex-col gap-2 border-t border-line pt-[15px]">
              <div className="flex items-center gap-4">
                <div className="flex flex-1 items-center gap-3">
                  <span className="flex h-[41px] w-[41px] items-center justify-center rounded-[5px] bg-white">
                    <TruckIcon className="h-[29px] w-[29px]" />
                  </span>
                  <span className="flex-1 text-sm font-medium leading-4 tracking-[0.07px] text-ink-900 xl:text-lg">
                    {catalog.config.shippingLabel}
                  </span>
                </div>
                <PriceTag price={0} compareAt={catalog.config.shippingCompareAt} free variant="review" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — guarantee, financing, total, checkout */}
        <div className="flex flex-col gap-2 pt-[15px] xl:w-[486px] xl:pt-0">
          <div className="flex flex-col gap-4">
            {/* Badge + (returns text @xl) + (financing/total @compact) */}
            <div className="flex items-center justify-between gap-2 xl:justify-start xl:gap-[25px]">
              <img
                src="/images/satisfaction-badge.png"
                alt="100% Wyze satisfaction guarantee"
                className="h-[78px] w-[78px] shrink-0 xl:h-[131px] xl:w-[131px]"
              />
              {/* 30-day returns copy — xl only */}
              <p className="hidden flex-1 flex-col text-lg leading-[19.8px] tracking-[0.6px] text-ink xl:flex">
                <span className="font-semibold">30-day hassle-free returns</span>
                <span className="mt-3 font-normal">
                  If you&rsquo;re not totally in love with the product, we will refund you 100%.
                </span>
              </p>
              {/* financing + total — compact only */}
              <div className="flex flex-col items-end gap-2 xl:hidden">
                {financingPill}
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-medium leading-5 tracking-[0.04px] text-muted line-through">
                    {formatMoney(totals.compareTotal)}
                  </span>
                  <span className="text-2xl font-bold leading-8 text-brand">
                    {formatMoney(totals.subtotal)}
                  </span>
                </div>
              </div>
            </div>

            {/* financing + total row — xl only */}
            <div className="hidden items-center justify-between xl:flex">
              {financingPill}
              <div className="flex items-baseline gap-2">
                <span className="text-[22px] font-medium leading-5 tracking-[0.06px] text-muted line-through">
                  {formatMoney(totals.compareTotal)}
                </span>
                <span className="text-[28px] font-bold leading-8 text-brand">
                  {formatMoney(totals.subtotal)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1 pt-2.5">
            {totals.savings > 0 && (
              <p className="text-center text-xs font-semibold leading-3 text-success xl:text-sm xl:leading-[14px]">
                Congrats! You&rsquo;re saving {formatMoney(totals.savings)} on your security bundle!
              </p>
            )}
            <button
              type="button"
              onClick={() => setCheckedOut(true)}
              className="w-full rounded-[4px] bg-brand px-4 py-[13px] text-[17px] font-bold text-white transition-colors hover:bg-brand/90"
            >
              {checkedOut ? '✓ Order placed (demo)' : 'Checkout'}
            </button>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="text-center text-sm italic leading-[16.8px] text-ink-700 underline"
          >
            {saved ? 'System saved! ✓' : 'Save my system for later'}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ReviewPanel;
