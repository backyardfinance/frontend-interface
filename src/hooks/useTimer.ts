import { useEffect, useState } from "react";

export const useTimer = (minutes: number) => {
  const [time, setTime] = useState(minutes * 60 * 1000);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(time - 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  return { time, minutes: Math.floor(time / 60000) | 0, seconds: Math.floor((time % 60000) / 1000) || "00" };
};
