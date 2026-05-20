import { useState, useEffect } from "react";

const API = "/api";

function getToken() { return localStorage.getItem("token"); }
function authHeader() {
  return { Authorization: `Bearer ${getToken()}`, "Content-Type": "application/json" };
}

// ══════════════════════════════════════════════════════════════
//  MAIN DASHBOARD
// ══════════════════════════════════════════════════════════════
export default function Dashboard() {
  const [user, setUser]           = useState(null);
  const [jobs, setJobs]           = useState([]);
  const [tab, setTab]             = useState("jobs"); // "jobs" | "profile"
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");

  const [editJob, setEditJob]           = useState(null);
  const [addModal, setAddModal]         = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ── Fetch user ──────────────────────────────────────────────
  useEffect(() => {
    if (!getToken()) { setError("Нэвтрээгүй байна"); setLoading(false); return; }
    fetch(`${API}/auth/me`, { headers: authHeader() })
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError("Нэвтрээгүй байна"); return; }
        setUser(data);
      })
      .catch(() => setError("Сервертэй холбогдож чадсангүй"))
      .finally(() => setLoading(false));
  }, []);

  // ── Fetch jobs ──────────────────────────────────────────────
  const fetchJobs = () =>
    fetch(`${API}/jobs`)
      .then(r => r.json())
      .then(d => setJobs(Array.isArray(d) ? d : []));

  useEffect(() => { fetchJobs(); }, []);

  // ── Delete ──────────────────────────────────────────────────
  const handleDelete = async (id) => {
    await fetch(`${API}/jobs/${id}`, { method: "DELETE", headers: authHeader() });
    setDeleteConfirm(null);
    fetchJobs();
  };

  // ── Split jobs: mine vs others ──────────────────────────────
  // postedBy нь ObjectId string эсвэл object байж болно → аль алиныг нь зохицуул
  const myId = user?._id?.toString() || user?.id?.toString() || "";

  const resolvePostedBy = (job) => {
    const pb = job.postedBy;
    if (!pb) return "";
    if (typeof pb === "string") return pb;
    if (typeof pb === "object") return pb._id?.toString() || pb.toString();
    return String(pb);
  };

  const myJobs    = jobs.filter(j => resolvePostedBy(j) === myId);
  const otherJobs = jobs.filter(j => resolvePostedBy(j) !== myId);

  // ────────────────────────────────────────────────────────────
  if (loading) return <Screen icon="⏳" text="Ачааллаж байна..." />;
  if (error)   return <ErrorScreen message={error} />;

  return (
    <div style={{
      fontFamily: "'Noto Sans', 'Segoe UI', sans-serif",
      minHeight: "100vh", background: "#f0f2f8", display: "flex"
    }}>

      {/* ════════ SIDEBAR ════════ */}
      <aside style={{
        width: 248, minWidth: 248,
        background: "#12122a",
        display: "flex", flexDirection: "column",
        padding: "0 0 24px", position: "sticky", top: 0, height: "100vh",
        boxShadow: "4px 0 24px rgba(0,0,0,0.12)"
      }}>
        {/* Logo */}
        <div style={{
          padding: "28px 24px 22px",
          borderBottom: "1px solid rgba(255,255,255,0.06)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 36, height: 36, background: "linear-gradient(135deg,#6c63ff,#8b5cf6)",
              borderRadius: 10, display: "flex", alignItems: "center",
              justifyContent: "center", fontSize: 18
            }}>🏙️</div>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 16, letterSpacing: 0.5 }}>
              Worker.mn
            </span>
          </div>
        </div>

        {/* Avatar card */}
        <div style={{ padding: "20px 24px 18px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar name={user?.name} size={46} />
            <div style={{ overflow: "hidden" }}>
              <div style={{
                color: "#fff", fontWeight: 700, fontSize: 14,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
              }}>
                {user?.name}
              </div>
              <div style={{
                color: "#7b82a8", fontSize: 11, marginTop: 2,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
              }}>
                {user?.email}
              </div>
              <RoleBadge role={user?.role} small />
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 0" }}>
          <SideTab active={tab === "jobs"}    icon="📋" label="Ажлын зарууд"  onClick={() => setTab("jobs")} />
          <SideTab active={tab === "profile"} icon="👤" label="Миний профайл" onClick={() => setTab("profile")} />
        </nav>

        {/* Logout */}
        <div style={{ padding: "0 16px" }}>
          <button
            onClick={() => { localStorage.removeItem("token"); window.location.href = "/"; }}
            style={{
              width: "100%", padding: "10px 14px",
              background: "rgba(239,68,68,0.1)", color: "#f87171",
              border: "1px solid rgba(239,68,68,0.18)", borderRadius: 10,
              fontSize: 13, cursor: "pointer", fontWeight: 600,
              display: "flex", alignItems: "center", gap: 8
            }}
          >
            🚪 Гарах
          </button>
        </div>
      </aside>

      {/* ════════ MAIN CONTENT ════════ */}
      <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto", minWidth: 0 }}>

        {/* ── JOBS TAB ── */}
        {tab === "jobs" && (
          <div>
            {/* My jobs header */}
            <div style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "flex-start", marginBottom: 20, flexWrap: "wrap", gap: 12
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#12122a" }}>
                  Миний нийтлэсэн зарууд
                </h2>
                <p style={{ margin: "4px 0 0", color: "#9196b0", fontSize: 13 }}>
                  {myJobs.length} зар нийтэлсэн байна
                </p>
              </div>
              <button
                onClick={() => setAddModal(true)}
                style={{
                  padding: "12px 22px",
                  background: "linear-gradient(135deg,#6c63ff,#8b5cf6)",
                  color: "#fff", border: "none", borderRadius: 12,
                  fontSize: 14, fontWeight: 700, cursor: "pointer",
                  boxShadow: "0 4px 18px rgba(108,99,255,0.35)",
                  display: "flex", alignItems: "center", gap: 6
                }}
              >
                ＋ Шинэ зар нэмэх
              </button>
            </div>

            {myJobs.length === 0
              ? <EmptyState text="Та одоогоор ямар нэгэн зар нийтлээгүй байна." />
              : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: 16, marginBottom: 40
                }}>
                  {myJobs.map(job => (
                    <JobCard
                      key={job._id || job.id}
                      job={job}
                      isOwner
                      onEdit={() => setEditJob(job)}
                      onDelete={() => setDeleteConfirm(job)}
                    />
                  ))}
                </div>
              )
            }

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "8px 0 28px" }}>
              <div style={{ flex: 1, height: 1, background: "#e2e5f0" }} />
              <span style={{ color: "#aeb4cc", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
                БУСАД ЗАРУУД ({otherJobs.length})
              </span>
              <div style={{ flex: 1, height: 1, background: "#e2e5f0" }} />
            </div>

            {otherJobs.length === 0
              ? <EmptyState text="Одоогоор бусад хэрэглэгчийн зар байхгүй." />
              : (
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: 16
                }}>
                  {otherJobs.map(job => (
                    <JobCard key={job._id || job.id} job={job} isOwner={false} />
                  ))}
                </div>
              )
            }
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {tab === "profile" && (
          <ProfileTab user={user} onUpdate={setUser} myJobsCount={myJobs.length} />
        )}
      </main>

      {/* ════════ MODALS ════════ */}
      {addModal && (
        <JobFormModal
          title="Шинэ зар нэмэх"
          initial={{}}
          onClose={() => setAddModal(false)}
          onSave={async (data) => {
            const res = await fetch(`${API}/jobs`, {
              method: "POST", headers: authHeader(), body: JSON.stringify(data)
            });
            if (res.ok) { setAddModal(false); fetchJobs(); }
          }}
        />
      )}

      {editJob && (
        <JobFormModal
          title="Зар засах"
          initial={editJob}
          onClose={() => setEditJob(null)}
          onSave={async (data) => {
            const id = editJob._id || editJob.id;
            const res = await fetch(`${API}/jobs/${id}`, {
              method: "PUT", headers: authHeader(), body: JSON.stringify(data)
            });
            if (res.ok) { setEditJob(null); fetchJobs(); }
          }}
        />
      )}

      {deleteConfirm && (
        <ConfirmModal
          message={`"${deleteConfirm.title}" зарыг устгах уу?`}
          onConfirm={() => handleDelete(deleteConfirm._id || deleteConfirm.id)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  PROFILE TAB — дэлгэрэнгүй профайл + засах
// ══════════════════════════════════════════════════════════════
function ProfileTab({ user, onUpdate, myJobsCount }) {
  const [form, setForm]   = useState({ name: user?.name || "", phone: user?.phone || "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg]     = useState({ text: "", ok: true });
  const [editMode, setEditMode] = useState(false);

  // form-ийг user өөрчлөгдөхөд шинэчил
  useEffect(() => {
    setForm({ name: user?.name || "", phone: user?.phone || "" });
  }, [user]);

  const handleSave = async () => {
    if (!form.name.trim()) { setMsg({ text: "Нэр хоосон байж болохгүй", ok: false }); return; }
    setSaving(true);
    setMsg({ text: "", ok: true });
    try {
      const res = await fetch(`${API}/auth/profile`, {
        method: "PUT",
        headers: authHeader(),
        body: JSON.stringify({ name: form.name.trim(), phone: form.phone.trim() })
      });
      const data = await res.json();
      if (res.ok) {
        onUpdate({ ...user, ...data });
        setMsg({ text: "✅ Амжилттай хадгалагдлаа", ok: true });
        setEditMode(false);
      } else {
        setMsg({ text: data.error || "❌ Хадгалахад алдаа гарлаа", ok: false });
      }
    } catch {
      setMsg({ text: "❌ Сервертэй холбогдож чадсангүй", ok: false });
    } finally {
      setSaving(false);
    }
  };

  const createdDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("mn-MN", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  return (
    <div style={{ maxWidth: 600 }}>
      <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 800, color: "#12122a" }}>
        Миний профайл
      </h2>

      {/* ── Hero card ── */}
      <div style={{
        background: "linear-gradient(135deg, #6c63ff 0%, #8b5cf6 100%)",
        borderRadius: 20, padding: "28px 28px 24px",
        marginBottom: 20, position: "relative", overflow: "hidden",
        boxShadow: "0 8px 32px rgba(108,99,255,0.28)"
      }}>
        {/* Decorative circles */}
        <div style={{ position:"absolute", top:-40, right:-40, width:140, height:140, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
        <div style={{ position:"absolute", bottom:-30, right:60, width:90, height:90, borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />

        <div style={{ display: "flex", alignItems: "center", gap: 18, position: "relative" }}>
          <Avatar name={user?.name} size={72} fontSize={28} />
          <div>
            <div style={{ color:"#fff", fontWeight:800, fontSize:22, marginBottom:4 }}>
              {user?.name}
            </div>
            <div style={{ color:"rgba(255,255,255,0.75)", fontSize:14, marginBottom:8 }}>
              {user?.email}
            </div>
            <RoleBadge role={user?.role} light />
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          display: "flex", gap: 0, marginTop: 24,
          background: "rgba(255,255,255,0.12)", borderRadius: 14, overflow: "hidden"
        }}>
          <StatCell icon="📋" label="Нийтлэсэн зар" value={myJobsCount} />
          <StatCell icon="📅" label="Бүртгүүлсэн" value={createdDate} noBorder />
        </div>
      </div>

      {/* ── Info form ── */}
      <div style={{
        background: "#fff", borderRadius: 20, padding: 28,
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)"
      }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
          <h3 style={{ margin:0, fontSize:16, fontWeight:700, color:"#12122a" }}>
            Хувийн мэдээлэл
          </h3>
          {!editMode && (
            <button
              onClick={() => { setEditMode(true); setMsg({ text:"", ok:true }); }}
              style={{
                padding:"7px 16px", background:"#f0eeff", color:"#6c63ff",
                border:"none", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer"
              }}
            >
              ✏️ Засах
            </button>
          )}
        </div>

        {/* Нэр */}
        <FieldRow icon="👤" label="Нэр">
          {editMode
            ? <input
                value={form.name}
                onChange={e => setForm(f => ({...f, name: e.target.value}))}
                style={inputStyle}
                placeholder="Нэрээ оруулна уу"
              />
            : <span style={valueStyle}>{user?.name}</span>
          }
        </FieldRow>

        {/* Имэйл — үргэлж readonly */}
        <FieldRow icon="📧" label="Имэйл">
          <span style={{ ...valueStyle, color:"#9196b0" }}>{user?.email}</span>
          <span style={{
            fontSize:10, color:"#aeb4cc", background:"#f4f6fb",
            padding:"2px 8px", borderRadius:20, marginLeft:8, fontWeight:600
          }}>засагдахгүй</span>
        </FieldRow>

        {/* Утас */}
        <FieldRow icon="📱" label="Утасны дугаар" last>
          {editMode
            ? <input
                value={form.phone}
                onChange={e => setForm(f => ({...f, phone: e.target.value}))}
                style={inputStyle}
                placeholder="99xxxxxx"
              />
            : <span style={valueStyle}>{user?.phone || <span style={{color:"#ccc"}}>—</span>}</span>
          }
        </FieldRow>

        {/* Message */}
        {msg.text && (
          <div style={{
            margin:"16px 0 0", padding:"11px 16px",
            background: msg.ok ? "#f0fdf4" : "#fff5f5",
            color: msg.ok ? "#166534" : "#c53030",
            borderRadius:10, fontSize:13, fontWeight:500
          }}>
            {msg.text}
          </div>
        )}

        {/* Buttons */}
        {editMode && (
          <div style={{ display:"flex", gap:10, marginTop:20 }}>
            <button
              onClick={() => { setEditMode(false); setForm({ name:user?.name||"", phone:user?.phone||"" }); setMsg({text:"",ok:true}); }}
              style={{
                flex:1, padding:"12px", background:"#f0f2f8",
                color:"#555", border:"none", borderRadius:10,
                fontSize:14, fontWeight:600, cursor:"pointer"
              }}
            >
              Болих
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                flex:2, padding:"12px",
                background: saving ? "#9ca3af" : "linear-gradient(135deg,#6c63ff,#8b5cf6)",
                color:"#fff", border:"none", borderRadius:10,
                fontSize:14, fontWeight:700,
                cursor: saving ? "not-allowed" : "pointer"
              }}
            >
              {saving ? "Хадгалж байна..." : "💾 Хадгалах"}
            </button>
          </div>
        )}
      </div>

      {/* ── Account info ── */}
      <div style={{
        background:"#fff", borderRadius:16, padding:"18px 24px",
        marginTop:16, boxShadow:"0 2px 12px rgba(0,0,0,0.05)",
        display:"flex", alignItems:"center", gap:14
      }}>
        <div style={{
          width:40, height:40, background:"#fef9ee", borderRadius:10,
          display:"flex", alignItems:"center", justifyContent:"center", fontSize:18
        }}>📅</div>
        <div>
          <div style={{ fontSize:11, color:"#aeb4cc", fontWeight:600 }}>БҮРТГҮҮЛСЭН ОГНОО</div>
          <div style={{ fontSize:15, fontWeight:700, color:"#12122a", marginTop:2 }}>{createdDate}</div>
        </div>
      </div>
    </div>
  );
}

// ── inline styles ────────────────────────────────────────────
const inputStyle = {
  flex:1, border:"1.5px solid #e0e3ef", borderRadius:8,
  padding:"8px 12px", fontSize:14, outline:"none",
  fontFamily:"inherit", color:"#12122a", background:"#fafbff"
};
const valueStyle = { fontSize:15, fontWeight:600, color:"#12122a" };

// ── FieldRow ─────────────────────────────────────────────────
function FieldRow({ icon, label, children, last }) {
  return (
    <div style={{
      display:"flex", alignItems:"center", gap:14,
      paddingBottom: last ? 0 : 18,
      marginBottom: last ? 0 : 18,
      borderBottom: last ? "none" : "1px solid #f0f2f8"
    }}>
      <div style={{
        width:38, height:38, background:"#f4f6fb", borderRadius:10,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:17, flexShrink:0
      }}>{icon}</div>
      <div style={{ minWidth:90, fontSize:12, color:"#9196b0", fontWeight:600 }}>{label}</div>
      <div style={{ flex:1, display:"flex", alignItems:"center" }}>{children}</div>
    </div>
  );
}

// ── StatCell ─────────────────────────────────────────────────
function StatCell({ icon, label, value, noBorder }) {
  return (
    <div style={{
      flex:1, padding:"14px 16px", textAlign:"center",
      borderRight: noBorder ? "none" : "1px solid rgba(255,255,255,0.15)"
    }}>
      <div style={{ color:"rgba(255,255,255,0.7)", fontSize:11, fontWeight:600, marginBottom:4 }}>
        {icon} {label}
      </div>
      <div style={{ color:"#fff", fontWeight:800, fontSize:15 }}>{value}</div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  JOB CARD
// ══════════════════════════════════════════════════════════════
function JobCard({ job, isOwner, onEdit, onDelete }) {
  return (
    <div style={{
      background:"#fff", borderRadius:16, padding:20,
      boxShadow:"0 2px 14px rgba(0,0,0,0.06)",
      border: isOwner ? "1.5px solid #ddd8ff" : "1.5px solid #eef0f8",
      position:"relative", display:"flex", flexDirection:"column"
    }}>
      {isOwner && (
        <span style={{
          position:"absolute", top:14, right:14,
          background:"#6c63ff", color:"#fff",
          fontSize:9, fontWeight:800, padding:"3px 9px",
          borderRadius:20, letterSpacing:0.5
        }}>МИНИЙХ</span>
      )}

      <h3 style={{ margin:"0 0 4px", fontSize:15, fontWeight:700, color:"#12122a", paddingRight:48 }}>
        {job.title}
      </h3>
      <p style={{ margin:0, color:"#9196b0", fontSize:13 }}>🏢 {job.company}</p>

      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:12 }}>
        <Tag>📍 {job.location}</Tag>
        <Tag>🕐 {job.time}</Tag>
        <Tag accent>💰 {job.price}</Tag>
      </div>

      <p style={{
        margin:"10px 0 0", color:"#7b82a8", fontSize:12, lineHeight:1.6, flex:1,
        overflow:"hidden", textOverflow:"ellipsis",
        display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical"
      }}>
        {job.details}
      </p>

      {isOwner && (
        <div style={{ display:"flex", gap:8, marginTop:14 }}>
          <button onClick={onEdit} style={{
            flex:1, padding:"9px", background:"#f0eeff", color:"#6c63ff",
            border:"none", borderRadius:9, fontSize:13, fontWeight:700, cursor:"pointer"
          }}>✏️ Засах</button>
          <button onClick={onDelete} style={{
            flex:1, padding:"9px", background:"#fff1f1", color:"#e53e3e",
            border:"none", borderRadius:9, fontSize:13, fontWeight:700, cursor:"pointer"
          }}>🗑 Устгах</button>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
//  JOB FORM MODAL
// ══════════════════════════════════════════════════════════════
function JobFormModal({ title, initial, onClose, onSave }) {
  const [form, setForm] = useState({
    title:    initial.title    || "",
    company:  initial.company  || "",
    price:    initial.price    || "",
    priceNum: initial.priceNum || "",
    time:     initial.time     || "",
    location: initial.location || "",
    details:  initial.details  || "",
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const set = (k,v) => setForm(f => ({...f,[k]:v}));

  const handleSubmit = async () => {
    if (!form.title.trim()) { setErr("Ажлын нэр оруулна уу"); return; }
    if (!form.price.trim()) { setErr("Үнэ оруулна уу"); return; }
    setSaving(true); setErr("");
    await onSave({ ...form, priceNum: Number(form.priceNum) || 0 });
    setSaving(false);
  };

  return (
    <Overlay onClose={onClose}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
        <h2 style={{ margin:0, fontSize:19, fontWeight:800, color:"#12122a" }}>{title}</h2>
        <button onClick={onClose} style={{
          background:"#f0f2f8", border:"none", borderRadius:50,
          width:34, height:34, fontSize:16, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center"
        }}>✕</button>
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
        <FInput label="Ажлын нэр *"      value={form.title}    onChange={v=>set("title",v)}    placeholder="жнь: Нохой салхилуулах" />
        <FInput label="Компани / байгууллага" value={form.company} onChange={v=>set("company",v)} placeholder="жнь: Happy Pets" />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <FInput label="Цалин (харуулах)" value={form.price}    onChange={v=>set("price",v)}    placeholder="5,000₮/цаг" />
          <FInput label="Цалин (тоогоор)"  value={form.priceNum} onChange={v=>set("priceNum",v)} placeholder="5000" type="number" />
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
          <FInput label="Цаг хугацаа" value={form.time}     onChange={v=>set("time",v)}     placeholder="09:00 – 17:00" />
          <FInput label="Байршил"     value={form.location} onChange={v=>set("location",v)} placeholder="ХУД" />
        </div>
        <div>
          <label style={{ fontSize:13, fontWeight:600, color:"#555", display:"block", marginBottom:6 }}>
            Дэлгэрэнгүй тайлбар
          </label>
          <textarea
            value={form.details}
            onChange={e=>set("details",e.target.value)}
            placeholder="Ажлын тухай дэлгэрэнгүй бичнэ үү..."
            rows={3}
            style={{
              width:"100%", padding:"10px 14px",
              border:"1.5px solid #e0e3ef", borderRadius:10,
              fontSize:14, outline:"none", resize:"vertical",
              fontFamily:"inherit", boxSizing:"border-box", color:"#12122a"
            }}
          />
        </div>
      </div>

      {err && (
        <div style={{ marginTop:12, color:"#e53e3e", fontSize:13, fontWeight:500 }}>{err}</div>
      )}

      <div style={{ display:"flex", gap:10, marginTop:22 }}>
        <button onClick={onClose} style={{
          flex:1, padding:"12px", background:"#f0f2f8",
          color:"#555", border:"none", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer"
        }}>Болих</button>
        <button onClick={handleSubmit} disabled={saving} style={{
          flex:2, padding:"12px",
          background: saving ? "#9ca3af" : "linear-gradient(135deg,#6c63ff,#8b5cf6)",
          color:"#fff", border:"none", borderRadius:10,
          fontSize:14, fontWeight:700, cursor: saving ? "not-allowed" : "pointer"
        }}>
          {saving ? "Хадгалж байна..." : "✅ Хадгалах"}
        </button>
      </div>
    </Overlay>
  );
}

// ══════════════════════════════════════════════════════════════
//  CONFIRM MODAL
// ══════════════════════════════════════════════════════════════
function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <Overlay onClose={onCancel} small>
      <div style={{ textAlign:"center" }}>
        <div style={{ fontSize:44, marginBottom:14 }}>🗑️</div>
        <h3 style={{ margin:"0 0 8px", color:"#12122a", fontSize:17 }}>{message}</h3>
        <p style={{ color:"#9196b0", fontSize:13, margin:0 }}>Энэ үйлдлийг буцаах боломжгүй.</p>
        <div style={{ display:"flex", gap:10, marginTop:24 }}>
          <button onClick={onCancel} style={{
            flex:1, padding:"12px", background:"#f0f2f8",
            color:"#555", border:"none", borderRadius:10, fontSize:14, fontWeight:600, cursor:"pointer"
          }}>Болих</button>
          <button onClick={onConfirm} style={{
            flex:1, padding:"12px", background:"#e53e3e",
            color:"#fff", border:"none", borderRadius:10, fontSize:14, fontWeight:700, cursor:"pointer"
          }}>🗑 Устгах</button>
        </div>
      </div>
    </Overlay>
  );
}

// ══════════════════════════════════════════════════════════════
//  SHARED PRIMITIVES
// ══════════════════════════════════════════════════════════════
function Overlay({ onClose, children, small }) {
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, background:"rgba(0,0,0,0.45)",
      backdropFilter:"blur(5px)", display:"flex",
      alignItems:"center", justifyContent:"center", zIndex:1000, padding:20
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"#fff", borderRadius:22,
        padding:30, width:"100%", maxWidth: small ? 380 : 560,
        boxShadow:"0 24px 64px rgba(0,0,0,0.22)",
        maxHeight:"90vh", overflowY:"auto"
      }}>
        {children}
      </div>
    </div>
  );
}

function Avatar({ name, size=46, fontSize=20 }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:"50%", flexShrink:0,
      background:"linear-gradient(135deg,#6c63ff,#8b5cf6)",
      display:"flex", alignItems:"center", justifyContent:"center",
      fontSize, fontWeight:800, color:"#fff",
      boxShadow:"0 4px 14px rgba(108,99,255,0.35)"
    }}>
      {name?.[0]?.toUpperCase() || "?"}
    </div>
  );
}

function RoleBadge({ role, small, light }) {
  const isEmp = role === "employer";
  return (
    <span style={{
      display:"inline-block",
      marginTop: small ? 6 : 0,
      background: light ? "rgba(255,255,255,0.18)" : (isEmp ? "#e8f5e9" : "#eef0ff"),
      color: light ? "#fff" : (isEmp ? "#2e7d32" : "#4338ca"),
      fontSize: small ? 10 : 12,
      padding:"3px 10px", borderRadius:20, fontWeight:700
    }}>
      {isEmp ? "🏢 Ажил олгогч" : "👷 Ажилтан"}
    </span>
  );
}

function SideTab({ active, icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{
      width:"100%", padding:"13px 24px",
      background: active ? "rgba(108,99,255,0.16)" : "transparent",
      color: active ? "#a89cff" : "#7b82a8",
      border:"none",
      borderLeft: active ? "3px solid #6c63ff" : "3px solid transparent",
      textAlign:"left", fontSize:14,
      fontWeight: active ? 700 : 400,
      cursor:"pointer", display:"flex", gap:10, alignItems:"center",
      transition:"all 0.15s"
    }}>
      {icon} {label}
    </button>
  );
}

function Tag({ children, accent }) {
  return (
    <span style={{
      background: accent ? "#f0eeff" : "#f4f6fb",
      color: accent ? "#6c63ff" : "#6b7280",
      fontSize:11, fontWeight: accent ? 700 : 400,
      padding:"3px 10px", borderRadius:20
    }}>{children}</span>
  );
}

function FInput({ label, value, onChange, placeholder, type="text" }) {
  return (
    <div>
      <label style={{ fontSize:13, fontWeight:600, color:"#555", display:"block", marginBottom:6 }}>
        {label}
      </label>
      <input
        type={type} value={value}
        onChange={e=>onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width:"100%", padding:"10px 14px",
          border:"1.5px solid #e0e3ef", borderRadius:10,
          fontSize:14, outline:"none", boxSizing:"border-box",
          fontFamily:"inherit", color:"#12122a"
        }}
      />
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div style={{
      textAlign:"center", padding:"44px 20px",
      background:"#fff", borderRadius:16,
      color:"#b0b6cc", border:"2px dashed #e2e5f0"
    }}>
      <div style={{ fontSize:36, marginBottom:10 }}>📭</div>
      <p style={{ margin:0, fontSize:14 }}>{text}</p>
    </div>
  );
}

function Screen({ icon, text }) {
  return (
    <div style={{
      height:"100vh", display:"flex", alignItems:"center",
      justifyContent:"center", background:"#f0f2f8",
      fontSize:16, color:"#888", gap:12, fontFamily:"sans-serif"
    }}>
      <span style={{ fontSize:28 }}>{icon}</span> {text}
    </div>
  );
}

function ErrorScreen({ message }) {
  return (
    <div style={{
      height:"100vh", display:"flex", alignItems:"center",
      justifyContent:"center", background:"#f0f2f8",
      flexDirection:"column", gap:14, fontFamily:"sans-serif"
    }}>
      <span style={{ fontSize:44 }}>🔒</span>
      <p style={{ color:"#e53e3e", fontWeight:700, margin:0 }}>{message}</p>
      <button
        onClick={() => window.location.href = "/login"}
        style={{
          padding:"10px 28px", background:"#6c63ff", color:"#fff",
          border:"none", borderRadius:10, cursor:"pointer", fontWeight:700, fontSize:14
        }}
      >
        Нэвтрэх →
      </button>
    </div>
  );
}