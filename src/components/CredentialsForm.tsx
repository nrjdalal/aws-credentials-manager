'use client'

import { useState } from 'react'
import { addCredentials, updateCredentials } from '@/lib/api'

export default function CredentialsForm() {
  const [user, setUser] = useState('')
  const [accessKeyId, setAccessKeyId] = useState('')
  const [secretAccessKey, setSecretAccessKey] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      const response = await addCredentials(user, accessKeyId, secretAccessKey)
      setMessage(response.message)
      setUser('')
      setAccessKeyId('')
      setSecretAccessKey('')
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message)
      } else {
        setMessage('An error occurred')
      }
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      const response = await updateCredentials(
        user,
        accessKeyId,
        secretAccessKey
      )
      setMessage(response.message)
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message)
      } else {
        setMessage('An error occurred')
      }
    }
  }

  return (
    <form className="space-y-4">
      <div>
        <label htmlFor="user" className="block mb-1">
          User:
        </label>
        <input
          type="text"
          id="user"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="accessKeyId" className="block mb-1">
          Access Key ID:
        </label>
        <input
          type="text"
          id="accessKeyId"
          value={accessKeyId}
          onChange={(e) => setAccessKeyId(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div>
        <label htmlFor="secretAccessKey" className="block mb-1">
          Secret Access Key:
        </label>
        <input
          type="password"
          id="secretAccessKey"
          value={secretAccessKey}
          onChange={(e) => setSecretAccessKey(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          required
        />
      </div>
      <div className="flex space-x-4">
        <button
          type="submit"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add
        </button>
        <button
          type="button"
          onClick={handleUpdate}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Update
        </button>
      </div>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </form>
  )
}
