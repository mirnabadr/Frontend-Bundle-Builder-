/** Format a number as a USD price string, e.g. 27.98 -> "$27.98". */
export const formatMoney = (value: number): string =>
  `$${value.toFixed(2)}`;

/** Format a monthly price, e.g. 9.99 -> "$9.99/mo". */
export const formatMonthly = (value: number): string =>
  `${formatMoney(value)}/mo`;
