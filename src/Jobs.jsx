import { useState, useEffect } from "react";

const LOCATIONS = ["Бүгд", "Хан-уул", "ХУД", "БЗД", "ЧД", "СБД", "БГД", "СХД"];

export default function Jobs() {
  const [jobs, setJobs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [location, setLocation] = useState("Бүгд");
  const [sort, setSort]       = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (location && location !== "Бүгд") params.append("location", location);
    if (sort) params.append("sort", sort);

    fetch(`/api/jobs?${params.toString()}`)
      .then(r => r.json())
      .then(d => setJobs(Array.isArray(d) ? d : []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [search, location, sort]);

  return (
    <div style={{ fontFamily: "'Noto Sans', 'Segoe UI', sans-serif", minHeight: "100vh", background: "#f0f2f8" }}>

      {/* ── Header ── */}
      <div style={{
        background: "#12122a",
        padding: "28px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: 0.5 }}>
            🏙️ Цагын Ажил
          </h1>
          <p style={{ margin: "4px 0 0", color: "#7b82a8", fontSize: 13 }}>
            Нийт <strong style={{ color: "#a89cff" }}>{jobs.length}</strong> ажлын зар
          </p>
        </div>
      </div>

      {/* ── Filters ── */}
      <div style={{
        background: "#fff",
        padding: "14px 40px",
        display: "flex", gap: 10, flexWrap: "wrap",
        borderBottom: "1px solid #e8eaf0",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)"
      }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Ажил хайх..."
          style={{
            flex: 1, minWidth: 180, padding: "10px 16px",
            border: "1.5px solid #e0e3ef", borderRadius: 10,
            fontSize: 14, outline: "none", background: "#f7f8fa", color: "#12122a"
          }}
        />
        <select
          value={location}
          onChange={e => setLocation(e.target.value)}
          style={selectStyle}
        >
          {LOCATIONS.map(l => <option key={l}>{l}</option>)}
        </select>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          style={selectStyle}
        >
          <option value="">🕐 Шинэ эхэнд</option>
          <option value="price-high">💰 Үнэ: өндрөөс</option>
          <option value="price-low">💰 Үнэ: багаас</option>
        </select>
      </div>

      {/* ── Grid ── */}
      <div style={{ padding: "28px 40px", maxWidth: 1280, margin: "0 auto" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: 80, color: "#aaa" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
            <p style={{ margin: 0 }}>Уншиж байна...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div style={{ textAlign: "center", padding: 80, color: "#bbb" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🔍</div>
            <p style={{ margin: 0, fontSize: 15 }}>Ажил олдсонгүй</p>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: 20
          }}>
            {jobs.map(job => (
              <JobCard key={job._id || job.id} job={job} onView={() => setSelected(job)} />
            ))}
          </div>
        )}
      </div>

      {/* ── Detail Modal ── */}
      {selected && <JobModal job={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  JOB CARD — зөвхөн харах, засах/устгах байхгүй
// ══════════════════════════════════════════════════════════════
function JobCard({ job, onView }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "20px",
        boxShadow: hovered ? "0 8px 28px rgba(108,99,255,0.14)" : "0 2px 12px rgba(0,0,0,0.06)",
        border: hovered ? "1.5px solid #a89cff" : "1.5px solid #eef0f8",
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.18s ease",
        display: "flex", flexDirection: "column", cursor: "default"
      }}
    >
      {/* Title + price */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#12122a", lineHeight: 1.35, flex: 1 }}>
          {job.title}
        </h3>
        <span style={{
          background: "#f0eeff", color: "#6c63ff",
          fontSize: 11, fontWeight: 800,
          padding: "4px 10px", borderRadius: 20,
          whiteSpace: "nowrap", flexShrink: 0
        }}>
          {job.price}
        </span>
      </div>

      {/* Company */}
      <p style={{ margin: "8px 0 0", color: "#9196b0", fontSize: 13 }}>🏢 {job.company}</p>

      {/* Tags */}
      <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
        <Chip>📍 {job.location}</Chip>
        <Chip>🕐 {job.time}</Chip>
        <Chip yellow>📅 {job.postedDays} өдрийн өмнө</Chip>
      </div>

      {/* Description preview */}
      <p style={{
        margin: "12px 0 0", color: "#7b82a8", fontSize: 13, lineHeight: 1.6, flex: 1,
        overflow: "hidden", textOverflow: "ellipsis",
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical"
      }}>
        {job.details}
      </p>

      {/* View button */}
      <button
        onClick={onView}
        style={{
          marginTop: 16, width: "100%", padding: "11px",
          background: hovered
            ? "linear-gradient(135deg, #6c63ff, #8b5cf6)"
            : "#f4f4ff",
          color: hovered ? "#fff" : "#6c63ff",
          border: "none", borderRadius: 10,
          fontSize: 14, fontWeight: 700, cursor: "pointer",
          transition: "all 0.18s ease"
        }}
      >
        Дэлгэрэнгүй харах →
      </button>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  JOB DETAIL MODAL — зөвхөн харах
// ══════════════════════════════════════════════════════════════
function JobModal({ job, onClose }) {
  // ESC товчоор хаах
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000, padding: 20
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 22,
          width: "100%", maxWidth: 520,
          boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
          overflow: "hidden"
        }}
      >
        {/* Modal header */}
        <div style={{
          background: "linear-gradient(135deg, #6c63ff, #8b5cf6)",
          padding: "28px 28px 24px",
          position: "relative"
        }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 16, right: 16,
              background: "rgba(255,255,255,0.2)", border: "none",
              borderRadius: "50%", width: 34, height: 34,
              color: "#fff", fontSize: 16, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}
          >✕</button>

          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fff", paddingRight: 40 }}>
            {job.title}
          </h2>
          <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.8)", fontSize: 14, fontWeight: 500 }}>
            🏢 {job.company}
          </p>

          {/* Price badge */}
          <div style={{
            display: "inline-block", marginTop: 14,
            background: "rgba(255,255,255,0.2)",
            color: "#fff", fontWeight: 800, fontSize: 18,
            padding: "8px 20px", borderRadius: 12
          }}>
            💰 {job.price}
          </div>
        </div>

        {/* Modal body */}
        <div style={{ padding: "24px 28px 28px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <InfoRow icon="📍" label="Байршил" value={job.location} />
            <InfoRow icon="🕐" label="Цаг хугацаа" value={job.time} />
            <InfoRow icon="📅" label="Нийтлэсэн" value={`${job.postedDays} өдрийн өмнө`} last />
          </div>

          {/* Details */}
          <div style={{
            marginTop: 20, background: "#f7f8fa",
            borderRadius: 14, padding: "16px 18px"
          }}>
            <p style={{ margin: "0 0 8px", fontWeight: 700, color: "#12122a", fontSize: 14 }}>
              📋 Ажлын тайлбар
            </p>
            <p style={{ margin: 0, color: "#555", lineHeight: 1.7, fontSize: 14 }}>
              {job.details}
            </p>
          </div>

          {/* ESC hint */}
          <p style={{ margin: "16px 0 0", textAlign: "center", color: "#ccc", fontSize: 12 }}>
            ESC дарж эсвэл гадна дарж хаана
          </p>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════════
function Chip({ children, yellow }) {
  return (
    <span style={{
      background: yellow ? "#fff8e6" : "#f4f6fb",
      color: yellow ? "#b07d00" : "#6b7280",
      fontSize: 11, padding: "4px 10px", borderRadius: 20, fontWeight: 500
    }}>
      {children}
    </span>
  );
}

function InfoRow({ icon, label, value, last }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 0",
      borderBottom: last ? "none" : "1px solid #f0f2f8"
    }}>
      <div style={{
        width: 36, height: 36, background: "#f4f6fb",
        borderRadius: 10, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 16, flexShrink: 0
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 11, color: "#aeb4cc", fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#12122a", marginTop: 2 }}>{value}</div>
      </div>
    </div>
  );
}

const selectStyle = {
  padding: "10px 14px",
  border: "1.5px solid #e0e3ef",
  borderRadius: 10, fontSize: 14,
  background: "#f7f8fa", outline: "none",
  color: "#12122a", cursor: "pointer"
};