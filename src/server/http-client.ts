import nodeFetch from 'node-fetch'
import type { RequestInfo, RequestInit, Response } from 'node-fetch'

export type FetchFunction = (input: RequestInfo, init?: RequestInit) => Promise<Response>

export interface HttpClient {
  fetch(input: RequestInfo, init?: RequestInit): Promise<Response>
}

export class FetchClient implements HttpClient {
  private fetchFn: FetchFunction

  constructor(fetchFn?: FetchFunction) {
    this.fetchFn = fetchFn ?? nodeFetch
  }

  fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    return this.fetchFn(input, init)
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function requestJson(
  client: HttpClient,
  url: string,
  init?: RequestInit,
  retries = 2
): Promise<unknown> {
  let lastError: unknown
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const response = await client.fetch(url, init)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText} for ${url}`)
      }
      return response.json()
    } catch (error) {
      lastError = error
      if (attempt === retries) break
      await delay(200 * Math.pow(2, attempt))
    }
  }
  throw lastError
}

export const defaultHttpClient = new FetchClient()
