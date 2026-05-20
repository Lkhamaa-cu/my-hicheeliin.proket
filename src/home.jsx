import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// ── Floating animated blob background ──
function Blobs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
      <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-emerald-500/15 blur-[100px] animate-pulse [animation-delay:1.5s]" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[130px] animate-pulse [animation-delay:3s]" />
    </div>
  );
}

// ── Animated counter ──
function Counter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    started.current = false;
    setCount(0);
  }, [target]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current && target > 0) {
          started.current = true;
          let start = 0;
          const duration = 1800;
          const step = Math.ceil(target / (duration / 16));
          const timer = setInterval(() => {
            start = Math.min(start + step, target);
            setCount(start);
            if (start >= target) clearInterval(timer);
          }, 16);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ── Job icon mapper ──
const JOB_ICONS = {
  "нохой": "🐕", "муур": "🐱", "амьтан": "🐾",
  "цэвэр": "🧹", "шал": "🧽", "заал": "🏟️",
  "хүүхэд": "👶", "ахмад": "🧓", "настан": "👴",
  "хоол": "🍳", "түгээлт": "🚴", "хүргэлт": "🚗",
  "дэлгүүр": "🛒", "бараа": "📦", "агуулах": "🏭",
  "компьютер": "💻", "цахилгаан": "⚡", "засвар": "🔧",
  "нүүлгэх": "📦", "ачаа": "💪", "тавилга": "🪑",
  "фото": "📷", "зураг": "🎨", "хөгжим": "🎵",
  "хичээл": "📚", "ном": "📖", "машин": "🚗",
  "цас": "❄️", "цэцэг": "🌸", "бэлэг": "🎁",
};
function getJobIcon(title = "") {
  const lower = title.toLowerCase();
  for (const [kw, icon] of Object.entries(JOB_ICONS)) {
    if (lower.includes(kw)) return icon;
  }
  return "💼";
}

// ── Job Quick-View Drawer (home дотор харагдана) ──
function JobDrawer({ job, allJobs, onClose }) {
  const icon = getJobIcon(job.title);

  // Drawer нээлттэй байх үед body scroll хаах
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ESC товч
  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [onClose]);

  // Бусад санал болгох ажлууд (өөрийгөө хасч 4 харуулна)
  const related = allJobs.filter((j) => (j.id || j._id) !== (job.id || job._id)).slice(0, 4);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed right-0 top-0 h-full z-50 w-full max-w-md bg-[#0d1220] border-l border-white/10 shadow-2xl flex flex-col overflow-hidden animate-[slideIn_0.25s_ease]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <span className="text-2xl">{icon}</span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">

          {/* Title + badge */}
          <div>
            <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
              Нээлттэй
            </span>
            <h2 className="text-2xl font-black text-white mt-3 mb-1">{job.title}</h2>
            {job.company && (
              <p className="text-blue-400 font-semibold">{job.company}</p>
            )}
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            {job.price && (
              <div className="bg-white/5 border border-white/8 rounded-2xl p-4">
                <p className="text-xs text-gray-500 mb-1">Цалин</p>
                <p className="text-white font-bold">{job.price}</p>
              </div>
            )}
            {job.location && (
              <div className="bg-white/5 border border-white/8 rounded-2xl p-4">
                <p className="text-xs text-gray-500 mb-1">Байршил</p>
                <p className="text-white font-bold">📍 {job.location}</p>
              </div>
            )}
            {job.time && (
              <div className="bg-white/5 border border-white/8 rounded-2xl p-4">
                <p className="text-xs text-gray-500 mb-1">Цаг</p>
                <p className="text-white font-bold">🕐 {job.time}</p>
              </div>
            )}
            {job.postedDays !== undefined && (
              <div className="bg-white/5 border border-white/8 rounded-2xl p-4">
                <p className="text-xs text-gray-500 mb-1">Нийтэлсэн</p>
                <p className="text-white font-bold">{job.postedDays === 0 ? "Өнөөдөр" : `${job.postedDays} өдрийн өмнө`}</p>
              </div>
            )}
          </div>

          {/* Details */}
          {job.details && (
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Дэлгэрэнгүй</p>
              <p className="text-gray-300 text-sm leading-relaxed">{job.details}</p>
            </div>
          )}

          {/* Apply button */}
          <Link
            to={`/jobs/${job.id || job._id}`}
            className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-0.5"
            onClick={onClose}
          >
            Дэлгэрэнгүй харах →
          </Link>

          {/* Related jobs */}
          {related.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-semibold">Бусад ажлууд</p>
              <div className="space-y-2">
                {related.map((j) => (
                  <button
                    key={j.id || j._id}
                    onClick={() => {
                      // Drawer-ийг шинэ ажлаар солих — parent state-г шинэчлэх
                      onClose();
                      // 50ms delay-тэй дахин нээнэ (parent handles it)
                      setTimeout(() => window.__openJobDrawer?.(j), 50);
                    }}
                    className="w-full flex items-center gap-3 bg-white/[0.03] hover:bg-white/[0.07] border border-white/8 rounded-xl px-4 py-3 text-left transition group"
                  >
                    <span className="text-xl">{getJobIcon(j.title)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{j.title}</p>
                      <p className="text-xs text-gray-500">{j.location}</p>
                    </div>
                    <span className="text-xs text-blue-400 font-bold whitespace-nowrap">{j.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to   { transform: translateX(0); }
        }
      `}</style>
    </>
  );
}

// ── Job card for homepage ──
function JobPill({ job, onOpen, delay }) {
  const icon = getJobIcon(job.title);
  return (
    <div
      onClick={() => onOpen(job)}
      className="group relative bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
          Нээлттэй
        </span>
      </div>
      <h3 className="font-semibold text-white text-sm mb-1 truncate">{job.title}</h3>
      <p className="text-blue-400 font-bold text-base">{job.price}</p>
      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
        <span>📍</span> {job.location}
      </div>
      <div className="absolute inset-0 rounded-2xl ring-1 ring-blue-500/0 group-hover:ring-blue-500/30 transition-all duration-300 pointer-events-none" />
    </div>
  );
}

// ── Feature card ──
function FeatureCard({ icon, title, desc, accent }) {
  return (
    <div className="relative bg-white/[0.03] border border-white/8 rounded-3xl p-7 hover:bg-white/[0.06] transition-all duration-300 group overflow-hidden">
      <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${accent}`} />
      <div className="relative">
        <div className="text-3xl mb-4">{icon}</div>
        <h3 className="font-bold text-white text-base mb-2">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

const features = [
  { icon: "⚡", title: "Хурдан бүртгэл",        desc: "1 минутын дотор эхэлж, шууд ажил хайж болно. Баримт бичиг шаардахгүй.", accent: "bg-yellow-400" },
  { icon: "📍", title: "Байршилд тулгуурласан",  desc: "Танд ойролцоо байгаа ажлуудыг автоматаар харуулна. Цаг алдахгүй.",      accent: "bg-blue-500" },
  { icon: "💸", title: "Цаг тутмын орлого",       desc: "Ажил дуусмагц шууд тооцоо хийж, тантай торгуулгагүй шилжүүлнэ.",       accent: "bg-emerald-500" },
  { icon: "🛡️", title: "Найдвартай баталгаа",    desc: "Бүх ажил олгогч баталгаажсан. Таны аюулгүй байдал манай эрэмбэ нэг.",  accent: "bg-purple-500" },
];

const STAT_KEYS = [
  { key: "totalWorkers",   suffix: "+", label: "Ажил хайгч" },
  { key: "totalEmployers", suffix: "+", label: "Ажил олгогч" },
  { key: "totalJobs",      suffix: "+", label: "Нийт ажил" },
  { key: "satisfaction",   suffix: "%", label: "Сэтгэл ханамж" },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  const [stats, setStats] = useState({ totalWorkers: 0, totalEmployers: 0, totalJobs: 0, satisfaction: 98 });
  const [statsLoaded, setStatsLoaded] = useState(false);

  const [allJobs,     setAllJobs]     = useState([]);
  const [previewJobs, setPreviewJobs] = useState([]);
  const [jobsLoaded,  setJobsLoaded]  = useState(false);

  // Quick-view drawer
  const [activeJob, setActiveJob] = useState(null);

  // Global hook — related jobs дотроос drawer нээхэд ашиглана
  useEffect(() => {
    window.__openJobDrawer = (job) => setActiveJob(job);
    return () => { delete window.__openJobDrawer; };
  }, []);

  useEffect(() => {
    fetch("/api/stats")
      .then(r => r.json())
      .then(data => {
        if (data && !data.error) {
          setStats({
            totalWorkers:   data.totalWorkers   ?? 0,
            totalEmployers: data.totalEmployers ?? 0,
            totalJobs:      data.totalJobs      ?? 0,
            satisfaction:   data.satisfaction   ?? 98,
          });
        }
        setStatsLoaded(true);
      })
      .catch(() => {
        setStats({ totalWorkers: 0, totalEmployers: 0, totalJobs: 31, satisfaction: 98 });
        setStatsLoaded(true);
      });

    fetch("/api/jobs")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setAllJobs(data);
          setPreviewJobs(data.slice(0, 8));
        }
        setJobsLoaded(true);
      })
      .catch(() => setJobsLoaded(true));
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-screen bg-[#080c14] text-white font-sans selection:bg-blue-600/40">

      {/* ── Quick-view Drawer ── */}
      {activeJob && (
        <JobDrawer
          job={activeJob}
          allJobs={allJobs}
          onClose={() => setActiveJob(null)}
        />
      )}

      {/* ── HEADER ── */}
      <header className={`fixed top-0 inset-x-0 z-30 transition-all duration-300 ${scrolled ? "bg-[#080c14]/90 backdrop-blur-xl border-b border-white/8 shadow-xl" : "bg-transparent"}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
            <span className="text-2xl">⏰</span>
            <span className="text-white">Worker</span>
            <span className="text-blue-400">.mn</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition">Онцлог</a>
            <a href="#jobs"     className="hover:text-white transition">Ажлууд</a>
            <a href="#stats"    className="hover:text-white transition">Статистик</a>
            <a href="#about"    className="hover:text-white transition">Тухай</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login"    className="text-sm font-medium text-gray-400 hover:text-white transition px-4 py-2">Нэвтрэх</Link>
            <Link to="/register" className="text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-xl transition shadow-lg shadow-blue-600/20">Бүртгүүлэх</Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <Blobs />
        <div className="relative max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-xs text-blue-400 font-semibold mb-8 tracking-wide">
              🇲🇳 Монголын #1 цагийн ажлын платформ
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
              Чөлөөт цагаа
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-emerald-400 bg-clip-text text-transparent">
                мөнгө болго
              </span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md">
              Цагийн ажил хайх, олгох хамгийн хурдан арга. Өнөөдөр бүртгүүлж, маргааш орлого ол.
            </p>
            <div className="flex flex-wrap gap-4 mb-12">
              <Link to="/register" className="group px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-2xl shadow-blue-600/30 hover:shadow-blue-500/40 transition-all duration-200 hover:-translate-y-1 flex items-center gap-2">
                Ажил хайх
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link to="/register?role=employer" className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all duration-200">
                Ажил зарлах
              </Link>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Бүртгэл үнэгүй</div>
              <div className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Шууд эхлэх</div>
              <div className="flex items-center gap-1.5"><span className="text-emerald-400">✓</span> Баталгаатай</div>
            </div>
          </div>

          {/* Right — floating UI mock */}
          <div className="relative hidden lg:block">
            <div className="relative w-full max-w-sm mx-auto">
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-white text-sm">Шинэ ажлууд</h3>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    {statsLoaded ? `${stats.totalJobs} нийт` : "..."}
                  </span>
                </div>
                {[
                  { icon: "🐕", title: "Нохой салхилуулах", price: "5,000₮/цаг", loc: "Хан-уул" },
                  { icon: "🧹", title: "Гэр цэвэрлэх",      price: "10,000₮/цаг", loc: "БЗД" },
                  { icon: "🚴", title: "Хоол хүргэлт",       price: "8,500₮/цаг",  loc: "ХУД" },
                ].map((j, i) => (
                  <div key={i} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
                    <span className="text-xl">{j.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{j.title}</p>
                      <p className="text-xs text-gray-500">{j.loc}</p>
                    </div>
                    <span className="text-xs font-bold text-blue-400 whitespace-nowrap">{j.price}</span>
                  </div>
                ))}
              </div>
              <div className="absolute -top-4 -right-4 bg-white/8 border border-white/10 rounded-2xl p-3 backdrop-blur-sm shadow-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-xs font-bold">Б</div>
                  <div>
                    <p className="text-xs font-semibold text-white">Болд</p>
                    <p className="text-xs text-gray-500">⭐ 4.9 үнэлгээ</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500">23 ажил гүйцэтгэсэн</p>
              </div>
              <div className="absolute top-20 left-2 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 backdrop-blur-sm animate-bounce [animation-duration:5s] [animation-delay:0.5s]">
                <p className="text-xs text-emerald-400 font-medium">✓ Ажил баталгаажлаа</p>
                <p className="text-xs text-gray-500 mt-0.5">Нохой салхилуулах</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-28 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-3">Яагаад Worker.mn</p>
            <h2 className="text-4xl md:text-5xl font-black text-white">
              Таны цагийг үнэлдэг<br />
              <span className="text-gray-500">платформ</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => <FeatureCard key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* ── JOBS PREVIEW ── */}
      <section id="jobs" className="py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-3">Шинэ ажлууд</p>
              <h2 className="text-4xl font-black text-white">Өнөөдөр нээлттэй</h2>
            </div>
            <Link to="/jobs" className="text-sm text-blue-400 hover:text-blue-300 transition flex items-center gap-1">
              Бүгдийг харах →
            </Link>
          </div>

          {!jobsLoaded ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 animate-pulse h-36" />
              ))}
            </div>
          ) : previewJobs.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {previewJobs.map((job, i) => (
                <JobPill
                  key={job.id || job._id || i}
                  job={job}
                  onOpen={setActiveJob}
                  delay={`${i * 80}ms`}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-16">Одоогоор ажил байхгүй байна.</p>
          )}
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="stats" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-emerald-900/10 pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-xs text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Бодит цагийн өгөгдөл
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
            {STAT_KEYS.map(({ key, suffix, label }) => (
              <div key={key} className="group">
                <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                  {statsLoaded
                    ? <Counter target={stats[key]} suffix={suffix} />
                    : <span className="opacity-30 animate-pulse">—</span>}
                </div>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-3">Хэрхэн ажилладаг</p>
          <h2 className="text-4xl font-black text-white mb-16">3 алхамд ажил олоорой</h2>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-gradient-to-r from-blue-500/50 via-blue-400/30 to-blue-500/50" />
            {[
              { step: "01", icon: "👤", title: "Бүртгүүл",  desc: "Нэр, утасны дугаараа оруулаад 60 секундэд бүртгэл дуусна" },
              { step: "02", icon: "🔍", title: "Ажил хай",  desc: "Байршил, цаг, орлогоор нь шүүж, тохирох ажлаа ол" },
              { step: "03", icon: "💰", title: "Орлого ав", desc: "Ажил дуусмагц тооцоо хийгдэж, орлого шууд шилжинэ" },
            ].map(({ step, icon, title, desc }, i) => (
              <div key={i} className="relative group">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mx-auto mb-6 group-hover:bg-blue-600/20 group-hover:border-blue-500/30 transition-all duration-300">
                  {icon}
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 text-xs font-bold text-blue-500/40 tracking-widest">{step}</div>
                <h3 className="font-bold text-white text-base mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="about" className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-transparent to-emerald-900/20 pointer-events-none" />
        <Blobs />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-xs text-emerald-400 font-medium mb-8">
            🚀 Өнөөдөр нэгдэх боломжтой
          </div>
          <h2 className="text-5xl font-black leading-tight text-white mb-6">
            Орлогоо нэмэгдүүлж<br />
            <span className="text-blue-400">эхлэх цаг нь боллоо</span>
          </h2>
          <p className="text-gray-400 text-base mb-10 max-w-md mx-auto leading-relaxed">
            {stats.totalJobs > 0
              ? `${stats.totalJobs}+ ажил таныг хүлээж байна. Өнөөдөр эхэл!`
              : "Манай платформ ашиглан орлогоо нэмэгдүүлж эхэл!"}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="group px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-2xl shadow-blue-600/30 hover:shadow-blue-500/40 transition-all duration-200 hover:-translate-y-1 flex items-center gap-2">
              Бүртгүүлэх
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link to="/login" className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all duration-200">
              Нэвтрэх
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/8 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 font-bold text-base">
            <span>⏰</span>
            <span className="text-white">Worker</span>
            <span className="text-blue-400">.mn</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-white transition">Онцлог</a>
            <a href="#jobs"     className="hover:text-white transition">Ажлууд</a>
            <a href="#about"    className="hover:text-white transition">Холбоо барих</a>
          </div>
          <p className="text-xs text-gray-700">© 2026 Worker.mn — Бүх эрх хамгаалагдсан</p>
        </div>
      </footer>
    </div>
  );
}