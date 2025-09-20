interface ToggleButtonProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ToggleButton({ isOpen, setIsOpen }: ToggleButtonProps) {
  return (
    <button className="btn-toggle" onClick={() => setIsOpen((prev) => !prev)}>
      {isOpen ? "–" : "+"}
    </button>
  );
}
