import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { generateText } from 'ai'

import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { checkAndEnforceQualityLimit } from '@/lib/rate-limit/quality-limit'
import { selectModel } from '@/lib/utils/model-selection'
import { getModel, isProviderEnabled } from '@/lib/utils/registry'

type GenerateOption =
  | 'continue'
  | 'improve'
  | 'shorter'
  | 'longer'
  | 'fix'
  | 'zap'

function buildSystemPrompt(option: GenerateOption): string {
  switch (option) {
    case 'continue':
      return (
        'You are an AI writing assistant that continues existing text based on context from prior text. ' +
        'Give more weight/priority to the later characters than the beginning ones. ' +
        'Limit your response to no more than 200 characters, but make sure to construct complete sentences. ' +
        'Use Markdown formatting when appropriate.'
      )
    case 'improve':
      return (
        'You are an AI writing assistant that improves existing text. ' +
        'Limit your response to no more than 200 characters, but make sure to construct complete sentences. ' +
        'Use Markdown formatting when appropriate.'
      )
    case 'shorter':
      return (
        'You are an AI writing assistant that shortens existing text. ' +
        'Use Markdown formatting when appropriate.'
      )
    case 'longer':
      return (
        'You are an AI writing assistant that lengthens existing text. ' +
        'Use Markdown formatting when appropriate.'
      )
    case 'fix':
      return (
        'You are an AI writing assistant that fixes grammar and spelling errors in existing text. ' +
        'Limit your response to no more than 200 characters, but make sure to construct complete sentences. ' +
        'Use Markdown formatting when appropriate.'
      )
    case 'zap':
      return (
        'You are an AI writing assistant that generates text based on a prompt. ' +
        'You take an input from the user and a command for manipulating the text. ' +
        'Use Markdown formatting when appropriate.'
      )
    default: {
      // This should be unreachable due to runtime validation.
      const _exhaustive: never = option
      return _exhaustive
    }
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const prompt = typeof body?.prompt === 'string' ? body.prompt : ''
    const rawOption = body?.option
    const option: GenerateOption | undefined =
      rawOption === 'continue' ||
      rawOption === 'improve' ||
      rawOption === 'shorter' ||
      rawOption === 'longer' ||
      rawOption === 'fix' ||
      rawOption === 'zap'
        ? rawOption
        : undefined
    const command = typeof body?.command === 'string' ? body.command : ''

    if (!option) {
      return new Response('option is required', { status: 400 })
    }
    if (!prompt.trim()) {
      return new Response('prompt is required', { status: 400 })
    }
    if (option === 'zap' && !command.trim()) {
      return new Response('command is required for zap', { status: 400 })
    }

    const userId = await getCurrentUserId()
    if (!userId) {
      return new Response('Authentication required', { status: 401 })
    }

    const cookieStore = await cookies()
    const selectedModel = selectModel({ cookieStore, searchMode: 'quick' })

    if (!isProviderEnabled(selectedModel.providerId)) {
      return new Response(
        `Selected provider is not enabled ${selectedModel.providerId}`,
        { status: 404 }
      )
    }

    // Reuse Morphic's quality-mode rate limiting
    const modelTypeCookie = cookieStore.get('modelType')?.value
    const isQuality = modelTypeCookie === 'quality'
    const rateLimitResponse = await checkAndEnforceQualityLimit(
      userId,
      isQuality
    )
    if (rateLimitResponse) return rateLimitResponse

    const modelId = `${selectedModel.providerId}:${selectedModel.id}`
    const system = buildSystemPrompt(option)

    const effectivePrompt =
      option === 'zap'
        ? `For this text: ${prompt}. You have to respect the command: ${command}`
        : option === 'improve' ||
            option === 'shorter' ||
            option === 'longer' ||
            option === 'fix'
          ? `The existing text is: ${prompt}`
          : prompt

    const { text } = await generateText({
      model: getModel(modelId),
      system,
      prompt: effectivePrompt,
      temperature: 0.7
    })

    const cleaned = text.trim()
    const limited =
      option === 'continue' || option === 'improve' || option === 'fix'
        ? cleaned.slice(0, 200)
        : cleaned

    return NextResponse.json({ text: limited })
  } catch (error) {
    console.error('AI editor generate error:', error)
    return new Response('Error processing your request', { status: 500 })
  }
}
