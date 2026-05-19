import { useState, useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

function useTimer() {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  function formatTime(sec) {
    const h = String(Math.floor(sec / 3600)).padStart(2, "0");
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  function reset() {
    setRunning(false);
    setSeconds(0);
  }

  return { seconds, running, setRunning, formatTime, reset };
}

// =====================
// JOB CARD
// =====================
function JobCard({ job }) {
  const [applied, setApplied] = useState(false);
  const daysLabel =
    job.postedDays === 1 ? "Өчигдөр" : `${job.postedDays} өдрийн өмнө`;

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col gap-2 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{job.icon || "💼"}</span>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm leading-tight">
              {job.title}
            </h3>
            <p className="text-xs text-gray-400">{job.company}</p>
          </div>
        </div>
        {job.postedDays <= 1 && (
          <span className="text-xs bg-blue-50 text-blue-600 font-medium px-2 py-0.5 rounded-full border border-blue-100">
            Шинэ
          </span>
        )}
      </div>

      <p className="text-blue-600 font-bold text-base">{job.price}</p>

      <div className="flex flex-wrap gap-2">
        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
          🕐 {job.time}
        </span>
        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
          📍 {job.location}
        </span>
        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
          🗓 {daysLabel}
        </span>
      </div>

      <p className="text-xs text-gray-400 border-t border-gray-50 pt-2 leading-relaxed">
        {job.details}
      </p>

      <button
        onClick={() => setApplied(true)}
        disabled={applied}
        className={`mt-auto w-full py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
          applied
            ? "bg-green-50 text-green-600 border border-green-100 cursor-default"
            : "bg-blue-600 text-white hover:bg-blue-700 active:scale-95"
        }`}
      >
        {applied ? "✓ Өргөдөл илгээгдлээ" : "Өргөдөл гаргах"}
      </button>
    </div>
  );
}

// =====================
// STAT CARD
// =====================
function StatCard({ label, value, sub }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4">
      <p className="text-xs text-gray-400 mb-1">{label}</p>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

// =====================
// ANALYTICS TAB
// =====================
function AnalyticsTab({ analytics }) {
  const chart1Ref = useRef(null);
  const chart2Ref = useRef(null);
  const instance1 = useRef(null);
  const instance2 = useRef(null);

  useEffect(() => {
    if (!analytics) return;
    instance1.current?.destroy();
    instance2.current?.destroy();

    instance1.current = new Chart(chart1Ref.current, {
      type: "bar",
      data: {
        labels: analytics.weekly.labels,
        datasets: [
          {
            label: "Цаг",
            data: analytics.weekly.hours,
            backgroundColor: "#2563eb",
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Долоо хоногийн ажилласан цаг",
            font: { size: 13 },
            color: "#6b7280",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "rgba(0,0,0,0.04)" },
            ticks: { color: "#9ca3af" },
          },
          x: { grid: { display: false }, ticks: { color: "#9ca3af" } },
        },
      },
    });

    instance2.current = new Chart(chart2Ref.current, {
      type: "line",
      data: {
        labels: analytics.monthly.labels,
        datasets: [
          {
            label: "Орлого (₮)",
            data: analytics.monthly.income,
            borderColor: "#2563eb",
            backgroundColor: "rgba(37,99,235,0.08)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#2563eb",
            pointRadius: 5,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: "Сарын орлого",
            font: { size: 13 },
            color: "#6b7280",
          },
        },
        scales: {
          y: {
            beginAtZero: false,
            grid: { color: "rgba(0,0,0,0.04)" },
            ticks: { color: "#9ca3af" },
          },
          x: { grid: { display: false }, ticks: { color: "#9ca3af" } },
        },
      },
    });

    return () => {
      instance1.current?.destroy();
      instance2.current?.destroy();
    };
  }, [analytics]);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <canvas ref={chart1Ref} />
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-4">
        <canvas ref={chart2Ref} />
      </div>
    </div>
  );
}


function HistoryTab({ history }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50">
        <h2 className="font-semibold text-gray-800">Ажлын түүх</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wide">
              <th className="text-left px-5 py-3 font-medium">Ажил</th>
              <th className="text-left px-5 py-3 font-medium">Компани</th>
              <th className="text-left px-5 py-3 font-medium">Цаг</th>
              <th className="text-left px-5 py-3 font-medium">Орлого</th>
              <th className="text-left px-5 py-3 font-medium">Огноо</th>
              <th className="text-left px-5 py-3 font-medium">Төлөв</th>
            </tr>
          </thead>
          <tbody>
            {history.map((row, i) => (
              <tr
                key={row.id}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}
              >
                <td className="px-5 py-3 font-medium text-gray-800">{row.title}</td>
                <td className="px-5 py-3 text-gray-500">{row.company}</td>
                <td className="px-5 py-3 text-gray-500">
                  {row.hours ? `${row.hours} ц` : "—"}
                </td>
                <td className="px-5 py-3 font-semibold text-blue-600">{row.income}</td>
                <td className="px-5 py-3 text-gray-400 text-xs">{row.date}</td>
                <td className="px-5 py-3">
                  <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full border border-green-100">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const navItems = [
  { key: "available", label: "Нүүр", icon: "🏠" },
  { key: "history", label: "Ажлууд", icon: "💼" },
  { key: "analytics", label: "Тайлан", icon: "📊" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("available");
  const { seconds, running, setRunning, formatTime, reset } = useTimer();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    // ✅ Хоёр API-г зэрэг дуудна — http://localhost:5000 хэрэггүй, proxy ажиллана
    Promise.all([
      fetch("/api/jobs").then((res) => {
        if (!res.ok) throw new Error("Ажлын мэдээлэл татахад алдаа гарлаа");
        return res.json();
      }),
      fetch("/api/dashboard", { headers }).then((res) => {
        if (!res.ok) throw new Error("Dashboard мэдээлэл татахад алдаа гарлаа");
        return res.json();
      }),
    ])
      .then(([jobs, dashboard]) => {
        setData({ jobs, ...dashboard });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Ачааллаж байна...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-2">⚠️ {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs text-blue-600 underline"
          >
            Дахин оролдох
          </button>
        </div>
      </div>
    );
  }

  const { jobs, history, stats, analytics } = data;

  // localStorage-с хэрэглэгчийн нэр авах
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = user.name || "Хэрэглэгч";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div className="flex bg-gray-50 min-h-screen font-sans">
      {/* ---- SIDEBAR ---- */}
      <aside className="w-60 bg-white min-h-screen flex flex-col border-r border-gray-100 px-4 py-6 sticky top-0 h-screen">
        <div className="flex items-center gap-2 px-2 mb-8">
          <span className="text-2xl">⏰</span>
          <span className="font-bold text-gray-900 text-base">Цагийн ажил</span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-left transition-all duration-150 ${
                activeTab === item.key
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-gray-100 pt-4 mt-4">
          <div className="flex items-center gap-3 px-3 py-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {userInitial}
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-800">{userName}</p>
              <p className="text-xs text-gray-400">{stats.rating} ⭐ үнэлгээ</p>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              window.location.href = "/";
            }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
          >
            🚪 Гарах
          </button>
        </div>
      </aside>

      {/* ---- MAIN ---- */}
      <main className="flex-1 p-6 max-w-5xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Сайн байна уу, {userName} 👋
        </h1>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard label="Нийт цаг" value={`${stats.totalHours} ц`} sub="Энэ сар" />
          <StatCard label="Орлого" value={stats.totalIncome} sub="+12% өнгөрсөн сараас" />
          <StatCard label="Гүйцэтгэсэн" value={`${stats.totalJobs} ажил`} />
          <StatCard label="Үнэлгээ" value={`${stats.rating} ⭐`} sub={`${stats.reviewCount} сэтгэгдэл`} />
        </div>

        {/* TIMER */}
        <div className="bg-blue-600 rounded-2xl p-6 mb-6 flex flex-col items-center gap-4">
          <p className="text-blue-200 text-xs uppercase tracking-widest">
            Цагийн тоолуур
          </p>
          <div className="text-5xl font-bold text-white tracking-widest tabular-nums">
            {formatTime(seconds)}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setRunning(!running)}
              className="bg-white text-blue-600 px-6 py-2 rounded-xl text-sm font-semibold hover:bg-blue-50 active:scale-95 transition-all"
            >
              {running ? "⏸ Зогсоох" : "▶ Эхлүүлэх"}
            </button>
            <button
              onClick={reset}
              className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-400 active:scale-95 transition-all"
            >
              ↺ Дахин
            </button>
          </div>
        </div>

        {/* TABS */}
        {activeTab === "available" && (
          <div>
            <p className="text-sm font-semibold text-gray-500 mb-3">
              Боломжит ажлууд ({jobs.length})
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "history" && <HistoryTab history={history} />}

        {activeTab === "analytics" && <AnalyticsTab analytics={analytics} />}
      </main>
    </div>
  );
}