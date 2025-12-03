const inputRegex = /^\d*(?:\\[.])?\d*$/;

const escapeRegExp = (string: string): string => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const inputEnforcer = (value: string) => {
  const nextUserInput = value.replace(/,/g, ".");
  if (nextUserInput[0] === "." || nextUserInput[0] === ",") {
    return `0${nextUserInput}`;
  }
  if (nextUserInput === "" || inputRegex.test(escapeRegExp(nextUserInput))) {
    return nextUserInput;
  }
  return null;
};
