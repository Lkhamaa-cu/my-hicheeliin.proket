import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 text-gray-800">

      {/* HEADER */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

          <div className="flex items-center gap-2 text-xl font-bold">
            ⏰ <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Цагын Ажил
            </span>
          </div>

          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#features" className="hover:text-blue-600 transition">Онцлог</a>
            <a href="#jobs" className="hover:text-blue-600 transition">Ажлууд</a>
            <a href="#about" className="hover:text-blue-600 transition">Бидний тухай</a>
          </nav>

          <div className="flex gap-3">
            <Link to="/login" className="px-4 py-2 rounded-lg hover:bg-gray-100 transition">
              Нэвтрэх
            </Link>

            <Link
              to="/register"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow-md transition"
            >
              Бүртгүүлэх
            </Link>
          </div>

        </div>
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">

        <div>
          <h1 className="text-5xl font-extrabold leading-tight">
            <span className="text-gray-900">Хялбар</span>{" "}
            <span className="text-blue-600">цагийн ажил</span> ол
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Хурдан бүртгүүлж, ойролцоох ажил олоод орлогоо нэмэгдүүл.
          </p>

          <div className="mt-8 flex gap-4">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:scale-105 transition shadow-lg"
            >
              Эхлэх
            </Link>

            <Link
              to="/dashboard"
              className="px-6 py-3 rounded-xl border hover:bg-gray-100 transition"
            >
              Танилцах
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-500 blur-3xl opacity-30 rounded-3xl"></div>

          <img
            src="https://images.unsplash.com/photo-1713947505775-4e3af92a4ee7"
            className="relative rounded-2xl shadow-2xl w-full hover:scale-[1.02] transition duration-300"
            alt="hero"
          />
        </div>

      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold mb-12">Яагаад бид гэж?</h2>

          <div className="grid md:grid-cols-4 gap-6">

            {[
              ["⏱", "Хурдан бүртгэл", "1 минутын дотор эхэл"],
              ["💼", "Олон боломж", "Өдөр бүр шинэ ажил"],
              ["📍", "Ойролцоо ажил", "Байршлаар хайна"],
              ["📊", "Статистик", "Орлогоо хянах"],
            ].map(([icon, title, desc], i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-xl transition border"
              >
                <div className="text-3xl">{icon}</div>
                <h3 className="font-semibold mt-3">{title}</h3>
                <p className="text-sm text-gray-500 mt-1">{desc}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* JOBS */}
      <section id="jobs" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold mb-12">Шинэ ажлууд</h2>

          <div className="grid md:grid-cols-4 gap-6">

            {[
              ["Нохой салхилуулах", "5,000₮/цаг", "СБД"],
              ["Дэлгүүр", "7,000₮/цаг", "ХУД"],
              ["Цэвэрлэгээ", "10,000₮/цаг", "БЗД"],
              ["Түгээлт", "8,000₮/цаг", "ЧД"],
            ].map(([title, pay, loc], i) => (
              <div
                key={i}
                className="p-5 bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
              >
                <h3 className="font-semibold">{title}</h3>
                <p className="text-blue-600 font-bold mt-2">{pay}</p>
                <p className="text-gray-500 text-sm mt-1">{loc}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 text-center gap-8">

          {[
            ["1200+", "Ажил хайгч"],
            ["450+", "Ажил олгогч"],
            ["3500+", "Ажил"],
            ["98%", "Сэтгэл ханамж"],
          ].map(([num, label], i) => (
            <div key={i}>
              <div className="text-4xl font-bold">{num}</div>
              <div className="text-sm opacity-80">{label}</div>
            </div>
          ))}

        </div>
      </section>

      {/* CTA */}
      <section id="about" className="py-24 text-center bg-white">
        <h2 className="text-4xl font-bold mb-6">
          Өнөөдөр эхэлж орлогоо нэмэгдүүл
        </h2>

        <Link
          to="/register"
          className="px-8 py-3 rounded-xl bg-blue-600 text-white hover:scale-105 transition shadow-lg"
        >
          Бүртгүүлэх
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="py-10 text-center text-sm text-gray-500 bg-gray-900 text-gray-400">
        © 2026 Цагийн Ажил — Бүх эрх хамгаалагдсан
      </footer>

    </div>
  );
}