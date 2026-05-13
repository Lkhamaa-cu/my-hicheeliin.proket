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
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
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

// ── Job card for homepage ──
function JobPill({ title, pay, loc, icon, delay }) {
  return (
    <div
      className="group relative bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
          Нээлттэй
        </span>
      </div>
      <h3 className="font-semibold text-white text-sm mb-1">{title}</h3>
      <p className="text-blue-400 font-bold text-base">{pay}</p>
      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
        <span>📍</span> {loc}
      </div>
      <div className="absolute inset-0 rounded-2xl ring-1 ring-blue-500/0 group-hover:ring-blue-500/30 transition-all duration-300 pointer-events-none" />
    </div>
  );
}

// ── Feature card ──
function FeatureCard({ icon, title, desc, accent }) {
  return (
    <div className="relative bg-white/[0.03] border border-white/8 rounded-3xl p-7 hover:bg-white/[0.06] transition-all duration-300 group overflow-hidden">
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${accent}`}
      />
      <div className="relative">
        <div className="text-3xl mb-4">{icon}</div>
        <h3 className="font-bold text-white text-base mb-2">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

const jobs = [
  { title: "Нохой салхилуулах", pay: "5,000₮/цаг", loc: "Хан-уул", icon: "🐕" },
  { title: "Дэлгүүр туслах", pay: "7,000₮/цаг", loc: "Хороолол, ХУД", icon: "🛒" },
  { title: "Гэр цэвэрлэх", pay: "10,000₮/цаг", loc: "Баянзүрх", icon: "🧹" },
  { title: "Түгээлт хийх", pay: "8,000₮/цаг", loc: "Чингэлтэй", icon: "🚴" },
  { title: "Хүүхэд харах", pay: "12,000₮/цаг", loc: "Сүхбаатар", icon: "👶" },
  { title: "Тэргэнцэр ахмад", pay: "6,000₮/цаг", loc: "Баянгол", icon: "🧓" },
  { title: "Нохой харах", pay: "8,000₮/цаг", loc: "Чингэлтэй", icon: "🐾" },
  { title: "Жолоо туслах", pay: "9,000₮/цаг", loc: "СБД", icon: "🚗" },
];

const features = [
  { icon: "⚡", title: "Хурдан бүртгэл", desc: "1 минутын дотор эхэлж, шууд ажил хайж болно. Баримт бичиг шаардахгүй.", accent: "bg-yellow-400" },
  { icon: "📍", title: "Байршилд тулгуурласан", desc: "Танд ойролцоо байгаа ажлуудыг автоматаар харуулна. Цаг алдахгүй.", accent: "bg-blue-500" },
  { icon: "💸", title: "Цаг тутмын орлого", desc: "Ажил дуусмагц шууд тооцоо хийж, тантай торгуулгагүй шилжүүлнэ.", accent: "bg-emerald-500" },
  { icon: "🛡️", title: "Найдвартай баталгаа", desc: "Бүх ажил олгогч баталгаажсан. Таны аюулгүй байдал манай эрэмбэ нэг.", accent: "bg-purple-500" },
];

const stats = [
  { num: 1200, suffix: "+", label: "Ажил хайгч" },
  { num: 450, suffix: "+", label: "Ажил олгогч" },
  { num: 3500, suffix: "+", label: "Нийт ажил" },
  { num: 98, suffix: "%", label: "Сэтгэл ханамж" },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div className="min-h-screen bg-[#080c14] text-white font-sans selection:bg-blue-600/40">

      {/* ── HEADER ── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#080c14]/90 backdrop-blur-xl border-b border-white/8 shadow-xl"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
            <span className="text-2xl">⏰</span>
            <span className="text-white">Worker.</span>
            <span className="text-blue-400">mn</span>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition">Онцлог</a>
            <a href="jobs" className="hover:text-white transition">Ажлууд</a>
            <a href="#stats" className="hover:text-white transition">Статистик</a>
            <a href="#about" className="hover:text-white transition">Тухай</a>
          </nav>

          <div className="flex gap-3 items-center">
            <Link
              to="/login"
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition"
            >
              Нэвтрэх
            </Link>
            <Link
              to="/register"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition-all duration-200"
            >
              Бүртгүүлэх →
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <Blobs />

        {/* Grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-6 pt-28 pb-20 grid md:grid-cols-2 gap-16 items-center">
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 rounded-full px-4 py-1.5 text-xs text-blue-400 font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Монголын #1 цагийн ажлын платформ
            </div>

            <h1 className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight">
              <span className="text-white">Цагийн ажил</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-emerald-400 bg-clip-text text-transparent">
                хурдан, хялбар
              </span>
              <br />
              <span className="text-white">олоорой</span>
            </h1>

            <p className="mt-6 text-base text-gray-400 leading-relaxed max-w-md">
              Хурдан бүртгүүлж, байршилд тулгуурласан ажил олоод — өнөөдрөөсөө
              орлогоо нэмэгдүүл.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/login"
                className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 hover:shadow-blue-500/40 transition-all duration-200 hover:-translate-y-0.5"
              >
                Одоо эхлэх
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all duration-200"
              >
                Демо үзэх
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-10 flex items-center gap-6 text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Бүртгэл үнэгүй
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Баталгаажсан ажил
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-emerald-400">✓</span> Шууд орлого
              </span>
            </div>
          </div>

          {/* Hero visual — floating cards */}
          <div className="relative hidden md:block">
            <div className="relative w-full h-[480px]">
              {/* Main card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 bg-white/8 border border-white/12 rounded-3xl p-6 backdrop-blur-sm shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-xl">🐕</div>
                  <div>
                    <p className="text-sm font-semibold text-white">Нохой салхилуулах</p>
                    <p className="text-xs text-gray-500">Happy Pets • Хан-уул</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-blue-400 font-bold text-lg">5,000₮/цаг</span>
                  <span className="text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full">Шинэ</span>
                </div>
                <div className="mt-4 flex gap-2 text-xs text-gray-500">
                  <span className="bg-white/5 px-2 py-1 rounded-lg">🕐 14:00-16:00</span>
                  <span className="bg-white/5 px-2 py-1 rounded-lg">📍 Хан-уул</span>
                </div>
                <button className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition">
                  Өргөдөл гаргах
                </button>
              </div>

              {/* Floating mini-cards */}
              <div className="absolute top-8 right-4 bg-white/8 border border-white/12 rounded-2xl p-4 backdrop-blur-sm w-44 animate-bounce [animation-duration:3s]">
                <p className="text-xs text-gray-400 mb-1">Өнөөдрийн орлого</p>
                <p className="text-lg font-bold text-emerald-400">+45,000₮</p>
                <p className="text-xs text-gray-600 mt-0.5">↑ 12% өссөн</p>
              </div>

              <div className="absolute bottom-16 left-0 bg-white/8 border border-white/12 rounded-2xl p-4 backdrop-blur-sm w-48 animate-bounce [animation-duration:4s] [animation-delay:1s]">
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
              Таны цагийг үнэлдэг
              <br />
              <span className="text-gray-500">платформ</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── JOBS ── */}
      <section id="jobs" className="py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-3">Шинэ ажлууд</p>
              <h2 className="text-4xl font-black text-white">Өнөөдөр нээлттэй</h2>
            </div>
            <Link
              to="/dashboard"
              className="text-sm text-blue-400 hover:text-blue-300 transition flex items-center gap-1"
            >
              Бүгдийг харах →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {jobs.map((job, i) => (
              <JobPill key={i} {...job} delay={`${i * 80}ms`} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="stats" className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-transparent to-emerald-900/10 pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {stats.map(({ num, suffix, label }, i) => (
            <div key={i} className="group">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                <Counter target={num} suffix={suffix} />
              </div>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-28">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs text-blue-400 font-semibold uppercase tracking-widest mb-3">Хэрхэн ажилладаг</p>
          <h2 className="text-4xl font-black text-white mb-16">3 алхамд ажил олоорой</h2>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* connector line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-gradient-to-r from-blue-500/50 via-blue-400/30 to-blue-500/50" />

            {[
              { step: "01", icon: "👤", title: "Бүртгүүл", desc: "Нэр, утасны дугаараа оруулаад 60 секундэд бүртгэл дуусна" },
              { step: "02", icon: "🔍", title: "Ажил хай", desc: "Байршил, цаг, орлогоор нь шүүж, тохирох ажлаа ол" },
              { step: "03", icon: "💰", title: "Орлого ав", desc: "Ажил дуусмагц тооцоо хийгдэж, орлого шууд шилжинэ" },
            ].map(({ step, icon, title, desc }, i) => (
              <div key={i} className="relative group">
                <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl mx-auto mb-6 group-hover:bg-blue-600/20 group-hover:border-blue-500/30 transition-all duration-300">
                  {icon}
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3 text-xs font-bold text-blue-500/40 tracking-widest">
                  {step}
                </div>
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
            Орлогоо нэмэгдүүлж
            <br />
            <span className="text-blue-400">эхлэх цаг нь боллоо</span>
          </h2>
          <p className="text-gray-400 text-base mb-10 max-w-md mx-auto leading-relaxed">
            1200 гаруй хүн аль хэдийн манай платформ ашиглан орлогоо нэмэгдүүлж байна.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              className="group px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-2xl shadow-blue-600/30 hover:shadow-blue-500/40 transition-all duration-200 hover:-translate-y-1 flex items-center gap-2"
            >
              Үнэгүй бүртгүүлэх
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold transition-all duration-200"
            >
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
            <a href="#jobs" className="hover:text-white transition">Ажлууд</a>
            <a href="#about" className="hover:text-white transition">Холбоо барих</a>
          </div>

          <p className="text-xs text-gray-700">
            © 2026 Worker.mn — Бүх эрх хамгаалагдсан
          </p>
        </div>
      </footer>
    </div>
  );
}