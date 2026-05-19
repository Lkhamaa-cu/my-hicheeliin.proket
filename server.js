import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
const PORT = 5000;
const JWT_SECRET = process.env.JWT_SECRET || "worker_mn_secret_key_2026";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/tsagiin_ajil";

// ── Middleware ──────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── MongoDB холболт ─────────────────────────────────────────
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB холбогдлоо:", MONGO_URI))
  .catch((err) => console.error("❌ MongoDB алдаа:", err));

// ══════════════════════════════════════════════════════════════
//  SCHEMAS & MODELS
// ══════════════════════════════════════════════════════════════

// User Schema
const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  phone:     { type: String, default: "" },
  role:      { type: String, enum: ["worker", "employer"], default: "worker" },
  password:  { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// Job Schema
const jobSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  company:    { type: String },
  price:      { type: String },
  priceNum:   { type: Number, default: 0 },
  time:       { type: String },
  location:   { type: String },
  postedDays: { type: Number, default: 0 },
  details:    { type: String },
  postedBy:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt:  { type: Date, default: Date.now },
});

const Job = mongoose.model("Job", jobSchema);

// ── Auth Middleware ─────────────────────────────────────────
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token байхгүй байна" });
  }
  try {
    const token = header.split(" ")[1];
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token хүчингүй байна" });
  }
}

// ══════════════════════════════════════════════════════════════
//  AUTH ROUTES
// ══════════════════════════════════════════════════════════════

// POST /api/auth/register
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Нэр, имэйл, нууц үг шаардлагатай" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Энэ имэйл аль хэдийн бүртгэлтэй байна" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      phone: phone || "",
      role: role || "worker",
      password: hashedPassword,
    });

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...userObj } = newUser.toObject();
    res.status(201).json({ token, user: { ...userObj, id: userObj._id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// POST /api/auth/login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Имэйл болон нууц үг шаардлагатай" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Имэйл эсвэл нууц үг буруу байна" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Имэйл эсвэл нууц үг буруу байна" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const { password: _, ...userObj } = user.toObject();
    res.json({ token, user: { ...userObj, id: userObj._id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// GET /api/auth/me
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "Хэрэглэгч олдсонгүй" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ══════════════════════════════════════════════════════════════
//  JOBS ROUTES
// ══════════════════════════════════════════════════════════════

// GET /api/jobs — бүх ажлын жагсаалт (хайлт, байршил, эрэмбэ)
app.get("/api/jobs", async (req, res) => {
  try {
    const { search, location, sort } = req.query;

    // Хайлтын filter үүсгэх
    const filter = {};
    if (search) {
      const q = new RegExp(search, "i");
      filter.$or = [{ title: q }, { company: q }, { details: q }];
    }
    if (location) {
      filter.location = location;
    }

    // Эрэмбэлэх
    let sortOption = { createdAt: -1 }; // default: шинэ эхэнд
    if (sort === "price-high") sortOption = { priceNum: -1 };
    if (sort === "price-low")  sortOption = { priceNum: 1 };

    const jobs = await Job.find(filter).sort(sortOption);

    // _id → id болгох (frontend-тэй нийцүүлэх)
    const result = jobs.map((j) => ({ ...j.toObject(), id: j._id.toString() }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// GET /api/jobs/:id — нэг ажлын дэлгэрэнгүй
app.get("/api/jobs/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Ажил олдсонгүй" });
    res.json({ ...job.toObject(), id: job._id.toString() });
  } catch (err) {
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// POST /api/jobs — шинэ ажил нэмэх (нэвтэрсэн байх шаардлагатай)
app.post("/api/jobs", authMiddleware, async (req, res) => {
  try {
    const newJob = await Job.create({
      ...req.body,
      postedBy: req.user.id,
      postedDays: 0,
    });
    res.status(201).json({ ...newJob.toObject(), id: newJob._id.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// PUT /api/jobs/:id — ажил засах
app.put("/api/jobs/:id", authMiddleware, async (req, res) => {
  try {
    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Ажил олдсонгүй" });
    res.json({ ...updated.toObject(), id: updated._id.toString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// DELETE /api/jobs/:id — ажил устгах
app.delete("/api/jobs/:id", authMiddleware, async (req, res) => {
  try {
    const deleted = await Job.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Ажил олдсонгүй" });
    res.json({ success: true, message: "Ажил устгагдлаа" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Серверийн алдаа" });
  }
});

// ── Dashboard (хуурамч өгөгдөл — хожим бодит болгоно) ───────
app.get("/dashboard", authMiddleware, (req, res) => {
  res.json({
    stats: {
      totalHours: 48,
      totalIncome: "384,000₮",
      totalJobs: 12,
      rating: 4.9,
      reviewCount: 23,
    },
    history: [
      { id: 1, title: "Нохой салхилуулах", company: "Happy Pets", hours: 2, income: "10,000₮", date: "2026-05-10", status: "Дууссан" },
      { id: 2, title: "Дэлгүүрийн туслах", company: "Mini Market", hours: 8, income: "56,000₮", date: "2026-05-08", status: "Дууссан" },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server ажиллаж байна: http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api/jobs`);
});