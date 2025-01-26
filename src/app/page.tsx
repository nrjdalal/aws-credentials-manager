'use client'

import { useState, useEffect } from 'react'
import { Loader2, Plus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { CredentialsList } from '@/components/CredentialsList'
import { AddEditCredentialDialog } from '@/components/AddEditCredentialDialog'
import { Toaster } from '@/components/ui/toaster'

export default function Page() {
  interface Credential {
    aws_access_key_id: string
    aws_secret_access_key: string
    [key: string]: string
  }

  const [credentials, setCredentials] = useState<Record<string, Credential>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [currentUser, setCurrentUser] = useState('')

  const fetchCredentials = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/credentials')
      const data = await response.json()
      setCredentials(data)
    } catch (error) {
      console.error('Error fetching credentials:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (user: string) => {
    try {
      await fetch(`/api/credentials?user=${user}`, {
        method: 'DELETE',
      })
      fetchCredentials()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  useEffect(() => {
    fetchCredentials()
  }, [])

  const handleAddUser = () => {
    setIsEditMode(false)
    setCurrentUser('')
    setIsDialogOpen(true)
  }

  const handleEditUser = (user: string) => {
    setIsEditMode(true)
    setCurrentUser(user)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setCurrentUser('')
  }

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>AWS Credentials Manager</CardTitle>
              <CardDescription>
                Manage your AWS credentials securely
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon" onClick={fetchCredentials}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button onClick={handleAddUser}>
                <Plus className="h-4 w-4 mr-2" /> Add New User
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <CredentialsList
              credentials={credentials}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          )}
        </CardContent>
      </Card>

      <AddEditCredentialDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        isEditMode={isEditMode}
        currentUser={currentUser}
        credentials={credentials}
        onCredentialsUpdate={fetchCredentials}
      />

      <Toaster />
    </div>
  )
}
