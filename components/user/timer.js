import { useEffect, useState } from "react";

export default function Timer({ timeLeft, setTimeLeft }) {
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return <span>{`${minutes}:${seconds.toString().padStart(2, "0")}`}</span>;
}
