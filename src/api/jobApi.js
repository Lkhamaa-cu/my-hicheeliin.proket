const BASE_URL = '/api'

export const getJobs = async () => {
  const res = await fetch(`${BASE_URL}/jobs`)
  return res.json()
}

export const getJobById = async (id) => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`)
  return res.json()
}

export const createJob = async (data) => {
  const res = await fetch(`${BASE_URL}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export const updateJob = async (id, data) => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return res.json()
}

export const deleteJob = async (id) => {
  const res = await fetch(`${BASE_URL}/jobs/${id}`, {
    method: 'DELETE'
  })
  return res.json()
}

