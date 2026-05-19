// src/api/jobApi.js
// Jobs.jsx-д  import { getJobs, deleteJob, updateJob } from './api/jobApi'  гэж ашиглана

const BASE = "http://localhost:5000/api";

/** Authorization header буцаана (token байвал) */
function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── GET /api/jobs ─────────────────────────────────────────────
/**
 * Бүх ажлын жагсаалт авах
 * @param {{ search?: string, location?: string, sort?: string }} params
 */
export async function getJobs(params = {}) {
  const query = new URLSearchParams();
  if (params.search)   query.set("search",   params.search);
  if (params.location) query.set("location", params.location);
  if (params.sort)     query.set("sort",     params.sort);

  const url = `${BASE}/jobs${query.toString() ? "?" + query : ""}`;
  const res = await fetch(url);

  if (!res.ok) throw new Error("Ажлын жагсаалт авахад алдаа гарлаа");
  return res.json();
}

// ── GET /api/jobs/:id ─────────────────────────────────────────
export async function getJobById(id) {
  const res = await fetch(`${BASE}/jobs/${id}`);
  if (!res.ok) throw new Error("Ажил олдсонгүй");
  return res.json();
}

// ── POST /api/jobs ────────────────────────────────────────────
export async function createJob(jobData) {
  const res = await fetch(`${BASE}/jobs`, {
    method:  "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body:    JSON.stringify(jobData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Ажил нэмэхэд алдаа гарлаа");
  }
  return res.json();
}

// ── PUT /api/jobs/:id ─────────────────────────────────────────
export async function updateJob(id, jobData) {
  const res = await fetch(`${BASE}/jobs/${id}`, {
    method:  "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body:    JSON.stringify(jobData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Ажил засахад алдаа гарлаа");
  }
  return res.json();
}

// ── DELETE /api/jobs/:id ──────────────────────────────────────
export async function deleteJob(id) {
  const res = await fetch(`${BASE}/jobs/${id}`, {
    method:  "DELETE",
    headers: { ...authHeader() },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Ажил устгахад алдаа гарлаа");
  }
  return res.json();
}