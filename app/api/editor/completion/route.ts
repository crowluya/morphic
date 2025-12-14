import { cookies } from 'next/headers'
import { streamText } from 'ai'

import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { selectModel } from '@/lib/utils/model-selection'
import { isProviderEnabled, getModel } from '@/lib/utils/registry'

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const userId = await getCurrentUserId()

    if (!userId) {
      return new Response('Authentication required', {
        status: 401,
        statusText: 'Unauthorized'
      })
    }

    const body = await req.json()
    const { prompt, context } = body

    if (!prompt) {
      return new Response('Prompt is required', {
        status: 400,
        statusText: 'Bad Request'
      })
    }

    const cookieStore = await cookies()
    const selectedModel = selectModel({
      cookieStore,
      searchMode: 'quick'
    })

    if (!isProviderEnabled(selectedModel.providerId)) {
      return new Response(
        `Selected provider is not enabled ${selectedModel.providerId}`,
        {
          status: 404,
          statusText: 'Not Found'
        }
      )
    }

    const modelId = `${selectedModel.providerId}:${selectedModel.id}`
    const modelInstance = getModel(modelId)

    // Build the full prompt with context
    const fullPrompt = context
      ? `${context}\n\nContinue writing: ${prompt}`
      : `Continue writing: ${prompt}`

    const result = await streamText({
      model: modelInstance,
      prompt: fullPrompt,
      maxTokens: 500,
      temperature: 0.7
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Editor completion API error:', error)
    return new Response('Error processing completion request', {
      status: 500,
      statusText: 'Internal Server Error'
    })
  }
}
