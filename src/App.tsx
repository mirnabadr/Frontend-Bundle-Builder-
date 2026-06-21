import { useEffect } from 'react';

import { useAppDispatch } from '@store/hooks';
import { catalogRefreshed } from '@store/slices/bundleSlice';
import { apiService } from '@services/api.service';

import Builder from '@components/builder/Builder';
import ReviewPanel from '@components/review/ReviewPanel';

const App = () => {
  const dispatch = useAppDispatch();

  // The store is already seeded synchronously from the bundled catalog (main.tsx),
  // restoring any saved system, so content paints on the first frame. Here we just
  // refresh the catalog from the API (the bonus backend) in the background —
  // without resetting the user's selections.
  useEffect(() => {
    let cancelled = false;
    apiService
      .getBundle()
      .then((catalog) => {
        if (!cancelled) dispatch(catalogRefreshed(catalog));
      })
      .catch(() => {
        /* Already rendering from the bundled catalog; ignore refresh errors. */
      });
    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return (
    <main className="mx-auto max-w-[1213px] px-4 py-8 md:py-12 xl:px-0">
      {/* "Let's get started!" appears only on phones (matches the iPhone frame). */}
      <h1 className="mb-6 text-center text-[32px] font-bold leading-[35px] text-ink md:hidden">
        Let&rsquo;s get started!
      </h1>

      {/*
        < lg : stacked (builder, then review below).
        lg   : side-by-side (builder + sticky review sidebar) — node 68.
        xl   : full-width single column, review below — node 70-14135.
      */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-[30px] xl:flex-col xl:gap-[13px]">
        <div className="w-full min-w-0 lg:flex-1 xl:w-full xl:flex-none">
          <Builder />
        </div>
        <div className="w-full lg:sticky lg:top-6 lg:w-[399px] lg:shrink-0 xl:static xl:w-full">
          <ReviewPanel />
        </div>
      </div>
    </main>
  );
};

export default App;
