import { streamText } from 'ai'
import { getModel } from '@/lib/utils/registry'
import { DEFAULT_MODEL } from '@/lib/utils/model-selection'

export const maxDuration = 60

export async function POST(req: Request) {
  const { prompt } = await req.json()

  // Use the default model for autocompletion
  // We construct the model ID as "provider:model-name"
  const modelId = `${DEFAULT_MODEL.providerId}:${DEFAULT_MODEL.id}`
  const model = getModel(modelId)

  const result = await streamText({
    model,
    prompt: prompt,
    // Novel expects a text stream for completion
  })

  return result.toTextStreamResponse()
}
