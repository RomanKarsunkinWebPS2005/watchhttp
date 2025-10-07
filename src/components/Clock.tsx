import { useEffect, useState, useRef } from "react";

type Props = {
  name?: string;
  offsetHours: number;
};

export default function Clock({ offsetHours }: Props) {
  const [nowMs, setNowMs] = useState<number>(Date.now());
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setNowMs(Date.now());

    function tick() {
      setNowMs(Date.now());
    }

    const msToNextSecond = 1000 - (Date.now() % 1000);
    const timeoutId = window.setTimeout(() => {
      tick();
      intervalRef.current = window.setInterval(tick, 1000);
    }, msToNextSecond);

    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [offsetHours]);

  const utcMs = nowMs;
  const targetMs = utcMs + offsetHours * 3600_000;
  const date = new Date(targetMs);

  const seconds = date.getUTCSeconds();
  const minutes = date.getUTCMinutes();
  const hours = date.getUTCHours();

  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6 + seconds * 0.1;
  const hourDeg = (hours % 12) * 30 + minutes * 0.5;

  return (
    <div className="clock-outer">
      <div className="clock">
        <div
          className="hand hour"
          style={{ transform: `rotate(${hourDeg}deg)` }}
          aria-hidden
        />
        <div
          className="hand minute"
          style={{ transform: `rotate(${minuteDeg}deg)` }}
          aria-hidden
        />
        <div
          className="hand second"
          style={{ transform: `rotate(${secondDeg}deg)` }}
          aria-hidden
        />
        <div className="center-dot" />
      </div>

      <div className="digital">
        {pad(hours)}:{pad(minutes)}:{pad(seconds)}
      </div>
    </div>
  );
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
