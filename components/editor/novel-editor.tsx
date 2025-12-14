'use client'

import { useState } from 'react'

import Placeholder from '@tiptap/extension-placeholder'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Underline from '@tiptap/extension-underline'
import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Sparkles } from 'lucide-react'
import { Markdown } from 'tiptap-markdown'

import { Button } from '@/components/ui/button'

interface NovelEditorProps {
  initialContent?: string
  onSave?: (content: string) => void
}

export function NovelEditor({ initialContent = '', onSave }: NovelEditorProps) {
  const [isGenerating, setIsGenerating] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false
        }
      }),
      Placeholder.configure({
        placeholder: '输入 / 来使用命令，或开始写作...'
      }),
      TaskList,
      TaskItem.configure({
        nested: true
      }),
      Underline,
      Markdown
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-4'
      }
    }
  })

  const handleAIGenerate = async () => {
    if (!editor) return

    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
      '\n'
    )

    if (!selectedText) {
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch('/api/editor/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt: selectedText
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate content')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) return

      let generatedText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        generatedText += chunk

        // Insert the generated text at the cursor position
        editor
          .chain()
          .focus()
          .deleteSelection()
          .insertContent(generatedText)
          .run()
      }
    } catch (error) {
      console.error('Error generating content:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSave = () => {
    if (!editor) return
    const content = editor.getHTML()
    onSave?.(content)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">AI Editor</h1>
        <div className="flex gap-2">
          <Button
            onClick={handleAIGenerate}
            disabled={isGenerating}
            variant="outline"
            size="sm"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isGenerating ? '生成中...' : 'AI 生成'}
          </Button>
          <Button onClick={handleSave} size="sm">
            保存
          </Button>
        </div>
      </div>
      <div className="border rounded-lg bg-background">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
