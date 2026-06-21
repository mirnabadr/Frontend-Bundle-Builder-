import type { Product, Step } from '@/types/bundle.types';
import { selectCatalog } from '@store/slices/bundleSlice';
import { useAppSelector } from '@store/hooks';

import AccordionStep from './AccordionStep';
import ProductCard from './ProductCard';
import PlanCard from './PlanCard';

/**
 * Grid of product cards. 1-up on mobile, 2-up in the side-by-side layout
 * (md–lg), and 5-up in the full-width layout (xl+) — matching both Figma frames.
 */
const ProductGrid = ({ products }: { products: Product[] }) => (
  // 1-up (mobile) · 2-up (side-by-side md–lg) · 5-up (full-width xl+). In the
  // 2-up layout an odd, lone last card (e.g. the 5th camera) is centred on its
  // row to match the Figma, then reset back to a normal cell at xl.
  <div
    className="grid w-full grid-cols-1 gap-[15px] md:grid-cols-2 xl:grid-cols-5
      md:[&>*:nth-child(odd):last-child:not(:first-child)]:col-span-2
      md:[&>*:nth-child(odd):last-child:not(:first-child)]:mx-auto
      md:[&>*:nth-child(odd):last-child:not(:first-child)]:w-[calc(50%-7.5px)]
      xl:[&>*:nth-child(odd):last-child:not(:first-child)]:col-span-1
      xl:[&>*:nth-child(odd):last-child:not(:first-child)]:mx-0
      xl:[&>*:nth-child(odd):last-child:not(:first-child)]:w-auto"
  >
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
);

const StepBody = ({ step, products }: { step: Step; products: Product[] }) => {
  if (step.id === 'plan') {
    return (
      <div className="flex w-full flex-col gap-[15px]">
        {products.map((p) => (
          <PlanCard key={p.id} product={p} />
        ))}
      </div>
    );
  }
  return <ProductGrid products={products} />;
};

/** The left column: a 4-step accordion driving the whole configuration. */
const Builder = () => {
  const catalog = useAppSelector(selectCatalog);
  if (!catalog) return null;

  return (
    <div className="flex w-full flex-col gap-[13px]">
      {catalog.steps.map((step, index) => {
        const products = catalog.products.filter(
          (p) => p.stepId === step.id && p.showInBuilder,
        );
        return (
          <AccordionStep key={step.id} step={step} index={index} total={catalog.steps.length}>
            <StepBody step={step} products={products} />
          </AccordionStep>
        );
      })}
    </div>
  );
};

export default Builder;
