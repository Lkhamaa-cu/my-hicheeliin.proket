// seed.js  —  db.json өгөгдлийг MongoDB-д нэг удаа оруулна
// Ажиллуулах: node seed.js

import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/tsagiin_ajil";

const jobSchema = new mongoose.Schema({
  title:      String,
  company:    String,
  price:      String,
  priceNum:   Number,
  time:       String,
  location:   String,
  postedDays: Number,
  details:    String,
  createdAt:  { type: Date, default: Date.now },
});

const Job = mongoose.model("Job", jobSchema);

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ MongoDB холбогдлоо");

  // Одоо байгаа ажлуудыг арилгана
  await Job.deleteMany({});
  console.log("🗑  Хуучин ажлуудыг устгалаа");

  // db.json уншина
  const raw = fs.readFileSync(path.join(__dirname, "db.json"), "utf-8");
  const { jobs } = JSON.parse(raw);

  // id талбарыг орхиод MongoDB _id ашиглана
  const toInsert = jobs.map(({ id, ...rest }) => rest);

  await Job.insertMany(toInsert);
  console.log(`✅ ${toInsert.length} ажил амжилттай оруулав`);

  await mongoose.disconnect();
  console.log("🔌 MongoDB салгагдлаа");
}

seed().catch((err) => {
  console.error("❌ Seed алдаа:", err);
  process.exit(1);
});