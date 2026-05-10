import { getToken } from './api'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export async function uploadBrandLogo(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('logo', file)

  const res = await fetch(`${BASE_URL}/upload/brand-logo`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.message || 'Upload failed')
  }

  const data = await res.json()
  return data.url
}

export async function uploadProductImages(files: File[]): Promise<string[]> {
  const formData = new FormData()
  files.forEach(f => formData.append('images', f))

  const res = await fetch(`${BASE_URL}/upload/product-images`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  })

  if (!res.ok) throw new Error('Upload failed')
  const data = await res.json()
  return data.urls
}

export async function uploadAvatar(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('avatar', file)

  const res = await fetch(`${BASE_URL}/upload/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getToken()}` },
    body: formData,
  })

  if (!res.ok) throw new Error('Upload failed')
  const data = await res.json()
  return data.url
}
