import { useState, useEffect } from "react";
import Chart from "chart.js/auto";

export default function Dashboard() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState("available");

  // TIMER
  useEffect(() => {
    let interval;

    if (running) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [running]);

  function formatTime(sec) {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  // CHARTS
  useEffect(() => {
    const ctx1 = document.getElementById("chart1");
    const ctx2 = document.getElementById("chart2");

    if (!ctx1 || !ctx2) return;

    const chart1 = new Chart(ctx1, {
      type: "bar",
      data: {
        labels: ["Даваа", "Мягмар", "Лхагва", "Пүрэв"],
        datasets: [{ data: [6, 8, 7, 9] }],
      },
    });

    const chart2 = new Chart(ctx2, {
      type: "line",
      data: {
        labels: ["1-р сар", "2-р сар", "3-р сар"],
        datasets: [{ data: [450000, 520000, 680000] }],
      },
    });

    return () => {
      chart1.destroy();
      chart2.destroy();
    };
  }, []);

  return (
    <div className="flex bg-gray-50 min-h-screen">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white h-screen p-6 hidden lg:block border-r relative">
        <h1 className="text-2xl font-bold mb-8">⏰ Цагийн ажил</h1>

        <nav className="space-y-3">
          <button onClick={() => setActiveTab("available")} className="block w-full text-left">
            🏠 Нүүр
          </button>
          <button onClick={() => setActiveTab("history")} className="block w-full text-left">
            💼 Ажлууд
          </button>
          <button onClick={() => setActiveTab("analytics")} className="block w-full text-left">
            📊 Тайлан
          </button>
        </nav>

        <a href="/" className="absolute bottom-6 text-red-500">
          🚪 Гарах
        </a>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6">

        <h1 className="text-3xl font-bold mb-6">Сайн байна уу 👋</h1>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 rounded shadow">156 цаг</div>
          <div className="p-4 rounded shadow">1,248,000₮</div>
          <div className="p-4 rounded shadow">23 ажил</div>
          <div className="p-4 rounded shadow">4.8 ⭐</div>
        </div>

        {/* TIMER */}
        <div className="bg-blue-600 text-white p-6 rounded mb-6 text-center">
          <div className="text-5xl mb-4">{formatTime(seconds)}</div>

          <button
            onClick={() => setRunning(!running)}
            className="bg-white text-blue-600 px-4 py-2 rounded"
          >
            ▶ Start / Stop
          </button>
        </div>

        {/* TABS */}
        {activeTab === "available" && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold">Нохой салхилуулах</h3>
              <p>10,000₮/цаг</p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold">Хүүхэд харах</h3>
              <p>12,000₮/цаг</p>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold">Гэр цэвэрлэх</h3>
              <p>15,000₮</p>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Ажлын түүх</h2>

            <table className="w-full">
              <thead>
                <tr>
                  <th>Ажил</th>
                  <th>Орлого</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Нохой</td>
                  <td>20,000₮</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "analytics" && (
          <div>
            <canvas id="chart1"></canvas>
            <canvas id="chart2" className="mt-6"></canvas>
          </div>
        )}

      </main>
    </div>
  );
}