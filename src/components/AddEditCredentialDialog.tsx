'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface AddEditCredentialDialogProps {
  isOpen: boolean
  onClose: () => void
  isEditMode: boolean
  currentUser: string
  credentials: Record<
    string,
    { aws_access_key_id: string; aws_secret_access_key: string }
  >
  onCredentialsUpdate: () => void
}

export function AddEditCredentialDialog({
  isOpen,
  onClose,
  isEditMode,
  currentUser,
  credentials,
  onCredentialsUpdate,
}: AddEditCredentialDialogProps) {
  const [user, setUser] = useState('')
  const [awsAccessKeyId, setAwsAccessKeyId] = useState('')
  const [awsSecretAccessKey, setAwsSecretAccessKey] = useState('')

  useEffect(() => {
    if (isEditMode && currentUser) {
      setUser(currentUser)
      setAwsAccessKeyId(credentials[currentUser].aws_access_key_id)
      setAwsSecretAccessKey(credentials[currentUser].aws_secret_access_key)
    } else {
      setUser('')
      setAwsAccessKeyId('')
      setAwsSecretAccessKey('')
    }
  }, [isEditMode, currentUser, credentials])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const method = isEditMode ? 'PATCH' : 'POST'

    try {
      await fetch('/api/credentials', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user,
          aws_access_key_id: awsAccessKeyId,
          aws_secret_access_key: awsSecretAccessKey,
        }),
      })
      onCredentialsUpdate()
      onClose()
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'adding'} user:`, error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit User' : 'Add New User'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="user">User</Label>
            <Input
              id="user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
              disabled={isEditMode}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="awsAccessKeyId">AWS Access Key ID</Label>
            <Input
              id="awsAccessKeyId"
              value={awsAccessKeyId}
              onChange={(e) => setAwsAccessKeyId(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="awsSecretAccessKey">AWS Secret Access Key</Label>
            <Input
              id="awsSecretAccessKey"
              type="password"
              value={awsSecretAccessKey}
              onChange={(e) => setAwsSecretAccessKey(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{isEditMode ? 'Update' : 'Add'}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
