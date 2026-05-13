import { useEffect, useState } from 'react'
import { Routes, Route, Link } from "react-router-dom";
import { getJobs, deleteJob, updateJob } from './api/jobApi'

export default function JobsPage() {
  const [jobs, setJobs] = useState([])
  const [editingJob, setEditingJob] = useState(null) // засварлаж буй job

  useEffect(() => {
    getJobs().then(setJobs)
  }, [])

  
  const handleDelete = async (id) => {
    await deleteJob(id) 
    setJobs(jobs.filter(j => j.id !== id))
  }


  const handleEditClick = (job) => {
    setEditingJob({ ...job })
  }

  // 🟢 Хадгалах
  const handleUpdate = async () => {
    await updateJob(editingJob.id, editingJob)
    setJobs(jobs.map(j => j.id === editingJob.id ? editingJob : j))
    setEditingJob(null)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Ажлын жагсаалт</h1>

      {/* 🟡 Засварлах форм */}
      {editingJob && (
        <div className="border p-4 mb-4 rounded bg-yellow-50">
          <h2 className="font-bold mb-2">Засварлах</h2>
          <input
            className="border p-1 w-full mb-2"
            value={editingJob.title}
            onChange={e => setEditingJob({ ...editingJob, title: e.target.value })}
            placeholder="Гарчиг"
          />
          <input
            className="border p-1 w-full mb-2"
            value={editingJob.price}
            onChange={e => setEditingJob({ ...editingJob, price: e.target.value })}
            placeholder="Үнэ"
          />
          <input
            className="border p-1 w-full mb-2"
            value={editingJob.location}
            onChange={e => setEditingJob({ ...editingJob, location: e.target.value })}
            placeholder="Байршил"
          />
          <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-1 rounded mr-2">
            Хадгалах
          </button>
          <button onClick={() => setEditingJob(null)} className="bg-gray-400 text-white px-4 py-1 rounded">
            Цуцлах
          </button>
        </div>
      )}

      {/* 📋 Жагсаалт */}
      {jobs.map(job => (
        <div key={job.id} className="border p-4 mb-2 rounded">
          <h2 className="font-bold">{job.title}</h2>
          <p>{job.price} | {job.time} | {job.location}</p>
          <p className="text-sm text-gray-600">{job.details}</p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => handleEditClick(job)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Засах
            </button>
            <button
              onClick={() => handleDelete(job.id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Устгах
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}