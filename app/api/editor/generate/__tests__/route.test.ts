import { describe, expect, it, vi } from 'vitest'

describe('Editor Generate API', () => {
  it('should require a prompt', async () => {
    const req = new Request('http://localhost:3000/api/editor/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })

    const { POST } = await import('../route')
    const response = await POST(req)

    expect(response.status).toBe(400)
    expect(await response.text()).toBe('Prompt is required')
  })

  it('should accept valid prompt', async () => {
    const req = new Request('http://localhost:3000/api/editor/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: 'Write about AI'
      })
    })

    const { POST } = await import('../route')
    const response = await POST(req)

    // Should return a streaming response
    expect(response.ok).toBe(true)
    expect(response.body).toBeDefined()
  })
})
