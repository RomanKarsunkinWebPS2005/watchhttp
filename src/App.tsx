import { useEffect, useState } from "react";
import Clock from "./components/Clock";

type Watch = {
  id: string;
  name: string;
  offset: number;
};

export default function App() {
  const [name, setName] = useState("");
  const [offsetNum, setOffsetNum] = useState<number | "">("");
  const [watches, setWatches] = useState<Watch[]>([]);

  const [nowMs, setNowMs] = useState<number>(Date.now());

  useEffect(() => {
    const msToNextSecond = 1000 - (Date.now() % 1000);
    const timeoutId = window.setTimeout(() => {
      setNowMs(Date.now());
      const intervalId = window.setInterval(() => setNowMs(Date.now()), 1000);
      (window as any).__appClockInterval = intervalId;
    }, msToNextSecond);

    return () => {
      clearTimeout(timeoutId);
      const intervalId = (window as any).__appClockInterval;
      if (intervalId) {
        clearInterval(intervalId);
        (window as any).__appClockInterval = undefined;
      }
    };
  }, []);

  function addWatch() {
    if (!name.trim()) {
      alert("Введите название");
      return;
    }
    if (offsetNum === "" || Number.isNaN(offsetNum)) {
      alert("Введите смещение (число, например 3, -5 или 9.5)");
      return;
    }
    const id = Math.random().toString(36).slice(2, 9);
    setWatches((s) => [...s, { id, name: name.trim(), offset: Number(offsetNum) }]);
    setName("");
    setOffsetNum("");
  }

  function removeWatch(id: string) {
    setWatches((s) => s.filter((w) => w.id !== id));
  }

  return (
    <div className="app">
      <h1>Watches</h1>

      <div className="form">
        <label>
          Название
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Moscow"
          />
        </label>

        <label>
          Временная зона (часы от GMT)
          <input
            type="number"
            step="0.5"
            value={offsetNum === "" ? "" : offsetNum}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "") {
                setOffsetNum("");
                return;
              }
              const num = e.target.valueAsNumber;
              setOffsetNum(Number.isNaN(num) ? "" : num);
            }}
            placeholder="3 или -5 или 9.5"
            min={-12}
            max={14}
          />
        </label>

        <button onClick={addWatch} className="add-btn">
          Добавить
        </button>
      </div>

      <div className="watches">
        {watches.map((w) => (
          <div key={w.id} className="watch-card">
            <div className="watch-header">
              <strong>{w.name}</strong>
              <button className="remove" onClick={() => removeWatch(w.id)}>
                ✕
              </button>
            </div>
            <Clock nowMs={nowMs} offsetHours={w.offset} />
          </div>
        ))}
      </div>
    </div>
  );
}
