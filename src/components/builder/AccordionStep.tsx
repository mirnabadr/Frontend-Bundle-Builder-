import type { ReactNode } from 'react';

import type { Step, StepId } from '@/types/bundle.types';
import { selectOpenStepId, selectStepSelectedCount, setOpenStep } from '@store/slices/bundleSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';

import StepHeader from './StepHeader';
import NextButton from './NextButton';

interface AccordionStepProps {
  step: Step;
  index: number;
  total: number;
  /** Body content (product grid / plan card) shown when the step is open. */
  children: ReactNode;
}

const AccordionStep = ({ step, index, total, children }: AccordionStepProps) => {
  const dispatch = useAppDispatch();
  const openStepId = useAppSelector(selectOpenStepId);
  const selectedCount = useAppSelector(selectStepSelectedCount(step.id));
  const isOpen = openStepId === step.id;

  const header = (
    <StepHeader
      step={step}
      index={index}
      total={total}
      isOpen={isOpen}
      selectedCount={selectedCount}
      onToggle={() => dispatch(setOpenStep(step.id))}
    />
  );

  if (!isOpen) return header;

  return (
    <section className="rounded-card bg-panel pt-[15px]">
      {header}
      <div className="flex flex-col items-center gap-[15px] px-[15px] pb-5 pt-[15px]">
        {children}
        {step.nextLabel && (
          <NextButton
            label={step.nextLabel}
            onClick={() => dispatch(setOpenStep(nextStepId(step.id)))}
          />
        )}
      </div>
    </section>
  );
};

/** Resolve the step that "Next" advances to. */
const nextStepId = (current: StepId): StepId => {
  const order: StepId[] = ['cameras', 'plan', 'sensors', 'protection'];
  const idx = order.indexOf(current);
  return order[Math.min(idx + 1, order.length - 1)];
};

export default AccordionStep;
