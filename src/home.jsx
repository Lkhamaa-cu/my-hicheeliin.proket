import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      {/* HEADER */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">

          <div className="flex items-center gap-2">
            ⏰ <span className="text-2xl font-bold text-gray-900">Цагын ажил</span>
          </div>

          <nav className="hidden md:flex gap-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600">Онцлог</a>
            <a href="jobs" className="text-gray-600 hover:text-blue-600">Ажлууд</a>
            <a href="#about" className="text-gray-600 hover:text-blue-600">Бидний тухай</a>
          </nav>

          <div className="flex gap-3">
            <Link to="/login" className="px-4 py-2 text-gray-700">
              Нэвтрэх
            </Link>

            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Бүртгүүлэх
            </Link>
          </div>

        </div>
      </header>

      {/* HERO */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">

          <div>
            <h1 className="text-5xl font-bold mb-6">
              Нэг удаагийн <span className="text-blue-600">цагийн ажил</span> хайх платформ
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              Цагийн ажлаа хялбар хайж олж, орлогоо удирдаарай
            </p>

            <div className="flex gap-4">
              <Link
                to="/register"
                className="bg-blue-600 text-white px-6 py-3 rounded"
              >
                Эхлэх
              </Link>

             
              <Link
              to="/dashboard"
              className="bg-gray-300 text-blue px-6 py-3 rounded"
              >
                Танилцах
              </Link>
            </div>
          </div>

          <img
            src="https://images.unsplash.com/photo-1713947505775-4e3af92a4ee7"
            className="rounded-2xl shadow-2xl w-full"
            alt="hero"
          />

        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-white py-20">
        <div className="container mx-auto px-4 text-center">

          <h2 className="text-4xl font-bold mb-10">Системийн онцлог</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            <div className="shadow p-6 rounded">
              <div className="text-3xl mb-3">⏱</div>
              <h3 className="font-bold">Цагийн бүртгэл</h3>
              <p className="text-gray-600">Автомат хэмжилт</p>
            </div>

            <div className="shadow p-6 rounded">
              <div className="text-3xl mb-3">💼</div>
              <h3 className="font-bold">Олон ажил</h3>
              <p className="text-gray-600">Янз бүрийн боломж</p>
            </div>

            <div className="shadow p-6 rounded">
              <div className="text-3xl mb-3">👥</div>
              <h3 className="font-bold">Хялбар удирдлага</h3>
              <p className="text-gray-600">Хурдан холболт</p>
            </div>

            <div className="shadow p-6 rounded">
              <div className="text-3xl mb-3">📈</div>
              <h3 className="font-bold">Статистик</h3>
              <p className="text-gray-600">Тайлан харах</p>
            </div>

          </div>
        </div>
      </section>

      {/* JOBS */}
      <section id="jobs" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">

          <h2 className="text-4xl font-bold mb-10">
            Сүүлд нэмэгдсэн ажлууд
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="shadow p-4 rounded">
              <h3 className="font-bold">Нохой салхилуулах</h3>
              <p className="text-blue-600 text-xl">5,000₮/цаг</p>
              <p>14:00 - 16:00</p>
              <p>СБД</p>
            </div>

            <div className="shadow p-4 rounded">
              <h3 className="font-bold">Дэлгүүр</h3>
              <p className="text-blue-600 text-xl">7,000₮/цаг</p>
              <p>09:00 - 18:00</p>
              <p>ХУД</p>
            </div>

            <div className="shadow p-4 rounded">
              <h3 className="font-bold">Цэвэрлэгээ</h3>
              <p className="text-blue-600 text-xl">10,000₮/цаг</p>
              <p>10:00 - 14:00</p>
              <p>БЗД</p>
            </div>

            <div className="shadow p-4 rounded">
              <h3 className="font-bold">Түгээлт</h3>
              <p className="text-blue-600 text-xl">8,000₮/цаг</p>
              <p>12:00 - 20:00</p>
              <p>ЧД</p>
            </div>

          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 bg-blue-600 text-white text-center">
        <div className="grid md:grid-cols-4 gap-8">

          <div>
            <div className="text-4xl">1200+</div>
            Ажил хайгч
          </div>

          <div>
            <div className="text-4xl">450+</div>
            Ажил олгогч
          </div>

          <div>
            <div className="text-4xl">3500+</div>
            Ажил
          </div>

          <div>
            <div className="text-4xl">98%</div>
            Сэтгэл ханамж
          </div>

        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">

        <h2 className="text-4xl font-bold mb-6">
          Өнөөдөр эхлэх үү?
        </h2>

        <Link
          to="/register"
          className="bg-white text-blue-600 px-6 py-3 rounded"
        >
          Бүртгүүлэх
        </Link>

      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 py-12 text-center">
        <p>© 2026 Цагын ажил</p>
      </footer>

    </div>
  );
}