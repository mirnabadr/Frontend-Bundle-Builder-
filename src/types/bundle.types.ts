/**
 * Domain types for the bundle builder.
 *
 * The data is fully catalog-driven (see src/data/bundle.json). Every product is
 * modelled as a list of variants — products with no colour options simply have a
 * single variant — so the quantity/selection logic stays uniform everywhere.
 */

/** Review-panel grouping a product belongs to. */
export type Category = 'Cameras' | 'Sensors' | 'Accessories' | 'Plan';

/** The four builder steps, top to bottom. */
export type StepId = 'cameras' | 'plan' | 'sensors' | 'protection';

/** Icon keys mapped to inline SVG icon components in the UI. */
export type StepIconKey = 'camera' | 'shield' | 'sensor' | 'grid';

export interface Step {
  id: StepId;
  /** "STEP n OF 4" is derived from order; this is the human title. */
  title: string;
  icon: StepIconKey;
  /** Label on the advance button, e.g. "Choose your plan". Last step has none. */
  nextLabel?: string;
}

export interface Variant {
  id: string;
  label: string; // e.g. "White", "Black"
  /** Small swatch thumbnail shown inside the colour chip. */
  swatch?: string;
  /** Pre-discount price (struck through). Omit when there is no discount. */
  compareAt?: number;
  /** Active price for one unit of this variant. */
  price: number;
  /** When true the line shows "FREE" instead of the price (e.g. required hub). */
  free?: boolean;
}

export interface Product {
  id: string;
  stepId: StepId;
  category: Category;
  name: string;
  description?: string;
  learnMoreUrl?: string;
  /** Main product image (card + review thumbnail). */
  image: string;
  /** Optional discount badge text, e.g. "Save 22%". */
  badge?: string;
  /** Per-variant pricing & colour options. Single entry = no colour selector. */
  variants: Variant[];
  /**
   * Monthly-priced item (the plan) — rendered specially in the review panel
   * ("$9.99/mo") and excluded from the one-time card grid.
   */
  monthly?: boolean;
  /**
   * Whether this product renders as an interactive card in the builder grid.
   * Some items (plan, pre-seeded sensors/accessory) appear only in the review
   * panel in this particular view.
   */
  showInBuilder?: boolean;
  /** Required items (e.g. the Sense Hub) render a locked/disabled stepper. */
  locked?: boolean;
}

export interface BundleCatalog {
  steps: Step[];
  products: Product[];
  /** Seed quantities so first paint matches the design exactly. */
  seed: SeedEntry[];
  /** Bundle-level financing & shipping config used by the review panel. */
  config: BundleConfig;
}

export interface SeedEntry {
  productId: string;
  variantId: string;
  quantity: number;
}

export interface BundleConfig {
  /** Number of months used for the "as low as $X/mo" financing line. */
  financingMonths: number;
  shippingLabel: string;
  shippingCompareAt: number; // struck-through shipping price (shown FREE)
}

/** A composed line for the review panel (product + the specific variant + qty). */
export interface ReviewLine {
  product: Product;
  variant: Variant;
  quantity: number;
}
