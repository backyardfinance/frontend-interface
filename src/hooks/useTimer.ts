import { useEffect, useState } from "react";

export const useTimer = (seconds: number) => {
  const [time, setTime] = useState(seconds * 1000);

  useEffect(() => {
    const interval = setInterval(() => {
      if (time > 0) {
        setTime(time - 1000);
      } else {
        setTime(seconds * 1000);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  const secondsValue = Math.floor((time % 60000) / 1000);

  return {
    time,
    minutes: Math.floor(time / 60000) | 0,
    seconds: secondsValue <= 9 ? `0${secondsValue}` : secondsValue || "00",
  };
};
