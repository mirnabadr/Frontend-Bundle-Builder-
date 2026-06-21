interface NextButtonProps {
  label: string;
  onClick: () => void;
}

/** "Next: …" pill that advances the accordion to the following step. */
const NextButton = ({ label, onClick }: NextButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    // Figma: 1px #4E2FD2 border, 7px radius, 5px/24px padding, transparent fill
    // (so the panel colour shows through — not a white box) with purple bold text.
    className="mx-auto rounded-[7px] border border-brand bg-transparent px-[24px] py-[5px] text-lg font-semibold leading-6 text-brand transition-colors hover:bg-brand/5"
  >
    Next: {label}
  </button>
);

export default NextButton;
