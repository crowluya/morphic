import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

export const runtime = 'edge'
export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return new Response('Prompt is required', { status: 400 })
    }

    const result = streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful writing assistant. Help users expand, improve, and refine their writing. Provide creative and coherent continuations based on the context.'
        },
        {
          role: 'user',
          content: `Continue or improve this text: ${prompt}`
        }
      ],
      temperature: 0.7
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Error in generate API:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
