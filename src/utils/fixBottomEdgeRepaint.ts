/**
 * Workaround for a Chromium/macOS first-paint compositing bug.
 *
 * On first load in a maximised window, Chromium can render the web-contents
 * layer a few pixels shorter than the window. The uncovered strip along the
 * bottom of the viewport is then filled with the browser's *theme/frame* colour
 * (e.g. a lavender bar matching a custom Chrome theme's tab strip), painted on
 * top of nothing the page controls — so no CSS can cover it.
 *
 * The strip disappears on the next reflow/repaint: switching tabs and back,
 * resizing the window, or simply the reflow that happens when a web font
 * finishes loading. That last one is why Brave "fixes itself" ~1s in (it
 * reflows when the Poppins fallback arrives) while Chrome — with the font
 * already cached, so no reflow — keeps the strip until a manual tab switch.
 *
 * This reproduces that single repaint ourselves. We momentarily grow the
 * document by 1px and release it on the next frame, which forces a layout +
 * composite pass (the same thing the font reflow does) so the web-contents
 * layer is re-sized to the full window. It's visually imperceptible (the page
 * is already taller than the viewport, so nothing moves) and a harmless no-op
 * on browsers/platforms without the bug.
 *
 * Triggered at the moments the layer can be wrong: right after first paint,
 * after full load, and once web fonts are ready.
 */
export const fixBottomEdgeRepaint = (): void => {
  const repaint = () => {
    // (1) Force a re-layout: grow past the viewport for one frame, then restore.
    const { style } = document.body;
    style.minHeight = 'calc(100vh + 1px)';
    requestAnimationFrame(() => {
      style.minHeight = '';
      // (2) Force a re-composite of the scrolling layer (incl. the bottom edge)
      // with an imperceptible 1px scroll nudge.
      const y = window.scrollY;
      window.scrollTo(window.scrollX, y + 1);
      window.scrollTo(window.scrollX, y);
    });
  };

  requestAnimationFrame(repaint);
  window.addEventListener('load', () => requestAnimationFrame(repaint), { once: true });
  document.fonts?.ready.then(repaint).catch(() => {
    /* Font Loading API unavailable — the other triggers still run. */
  });
};
