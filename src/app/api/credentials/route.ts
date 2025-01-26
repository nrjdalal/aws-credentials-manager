import fs from 'fs'
import path from 'path'
import os from 'os'
import ini from 'ini'

export async function GET(request: Request) {
  try {
    const query = Object.fromEntries(new URL(request.url).searchParams)
    const homeDir = os.homedir()
    const credentialsFilePath = path.join(homeDir, '.aws', 'credentials')

    if (fs.existsSync(credentialsFilePath)) {
      const fileContent = fs.readFileSync(credentialsFilePath, 'utf-8')
      const configData = ini.parse(fileContent)

      let filteredConfigData = configData

      if (query.user) {
        const user = query.user
        if (configData[user]) {
          filteredConfigData = { [user]: configData[user] }
        } else {
          return new Response(`User '${user}' not found in credentials file`, {
            status: 404,
          })
        }
      }

      const maskedConfigData = Object.fromEntries(
        Object.entries(filteredConfigData).map(([section, values]) => {
          const maskedValues = Object.fromEntries(
            Object.entries(values).map(([key, value]) => {
              if (
                key === 'aws_access_key_id' ||
                key === 'aws_secret_access_key'
              ) {
                return [key, '********************']
              }
              return [key, value]
            })
          )
          return [section, maskedValues]
        })
      )

      return new Response(JSON.stringify(maskedConfigData), {
        status: 200,
      })
    } else {
      return new Response('Credentials file not found', { status: 404 })
    }
  } catch (error: unknown) {
    console.log(error)
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
      })
    } else {
      return new Response(
        JSON.stringify({ message: 'Unknown error occurred' }),
        {
          status: 500,
        }
      )
    }
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user, aws_access_key_id, aws_secret_access_key } = body

    if (!user || !aws_access_key_id || !aws_secret_access_key) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400 }
      )
    }

    const homeDir = os.homedir()
    const credentialsFilePath = path.join(homeDir, '.aws', 'credentials')

    let configData: {
      [key: string]: {
        aws_access_key_id: string
        aws_secret_access_key: string
      }
    } = {}
    if (fs.existsSync(credentialsFilePath)) {
      const fileContent = fs.readFileSync(credentialsFilePath, 'utf-8')
      configData = ini.parse(fileContent)
    }

    configData[user] = {
      aws_access_key_id,
      aws_secret_access_key,
    }

    const iniContent = ini.encode(configData)

    fs.writeFileSync(credentialsFilePath, iniContent)

    return new Response(
      JSON.stringify({ message: 'User added successfully' }),
      {
        status: 200,
      }
    )
  } catch (error: unknown) {
    console.log(error)
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
      })
    } else {
      return new Response(
        JSON.stringify({ message: 'Unknown error occurred' }),
        {
          status: 500,
        }
      )
    }
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { user, aws_access_key_id, aws_secret_access_key } = body

    if (!user || !aws_access_key_id || !aws_secret_access_key) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }),
        { status: 400 }
      )
    }

    const homeDir = os.homedir()
    const credentialsFilePath = path.join(homeDir, '.aws', 'credentials')

    if (!fs.existsSync(credentialsFilePath)) {
      return new Response('Credentials file not found', { status: 404 })
    }

    const fileContent = fs.readFileSync(credentialsFilePath, 'utf-8')
    const configData = ini.parse(fileContent)

    if (!configData[user]) {
      return new Response(`User '${user}' not found in credentials file`, {
        status: 404,
      })
    }

    configData[user] = {
      aws_access_key_id,
      aws_secret_access_key,
    }

    const iniContent = ini.encode(configData)

    fs.writeFileSync(credentialsFilePath, iniContent)

    return new Response(
      JSON.stringify({ message: 'User updated successfully' }),
      {
        status: 200,
      }
    )
  } catch (error: unknown) {
    console.log(error)
    if (error instanceof Error) {
      return new Response(JSON.stringify({ message: error.message }), {
        status: 500,
      })
    } else {
      return new Response(
        JSON.stringify({ message: 'Unknown error occurred' }),
        {
          status: 500,
        }
      )
    }
  }
}

export async function DELETE(request: Request) {
  try {
    const query = Object.fromEntries(new URL(request.url).searchParams)
    const { user } = query

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'User query parameter is required' }),
        { status: 400 }
      )
    }

    const homeDir = os.homedir()
    const credentialsFilePath = path.join(homeDir, '.aws', 'credentials')

    if (!fs.existsSync(credentialsFilePath)) {
      return new Response('Credentials file not found', { status: 404 })
    }

    const fileContent = fs.readFileSync(credentialsFilePath, 'utf-8')
    const configData = ini.parse(fileContent)

    if (!configData[user]) {
      return new Response(`User '${user}' not found in credentials file`, {
        status: 404,
      })
    }

    delete configData[user]

    const iniContent = ini.encode(configData)
    fs.writeFileSync(credentialsFilePath, iniContent)

    return new Response(
      JSON.stringify({ message: 'User deleted successfully' }),
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting user:', error)
    return new Response(JSON.stringify({ message: 'Internal server error' }), {
      status: 500,
    })
  }
}
