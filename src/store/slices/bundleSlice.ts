import { createSelector, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type {
  BundleCatalog,
  Category,
  Product,
  ReviewLine,
  StepId,
} from '@/types/bundle.types';
import { selectionKey, variantCompareAt, variantPrice } from '@utils/selection';
import type { RootState } from '@store/index';

/** The persisted slice of state — what "Save my system for later" stores. */
export interface PersistedBundle {
  openStepId: StepId | null;
  quantities: Record<string, number>;
  activeVariant: Record<string, string>;
}

interface BundleState extends PersistedBundle {
  status: 'idle' | 'loading' | 'ready' | 'error';
  catalog: BundleCatalog | null;
}

const initialState: BundleState = {
  status: 'idle',
  catalog: null,
  openStepId: null,
  quantities: {},
  activeVariant: {},
};

/** Build the default selection from the catalog's seed entries. */
const seedFromCatalog = (catalog: BundleCatalog): PersistedBundle => {
  const quantities: Record<string, number> = {};
  const activeVariant: Record<string, string> = {};

  // Default every product's active chip to its first variant.
  for (const product of catalog.products) {
    activeVariant[product.id] = product.variants[0]?.id ?? '';
  }
  // Apply seeded quantities (and make seeded variants the active chip).
  for (const entry of catalog.seed) {
    quantities[selectionKey(entry.productId, entry.variantId)] = entry.quantity;
    activeVariant[entry.productId] = entry.variantId;
  }

  return {
    openStepId: catalog.steps[0]?.id ?? null,
    quantities,
    activeVariant,
  };
};

const bundleSlice = createSlice({
  name: 'bundle',
  initialState,
  reducers: {
    loadStarted(state) {
      state.status = 'loading';
    },
    /**
     * Catalog fetched. If a saved system is passed it is restored verbatim,
     * otherwise we apply the design's seed so first paint matches the mockup.
     */
    bundleLoaded(
      state,
      action: PayloadAction<{ catalog: BundleCatalog; restored?: PersistedBundle | null }>,
    ) {
      const { catalog, restored } = action.payload;
      state.catalog = catalog;
      state.status = 'ready';
      const base = seedFromCatalog(catalog);
      if (restored) {
        // Merge so new catalog products still get a sane active variant.
        state.openStepId = restored.openStepId ?? base.openStepId;
        state.quantities = restored.quantities ?? {};
        state.activeVariant = { ...base.activeVariant, ...restored.activeVariant };
      } else {
        state.openStepId = base.openStepId;
        state.quantities = base.quantities;
        state.activeVariant = base.activeVariant;
      }
    },
    loadFailed(state) {
      state.status = 'error';
    },
    /**
     * Background refresh from the API: swap in the latest catalog without
     * resetting the shopper's current selections. New products still get a
     * sensible default active variant.
     */
    catalogRefreshed(state, action: PayloadAction<BundleCatalog>) {
      state.catalog = action.payload;
      state.status = 'ready';
      for (const product of action.payload.products) {
        if (!state.activeVariant[product.id]) {
          state.activeVariant[product.id] = product.variants[0]?.id ?? '';
        }
      }
    },
    setOpenStep(state, action: PayloadAction<StepId>) {
      // Toggle: clicking the open step collapses it.
      state.openStepId = state.openStepId === action.payload ? null : action.payload;
    },
    setActiveVariant(state, action: PayloadAction<{ productId: string; variantId: string }>) {
      state.activeVariant[action.payload.productId] = action.payload.variantId;
    },
    increment(state, action: PayloadAction<{ productId: string; variantId: string }>) {
      const key = selectionKey(action.payload.productId, action.payload.variantId);
      state.quantities[key] = (state.quantities[key] ?? 0) + 1;
    },
    decrement(state, action: PayloadAction<{ productId: string; variantId: string }>) {
      const key = selectionKey(action.payload.productId, action.payload.variantId);
      state.quantities[key] = Math.max(0, (state.quantities[key] ?? 0) - 1);
    },
    setQuantity(
      state,
      action: PayloadAction<{ productId: string; variantId: string; quantity: number }>,
    ) {
      const key = selectionKey(action.payload.productId, action.payload.variantId);
      state.quantities[key] = Math.max(0, Math.floor(action.payload.quantity));
    },
    reset(state) {
      if (state.catalog) {
        const base = seedFromCatalog(state.catalog);
        state.openStepId = base.openStepId;
        state.quantities = base.quantities;
        state.activeVariant = base.activeVariant;
      }
    },
  },
});

export const {
  loadStarted,
  bundleLoaded,
  loadFailed,
  catalogRefreshed,
  setOpenStep,
  setActiveVariant,
  increment,
  decrement,
  setQuantity,
  reset,
} = bundleSlice.actions;

export default bundleSlice.reducer;

/* ----------------------------- Selectors ----------------------------- */

export const selectStatus = (s: RootState) => s.bundle.status;
export const selectCatalog = (s: RootState) => s.bundle.catalog;
export const selectOpenStepId = (s: RootState) => s.bundle.openStepId;
export const selectQuantities = (s: RootState) => s.bundle.quantities;
export const selectActiveVariant = (s: RootState) => s.bundle.activeVariant;

/** The persistable subset of state (what we save to localStorage). */
export const selectPersisted = createSelector(
  [selectOpenStepId, selectQuantities, selectActiveVariant],
  (openStepId, quantities, activeVariant): PersistedBundle => ({
    openStepId,
    quantities,
    activeVariant,
  }),
);

const selectProducts = createSelector(
  [selectCatalog],
  (catalog): Product[] => catalog?.products ?? [],
);

/** Quantity of a product's currently-active variant (drives the card stepper). */
export const selectCardQuantity = (productId: string) =>
  createSelector([selectActiveVariant, selectQuantities], (active, quantities) => {
    const variantId = active[productId];
    return quantities[selectionKey(productId, variantId)] ?? 0;
  });

/** Distinct products with total qty > 0 within a step → the "N selected" count. */
export const selectStepSelectedCount = (stepId: StepId) =>
  createSelector([selectProducts, selectQuantities], (products, quantities) =>
    products
      .filter((p) => p.stepId === stepId)
      .reduce((count, p) => {
        const hasAny = p.variants.some(
          (v) => (quantities[selectionKey(p.id, v.id)] ?? 0) > 0,
        );
        return count + (hasAny ? 1 : 0);
      }, 0),
  );

/** Every variant with qty > 0, as its own review line (in catalog order). */
export const selectAllReviewLines = createSelector(
  [selectProducts, selectQuantities],
  (products, quantities): ReviewLine[] => {
    const lines: ReviewLine[] = [];
    for (const product of products) {
      for (const variant of product.variants) {
        const quantity = quantities[selectionKey(product.id, variant.id)] ?? 0;
        if (quantity > 0) lines.push({ product, variant, quantity });
      }
    }
    return lines;
  },
);

const ITEM_CATEGORIES: Category[] = ['Cameras', 'Sensors', 'Accessories'];

/** Review lines grouped under their category subheadings (excludes Plan). */
export const selectReviewGroups = createSelector([selectAllReviewLines], (lines) =>
  ITEM_CATEGORIES.map((category) => ({
    category,
    lines: lines.filter((l) => l.product.category === category),
  })).filter((group) => group.lines.length > 0),
);

/** The plan line (rendered specially: monthly price, no stepper). */
export const selectPlanLine = createSelector(
  [selectAllReviewLines],
  (lines): ReviewLine | null => lines.find((l) => l.product.category === 'Plan') ?? null,
);

/** Cart maths — all derived, never stored. */
export const selectTotals = createSelector(
  [selectAllReviewLines, selectCatalog],
  (lines, catalog) => {
    let subtotal = 0;
    let compareTotal = 0;
    for (const { variant, quantity } of lines) {
      subtotal += variantPrice(variant) * quantity;
      compareTotal += variantCompareAt(variant) * quantity;
    }
    const savings = compareTotal - subtotal;
    const months = catalog?.config.financingMonths ?? 12;
    const monthly = months > 0 ? subtotal / months : 0;
    return { subtotal, compareTotal, savings, monthly };
  },
);
