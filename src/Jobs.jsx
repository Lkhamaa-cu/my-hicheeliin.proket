import { useEffect, useState, useMemo } from 'react'
import { getJobs, deleteJob, updateJob } from './api/jobApi'

const TYPE_STYLES = {
  'Бүтэн цаг': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Цагийн':    'bg-amber-50 text-amber-700 border-amber-200',
  'Зайнаас':   'bg-violet-50 text-violet-700 border-violet-200',
}

const JOB_ICONS = [
  '🐶','🛒','🧹','🚚','👨‍⚕️', '📦','🍔','🐱','🌿','👴', '💻','🔨','❄️','🏋️','📚','🚗','👨‍🏫','📢','🌸','🛍️', '🍳','📦','⚡','🎸','🧼','🎁','🐾','🧽','📦','📸'
  
]

const PER_PAGE = 8

export default function JobsPage() {
  const [jobs, setJobs]             = useState([])
  const [search, setSearch]         = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [locFilter, setLocFilter]   = useState('')
  const [sort, setSort]             = useState('newest')
  const [editingId, setEditingId]   = useState(null)
  const [editForm, setEditForm]     = useState({})
  const [page, setPage]             = useState(1)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    getJobs().then(data => {
      setJobs(data)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    let list = [...jobs]
    if (search)     list = list.filter(j => (j.title + (j.company || '') + (j.details || '')).toLowerCase().includes(search.toLowerCase()))
    if (typeFilter) list = list.filter(j => j.time === typeFilter)
    if (locFilter)  list = list.filter(j => j.location === locFilter)
    if (sort === 'price-high') list.sort((a, b) => (b.priceNum || 0) - (a.priceNum || 0))
    if (sort === 'price-low')  list.sort((a, b) => (a.priceNum || 0) - (b.priceNum || 0))
    return list
  }, [jobs, search, typeFilter, locFilter, sort])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const stats = {
    total:    jobs.length,
    fullTime: jobs.filter(j => j.time === 'Бүтэн цаг').length,
    remote:   jobs.filter(j => j.time === 'Зайнаас').length,
  }

  const handleFilterChange = (setter) => (e) => {
    setter(e.target.value)
    setPage(1)
    setEditingId(null)
  }

  const handleEditClick = (job) => {
    if (editingId === job.id) { setEditingId(null); return }
    setEditingId(job.id)
    setEditForm({ ...job })
  }

  const handleSave = async () => {
    await updateJob(editForm.id, editForm)
    setJobs(jobs.map(j => j.id === editForm.id ? { ...j, ...editForm } : j))
    setEditingId(null)
  }

  const handleDelete = async (id) => {
    await deleteJob(id)
    const next = jobs.filter(j => j.id !== id)
    setJobs(next)
    if (editingId === id) setEditingId(null)
    const newMax = Math.ceil((next.length) / PER_PAGE)
    if (page > newMax) setPage(Math.max(1, newMax))
  }

  const locations = [...new Set(jobs.map(j => j.location).filter(Boolean))]
  const types     = [...new Set(jobs.map(j => j.time).filter(Boolean))]

  if (loading) return (
    <div className="flex items-center justify-center min-h-64 text-sm text-gray-400">
      <svg className="animate-spin w-5 h-5 mr-2 text-blue-400" viewBox="0 0 24 24" fill="none">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
      </svg>
      Ачааллаж байна...
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-2 flex-1 min-w-48 bg-white border border-gray-200 rounded-xl px-3 h-10 shadow-sm">
          <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
            placeholder="Ажил хайх..."
            value={search}
            onChange={handleFilterChange(setSearch)}
          />
          {search && (
            <button onClick={() => { setSearch(''); setPage(1) }} className="text-gray-300 hover:text-gray-500 transition">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>

      

        <select
          className="h-10 px-3 text-xs border border-gray-200 rounded-xl bg-white text-gray-600 cursor-pointer outline-none shadow-sm"
          value={locFilter}
          onChange={handleFilterChange(setLocFilter)}
        >
          <option value="">Бүх байршил</option>
          {locations.map(l => <option key={l}>{l}</option>)}
        </select>

        <select
          className="h-10 px-3 text-xs border border-gray-200 rounded-xl bg-white text-gray-600 cursor-pointer outline-none shadow-sm"
          value={sort}
          onChange={handleFilterChange(setSort)}
        >
          <option value="newest">Шинэ эхэнд</option>
          <option value="price-high">Үнэ: их → бага</option>
          <option value="price-low">Үнэ: бага → их</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Нийт ажил', value: stats.total },
          { label: 'Бүтэн цаг', value: stats.fullTime },
          { label: 'Зайнаас',   value: stats.remote },
        ].map(s => (
          <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
            <div className="text-xs text-gray-400 mb-1">{s.label}</div>
            <div className="text-2xl font-medium text-gray-900">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Result count */}
      {search || typeFilter || locFilter ? (
        <div className="text-xs text-gray-400 mb-3">{filtered.length} үр дүн</div>
      ) : null}

      {/* Jobs list */}
      {paginated.length === 0 ? (
        <div className="text-center py-20 text-gray-400 text-sm">
          <svg className="w-10 h-10 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          Ажил олдсонгүй
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {paginated.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              icon={JOB_ICONS[job.id % JOB_ICONS.length]}
              isEditing={editingId === job.id}
              editForm={editForm}
              setEditForm={setEditForm}
              onEditClick={() => handleEditClick(job)}
              onSave={handleSave}
              onCancel={() => setEditingId(null)}
              onDelete={() => handleDelete(job.id)}
              typeStyles={TYPE_STYLES}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          total={filtered.length}
          perPage={PER_PAGE}
          onPage={(p) => {
            setPage(p)
            setEditingId(null)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        />
      )}
    </div>
  )
}


function JobCard({ job, icon, isEditing, editForm, setEditForm, onEditClick, onSave, onCancel, onDelete, typeStyles }) {
  const typeClass = typeStyles[job.time] || 'bg-gray-100 text-gray-600 border-gray-200'

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-150 ${isEditing ? 'border-blue-300' : 'border-gray-200 hover:border-gray-300'}`}>
      <div className="px-4 pt-4 pb-3">

        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-lg shrink-0 select-none">
              {icon}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">{job.title}</div>
              <div className="text-xs text-gray-400 mt-0.5">{job.company}</div>
            </div>
          </div>
          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={onEditClick}
              className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-all ${
                isEditing
                  ? 'bg-blue-50 border-blue-200 text-blue-500'
                  : 'border-gray-200 text-gray-400 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-500'
              }`}
              aria-label="Засах"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button
              onClick={onDelete}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all"
              aria-label="Устгах"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            {job.price}
          </span>
          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-md border ${typeClass}`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            {job.time}
          </span>
          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 border border-gray-100">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            {job.location}
          </span>
          {job.postedDays && (
            <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-gray-50 text-gray-400 border border-gray-100">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              {job.postedDays} өдрийн өмнө
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{job.details}</p>
      </div>

      {/* Inline Edit Form */}
      {isEditing && (
        <div className="px-4 pb-4 pt-3 border-t border-gray-100">
          <div className="grid grid-cols-2 gap-2.5 mb-3">
            <div className="col-span-2">
              <label className="text-xs text-gray-400 font-medium mb-1 block">Гарчиг</label>
              <input
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition"
                value={editForm.title || ''}
                onChange={e => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium mb-1 block">Үнэ</label>
              <input
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition"
                value={editForm.price || ''}
                onChange={e => setEditForm({ ...editForm, price: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium mb-1 block">Байршил</label>
              <input
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition"
                value={editForm.location || ''}
                onChange={e => setEditForm({ ...editForm, location: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium mb-1 block">Ажлын төрөл</label>
              <select
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-700 outline-none focus:border-blue-300 transition cursor-pointer"
                value={editForm.time || ''}
                onChange={e => setEditForm({ ...editForm, time: e.target.value })}
              >
                <option>Бүтэн цаг</option>
                <option>Цагийн</option>
                <option>Зайнаас</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-400 font-medium mb-1 block">Компани</label>
              <input
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition"
                value={editForm.company || ''}
                onChange={e => setEditForm({ ...editForm, company: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs text-gray-400 font-medium mb-1 block">Тайлбар</label>
              <input
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-gray-50 text-gray-900 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition"
                value={editForm.details || ''}
                onChange={e => setEditForm({ ...editForm, details: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onSave}
              className="flex items-center gap-1.5 bg-blue-50 text-blue-600 border border-blue-200 text-xs font-medium px-4 py-2 rounded-lg hover:bg-blue-100 transition"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Хадгалах
            </button>
            <button
              onClick={onCancel}
              className="text-xs text-gray-500 border border-gray-200 bg-white px-4 py-2 rounded-lg hover:bg-gray-50 transition"
            >
              Цуцлах
            </button>
          </div>
        </div>
      )}
    </div>
  )
}


function Pagination({ page, totalPages, total, perPage, onPage }) {
  const from = (page - 1) * perPage + 1
  const to   = Math.min(page * perPage, total)

  const getPages = () => {
    const pages = []
    for (let p = 1; p <= totalPages; p++) {
      if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) pages.push(p)
      else if (Math.abs(p - page) === 2) pages.push('...' + p)
    }
    return pages
  }

  return (
    <div className="flex items-center justify-between mt-5 text-xs text-gray-400">
      <span>{from}–{to} / нийт {total}</span>
      <div className="flex gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-default transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>

        {getPages().map((p, i) =>
          String(p).startsWith('...')
            ? <span key={i} className="h-8 px-1 flex items-center text-gray-300">…</span>
            : <button
                key={p}
                onClick={() => onPage(p)}
                className={`h-8 min-w-[2rem] px-2 rounded-lg border text-xs font-medium transition ${
                  p === page
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                {p}
              </button>
        )}

        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="h-8 w-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-400 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-default transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>
    </div>
  )
}