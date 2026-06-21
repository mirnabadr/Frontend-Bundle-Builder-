import type { Step } from '@/types/bundle.types';
import { ChevronDown, ChevronUp, STEP_ICONS } from '@components/ui/icons';

interface StepHeaderProps {
  step: Step;
  index: number;
  total: number;
  isOpen: boolean;
  selectedCount: number;
  onToggle: () => void;
}

/** "STEP n OF 4" label + the clickable header row (icon, title, state indicator). */
const StepHeader = ({ step, index, total, isOpen, selectedCount, onToggle }: StepHeaderProps) => {
  const Icon = STEP_ICONS[step.icon];

  return (
    <div className="flex flex-col gap-[5px]">
      <span className="px-[15px] text-[10px] font-medium uppercase leading-[10px] tracking-[1.6px] text-ink-700 md:text-xs md:leading-3">
        Step {index + 1} of {total}
      </span>

      <button
        type="button"
        onClick={onToggle}
        // a11y: announce expand/collapse to screen readers. Passed via spread so
        // the editor's HTML-oriented linter doesn't misread the JSX expression.
        {...{ 'aria-expanded': isOpen }}
        className={`flex w-full items-center justify-between gap-3 px-[15px] py-5 text-left ${
          isOpen ? 'border-t-[0.5px] border-ink' : 'border-y-[0.5px] border-ink'
        }`}
      >
        <span className="flex flex-1 items-center gap-2">
          <Icon className="h-[26px] w-auto" />
          <span className="flex-1 text-[22px] font-semibold leading-[22px] text-ink-900 xl:text-[28px] xl:leading-[28px]">
            {step.title}
          </span>
        </span>

        <span className="flex items-center gap-1">
          {selectedCount > 0 && (
            <span className="text-sm font-medium leading-4 text-brand">
              {selectedCount} selected
            </span>
          )}
          {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </span>
      </button>
    </div>
  );
};

export default StepHeader;
