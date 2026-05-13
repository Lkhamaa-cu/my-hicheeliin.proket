import { useEffect, useState } from 'react'
import { getJobs, deleteJob, updateJob } from './api/jobApi'

export default function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [editingJob, setEditingJob] = useState(null)

  useEffect(() => {
    getJobs().then(setJobs)
  }, [])

  const handleDelete = async (id) => {
    await deleteJob(id)
    setJobs(jobs.filter(j => j.id !== id))
    if (editingJob?.id === id) setEditingJob(null)
  }

  const handleEditClick = (job) => {
    setEditingJob({ ...job })
  }

  const handleUpdate = async () => {
    await updateJob(editingJob.id, editingJob)
    setJobs(jobs.map(j => j.id === editingJob.id ? editingJob : j))
    setEditingJob(null)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium text-gray-900">Ажлын жагсаалт</h1>
        <span className="text-xs text-gray-500 bg-gray-100 border border-gray-200 rounded-full px-3 py-1">
          {jobs.length} ажил
        </span>
      </div>

      {/* Edit Panel */}
      {editingJob && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            <span className="text-sm font-medium text-gray-700">Засварлах</span>
            <span className="text-xs bg-amber-100 text-amber-700 rounded-full px-2 py-0.5">Засварлаж байна</span>
          </div>

          <div className="grid grid-cols-1 gap-3 mb-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 tracking-wide">Гарчиг</label>
              <input
                className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition"
                value={editingJob.title}
                onChange={e => setEditingJob({ ...editingJob, title: e.target.value })}
                placeholder="Ажлын гарчиг"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 tracking-wide">Үнэ</label>
                <input
                  className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition"
                  value={editingJob.price}
                  onChange={e => setEditingJob({ ...editingJob, price: e.target.value })}
                  placeholder="₮ Үнэ"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-500 tracking-wide">Байршил</label>
                <input
                  className="w-full h-9 px-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition"
                  value={editingJob.location}
                  onChange={e => setEditingJob({ ...editingJob, location: e.target.value })}
                  placeholder="Байршил"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-blue-100 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Хадгалах
            </button>
            <button
              onClick={() => setEditingJob(null)}
              className="text-sm text-gray-500 border border-gray-200 bg-white px-4 py-1.5 rounded-lg hover:bg-gray-50 transition"
            >
              Цуцлах
            </button>
          </div>
        </div>
      )}

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 mx-auto mb-3 opacity-30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
          </svg>
          Ажлын зар байхгүй байна
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {jobs.map(job => (
            <div
              key={job.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="text-sm font-medium text-gray-900">{job.title}</h2>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleEditClick(job)}
                    className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 px-2.5 py-1 rounded-lg hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Засах
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="flex items-center gap-1 text-xs text-gray-500 border border-gray-200 px-2.5 py-1 rounded-lg hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                    Устгах
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-2">
                <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-md px-2 py-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                  {job.price}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-md px-2 py-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {job.time}
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 border border-gray-100 rounded-md px-2 py-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {job.location}
                </span>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">{job.details}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}