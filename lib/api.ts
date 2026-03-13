class ApiError extends Error {
  constructor(public status: number, message: string) { 
    super(message) 
    this.name = 'ApiError'
  }
}

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new ApiError(res.status, text)
  }
  return res.json()
}

// API client for system state endpoints
export const api = {
  systemState: {
    get: async () => {
      return fetchJSON('/api/system-state')
    }
  },
  health: {
    get: async () => {
      return fetchJSON('/api/health')
    }
  }
}

export { fetchJSON, ApiError }
