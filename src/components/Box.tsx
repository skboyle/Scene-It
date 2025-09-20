import { useState } from "react";
import { ToggleButton } from "./ToggleButton";

interface BoxProps {
  children: React.ReactNode;
}

export function Box({ children }: BoxProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <ToggleButton isOpen={isOpen} setIsOpen={setIsOpen} />
      {isOpen && children}
    </div>
  );
}
