export async function getCredentials() {
  const response = await fetch('/api/credentials')
  if (!response.ok) {
    throw new Error('Failed to fetch credentials')
  }
  return response.json()
}

export async function addCredentials(
  user: string,
  aws_access_key_id: string,
  aws_secret_access_key: string
) {
  const response = await fetch('/api/credentials', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user, aws_access_key_id, aws_secret_access_key }),
  })
  if (!response.ok) {
    throw new Error('Failed to add credentials')
  }
  return response.json()
}

export async function updateCredentials(
  user: string,
  aws_access_key_id: string,
  aws_secret_access_key: string
) {
  const response = await fetch('/api/credentials', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user, aws_access_key_id, aws_secret_access_key }),
  })
  if (!response.ok) {
    throw new Error('Failed to update credentials')
  }
  return response.json()
}
