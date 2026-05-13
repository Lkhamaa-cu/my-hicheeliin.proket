import { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Нэвтрэх үед алдаа гарлаа");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex">

      {/* LEFT IMAGE SECTION */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src="https://images.unsplash.com/photo-1768121496415-397a0a5daf8d"
          className="object-cover w-full h-full"
          alt="bg"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent flex items-end p-12">
          <div className="text-white">
            <h2 className="text-4xl font-bold mb-4">Тавтай морилно уу!</h2>
            <p className="text-xl text-blue-100">
              Цагийн ажлын платформд дахин тавтай морил
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* LOGO */}
          <div className="flex justify-center gap-2 mb-8">
            <span>⏰</span>
            <span className="text-3xl font-semibold">Цагын ажил</span>
          </div>

          <div className="bg-white shadow-xl rounded-xl p-6">

            <h2 className="text-3xl text-center font-semibold mb-2">
              Нэвтрэх
            </h2>

            <p className="text-center text-gray-600 mb-6">
              Өөрийн бүртгэлдээ нэвтэрнэ үү
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* EMAIL */}
              <div>
                <label className="block mb-1">Имэйл</label>
                <div className="relative">
                  <span className="absolute left-3 top-3">📧</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Бүртгэлтэй email хаягаа оруулна уу"
                    className="w-full pl-10 h-12 border rounded px-3"
                    required
                  />
                </div>
              </div>

              {/* PASSWORD */}
              <div>
                <div className="flex justify-between mb-1">
                  <label>Нууц үг</label>
                  <a href="#" className="text-sm text-blue-600">Мартсан?</a>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-3">🔒</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Нууц үгээ оруулна уу"
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
                {loading ? "Түр хүлээнэ үү..." : "Нэвтрэх"}
              </button>

            </form>

            {/* OR */}
            <div className="my-6 text-center text-gray-400">эсвэл</div>

            <button className="w-full border h-12 rounded mb-3">
              Google-ээр нэвтрэх
            </button>

            <button className="w-full border h-12 rounded">
              Facebook-ээр нэвтрэх
            </button>

            {/* REGISTER */}
            <p className="text-center mt-6 text-gray-600">
              Бүртгэлгүй юу?{" "}
              <a href="/register" className="text-blue-600 font-semibold">
                Бүртгүүлэх
              </a>
            </p>

            {/* BACK */}
            <p className="text-center mt-4">
              <a href="/" className="text-sm text-gray-500">
                ← Нүүр рүү буцах
              </a>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}