interface BadgeProps {
  /** e.g. "Save 22%" */
  label: string;
  className?: string;
}

/** Discount pill shown at the top-left of a product image. */
const Badge = ({ label, className = '' }: BadgeProps) => (
  <span
    className={`inline-flex items-center justify-center rounded-[10px] bg-brand px-1.5 py-0.5 text-xs font-semibold text-white ${className}`}
  >
    {label}
  </span>
);

export default Badge;
