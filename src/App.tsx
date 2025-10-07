import { useState } from "react";
import Clock from "./components/Clock";

type Watch = {
  id: string;
  name: string;
  offset: number;
};

export default function App() {
  const [name, setName] = useState("");
  const [offsetText, setOffsetText] = useState("");
  const [watches, setWatches] = useState<Watch[]>([]);

  function addWatch() {
    const parsed = parseFloat(offsetText.replace(",", "."));
    if (!name.trim()) {
      alert("Введите название");
      return;
    }
    if (Number.isNaN(parsed)) {
      alert("Временная зона должна быть числом (например 3, -5, 9.5)");
      return;
    }

    const id = cryptoRandomId();
    setWatches((s) => [...s, { id, name: name.trim(), offset: parsed }]);
    setName("");
    setOffsetText("");
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
            value={offsetText}
            onChange={(e) => setOffsetText(e.target.value)}
            placeholder="3 или -5 или 9.5"
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
            <Clock name={w.name} offsetHours={w.offset} />
          </div>
        ))}
      </div>
    </div>
  );
}

function cryptoRandomId() {
  return Math.random().toString(36).slice(2, 9);
}
