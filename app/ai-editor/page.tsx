'use client'

import { useCallback, useMemo, useState } from 'react'

import {
  CharacterCount,
  EditorContent,
  type EditorInstance,
  EditorRoot,
  type JSONContent,
  MarkdownExtension,
  Placeholder,
  StarterKit,
  useEditor
} from 'novel'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

type GenerateOption =
  | 'continue'
  | 'improve'
  | 'shorter'
  | 'longer'
  | 'fix'
  | 'zap'

const INITIAL_CONTENT: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'heading',
      attrs: { level: 2 },
      content: [{ type: 'text', text: 'AI Editor (Novel)' }]
    },
    {
      type: 'paragraph',
      content: [
        {
          type: 'text',
          text: 'Select some text, then use the AI actions above to rewrite it. Or place your cursor and use Continue to extend the document.'
        }
      ]
    }
  ]
}

function getSelectionText(editor: EditorInstance): {
  text: string
  from: number
  to: number
  isEmpty: boolean
} {
  const { from, to, empty } = editor.state.selection
  const text = empty
    ? ''
    : editor.state.doc.textBetween(from, to, '\n', '\n').trim()
  return { text, from, to, isEmpty: empty }
}

function getTrailingContext(editor: EditorInstance, maxChars: number): string {
  const full = editor.state.doc.textBetween(
    0,
    editor.state.doc.content.size,
    '\n\n',
    '\n\n'
  )
  if (full.length <= maxChars) return full
  return full.slice(-maxChars)
}

function Toolbar() {
  const { editor } = useEditor()
  const [isLoading, setIsLoading] = useState(false)
  const [zapCommand, setZapCommand] = useState(
    'Rewrite in a more concise tone.'
  )
  const [error, setError] = useState<string | null>(null)

  const run = useCallback(
    async (option: GenerateOption) => {
      if (!editor) return

      setError(null)
      setIsLoading(true)

      try {
        const selection = getSelectionText(editor)
        const prompt =
          option === 'continue'
            ? getTrailingContext(editor, 2000)
            : selection.text || getTrailingContext(editor, 2000)

        const res = await fetch('/api/ai-editor/generate', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            option,
            prompt,
            command: option === 'zap' ? zapCommand : undefined
          })
        })

        if (!res.ok) {
          const message = await res.text().catch(() => 'Request failed')
          throw new Error(message)
        }

        const data = (await res.json()) as { text?: string }
        const text = (data.text ?? '').trim()
        if (!text) return

        if (option === 'continue') {
          editor.commands.focus()
          editor.commands.insertContent(text)
          return
        }

        // Replace selection if present; otherwise insert at cursor.
        editor.commands.focus()
        if (!selection.isEmpty && selection.from < selection.to) {
          editor.commands.insertContentAt(
            { from: selection.from, to: selection.to },
            text
          )
        } else {
          editor.commands.insertContent(text)
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    },
    [editor, zapCommand]
  )

  return (
    <Card className="mb-4 p-3">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            disabled={!editor || isLoading}
            onClick={() => run('continue')}
          >
            Continue
          </Button>
          <Button
            variant="secondary"
            disabled={!editor || isLoading}
            onClick={() => run('improve')}
          >
            Improve
          </Button>
          <Button
            variant="secondary"
            disabled={!editor || isLoading}
            onClick={() => run('shorter')}
          >
            Shorter
          </Button>
          <Button
            variant="secondary"
            disabled={!editor || isLoading}
            onClick={() => run('longer')}
          >
            Longer
          </Button>
          <Button
            variant="secondary"
            disabled={!editor || isLoading}
            onClick={() => run('fix')}
          >
            Fix
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button disabled={!editor || isLoading} onClick={() => run('zap')}>
            Zap
          </Button>
        </div>

        <div className="grid gap-2 sm:grid-cols-[140px_1fr] sm:items-center">
          <Label htmlFor="zap-command">Zap command</Label>
          <Input
            id="zap-command"
            value={zapCommand}
            onChange={e => setZapCommand(e.target.value)}
            placeholder="e.g. Rewrite as bullet points"
            disabled={isLoading}
          />
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}
      </div>
    </Card>
  )
}

export default function AiEditorPage() {
  const extensions = useMemo(
    () => [StarterKit, MarkdownExtension, Placeholder, CharacterCount],
    []
  )

  return (
    <div className="mx-auto w-full max-w-screen-lg px-4 py-6">
      <EditorRoot>
        <Toolbar />
        <EditorContent
          initialContent={INITIAL_CONTENT}
          extensions={extensions}
          className="min-h-[60vh] rounded-lg border border-muted bg-background p-4 shadow-sm"
          editorProps={{
            attributes: {
              class:
                'prose prose-lg dark:prose-invert focus:outline-none max-w-full'
            }
          }}
        />
      </EditorRoot>
    </div>
  )
}
