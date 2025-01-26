'use client'

import { Edit2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface CredentialsListProps {
  credentials: Record<
    string,
    { aws_access_key_id: string; aws_secret_access_key: string }
  >
  onEdit: (user: string) => void
  onDelete: (user: string) => void
}

export function CredentialsList({
  credentials,
  onEdit,
  onDelete,
}: CredentialsListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>AWS Access Key ID</TableHead>
          <TableHead>AWS Secret Access Key</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(credentials).map(([user, values]) => (
          <TableRow key={user}>
            <TableCell className="font-medium">{user}</TableCell>
            <TableCell>{values.aws_access_key_id}</TableCell>
            <TableCell>{'*'.repeat(20)}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" onClick={() => onEdit(user)}>
                <Edit2 className="h-4 w-4 mr-2" /> Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(user)}>
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
