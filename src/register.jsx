import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({
    role: "worker",
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm_password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm_password) {
      setError("Нууц үг таарахгүй байна");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Бүртгүүлэх үед алдаа гарлаа");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      window.location.href = "/dashboard";

    } catch (err) {
      setError("Сервертэй холбогдож чадсангүй");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 flex">

      {/* LEFT FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          <div className="flex justify-center gap-2 mb-8">
            ⏰ <span className="text-3xl font-bold">Цагын ажил</span>
          </div>

          <div className="bg-white shadow-xl rounded-xl p-6">

            <h2 className="text-3xl text-center font-bold mb-2">
              Бүртгүүлэх
            </h2>

            <p className="text-center text-gray-600 mb-6">
              Шинэ хэрэглэгч үүсгэнэ үү
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* ROLE */}
              <div>
                <p className="mb-2">Та хэн бэ?</p>
                <div className="grid grid-cols-2 gap-4">
                  <label className="border p-4 rounded text-center cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="worker"
                      checked={form.role === "worker"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    👤 Ажил хайгч
                  </label>
                  <label className="border p-4 rounded text-center cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="employer"
                      checked={form.role === "employer"}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    🏢 Ажил олгогч
                  </label>
                </div>
              </div>

              {/* NAME */}
              <div>
                <label>Нэр</label>
                <div className="relative">
                  <span className="absolute left-3 top-3">👤</span>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-10 h-12 border rounded px-3"
                    placeholder="Таны нэр"
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}
              <div>
                <label>Имэйл</label>
                <div className="relative">
                  <span className="absolute left-3 top-3">📧</span>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 h-12 border rounded px-3"
                    required
                  />
                </div>
              </div>

              {/* PHONE */}
              <div>
                <label>Утас</label>
                <div className="relative">
                  <span className="absolute left-3 top-3">📱</span>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full pl-10 h-12 border rounded px-3"
                    placeholder="99123456"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <label>Нууц үг</label>
                <div className="relative">
                  <span className="absolute left-3 top-3">🔒</span>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-10 h-12 border rounded px-3"
                    required
                  />
                </div>
              </div>

              {/* CONFIRM */}
              <div>
                <label>Нууц үг давтах</label>
                <div className="relative">
                  <span className="absolute left-3 top-3">🔒</span>
                  <input
                    type="password"
                    name="confirm_password"
                    value={form.confirm_password}
                    onChange={handleChange}
                    className="w-full pl-10 h-12 border rounded px-3"
                    required
                  />
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <p className="text-red-500 text-sm text-center bg-red-50 border border-red-100 p-2 rounded">
                  ⚠️ {error}
                </p>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white h-12 rounded disabled:opacity-60"
              >
                {loading ? "Түр хүлээнэ үү..." : "Бүртгүүлэх"}
              </button>

            </form>

            {/* OR */}
            <div className="my-6 text-center text-gray-400">эсвэл</div>

            <button className="w-full border h-12 rounded">
              Google-ээр бүртгүүлэх
            </button>

            <p className="text-center mt-6 text-gray-600">
              Аль хэдийн бүртгэлтэй юу?{" "}
              <a href="/login" className="text-blue-600 font-semibold">
                Нэвтрэх
              </a>
            </p>

            <p className="text-center mt-4">
              <a href="/" className="text-sm text-gray-500">
                ← Нүүр рүү буцах
              </a>
            </p>

          </div>
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1661626753732-f9f5dfd1fc16"
          className="object-cover w-full h-full"
          alt="register"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/60 to-transparent flex items-end p-12">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-4">Өөрийн цагаа удирд!</h2>
            <p className="text-xl text-purple-100">
              Цагийн ажил, орлого, цаг бүртгэл бүгд нэг дор
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}