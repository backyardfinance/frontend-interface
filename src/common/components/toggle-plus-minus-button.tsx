import { MinusIcon } from "lucide-react";
import PlusIcon from "@/icons/plus-thick.svg?react";

type TogglePlusMinusButtonProps = {
  isAdded: boolean;
  handleToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

export const TogglePlusMinusButton = ({ isAdded, handleToggle }: TogglePlusMinusButtonProps) => {
  return (
    <button
      className="group flex min-h-[27px] min-w-[27px] cursor-pointer items-center justify-center border-none bg-transparent p-0"
      onClick={handleToggle}
      type="button"
    >
      {!isAdded ? (
        <PlusIcon className="h-3.5 w-3.5 transition-all duration-300 ease-in-out group-hover:scale-150" />
      ) : (
        <MinusIcon
          className="h-3.5 w-3.5 transition-all duration-300 ease-in-out group-hover:scale-150"
          stroke="#979797"
        />
      )}
    </button>
  );
};
