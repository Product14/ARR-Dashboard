import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Environment helpers for selecting API hosts based on URL param
export type RuntimeEnv = 'uat' | 'prod'

export function getEnvironmentFromLocation(): RuntimeEnv {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const env = params.get('env')
    return env === 'uat' ? 'uat' : 'prod'
  }
  return 'prod'
}

export function getApiHost(env?: RuntimeEnv): string {
  const resolvedEnv = env || getEnvironmentFromLocation()
  return resolvedEnv === 'uat' ? 'https://uat-api.spyne.xyz' : 'https://api.spyne.ai'
}

export function buildExternalApiUrl(path: string, env?: RuntimeEnv): string {
  const base = getApiHost(env)
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

// Read bearer token from the current URL if present
export function getBearerTokenFromLocation(): string | null {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('bearerToken')
    return token && token.trim() ? token : null
  }
  return null
}
