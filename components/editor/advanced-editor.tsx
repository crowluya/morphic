'use client'

import { useState } from 'react'

import Placeholder from '@tiptap/extension-placeholder'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import Underline from '@tiptap/extension-underline'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {
  Bold,
  Code,
  Download,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Save,
  Sparkles,
  Strikethrough,
  Underline as UnderlineIcon,
  Undo
} from 'lucide-react'
import { Markdown } from 'tiptap-markdown'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'

interface AdvancedEditorProps {
  initialContent?: string
  onSave?: (content: string) => void
}

export function AdvancedEditor({
  initialContent = '',
  onSave
}: AdvancedEditorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')

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
        placeholder: ({ node }) => {
          if (node.type.name === 'heading') {
            return '标题...'
          }
          return '输入文本或使用 AI 生成内容...'
        }
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
          'prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert mx-auto focus:outline-none min-h-[600px] max-w-none p-8'
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

    const promptText = selectedText || aiPrompt

    if (!promptText) {
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
          prompt: promptText
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate content')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) return

      // Save the current cursor position
      const { from } = editor.state.selection

      let generatedText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        generatedText += chunk

        // Update the editor with accumulated text
        editor
          .chain()
          .focus()
          .insertContentAt(from, generatedText, {
            updateSelection: true
          })
          .run()
      }

      setAiPrompt('')
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

  const handleExport = () => {
    if (!editor) return
    const content = editor.getHTML()
    const blob = new Blob([content], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'document.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!editor) {
    return null
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Toolbar */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="flex items-center gap-1 p-2 flex-wrap">
          {/* Text Formatting */}
          <Button
            variant={editor.isActive('bold') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('italic') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('underline') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <UnderlineIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('strike') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            disabled={!editor.can().chain().focus().toggleStrike().run()}
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('code') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleCode().run()}
            disabled={!editor.can().chain().focus().toggleCode().run()}
          >
            <Code className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Headings */}
          <Button
            variant={
              editor.isActive('heading', { level: 1 }) ? 'default' : 'ghost'
            }
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant={
              editor.isActive('heading', { level: 2 }) ? 'default' : 'ghost'
            }
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant={
              editor.isActive('heading', { level: 3 }) ? 'default' : 'ghost'
            }
            size="sm"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            <Heading3 className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Lists */}
          <Button
            variant={editor.isActive('bulletList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('orderedList') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant={editor.isActive('blockquote') ? 'default' : 'ghost'}
            size="sm"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <Quote className="h-4 w-4" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Undo/Redo */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
          >
            <Redo className="h-4 w-4" />
          </Button>

          <div className="flex-1" />

          {/* Actions */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleAIGenerate}
            disabled={isGenerating}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? 'AI 生成中...' : 'AI 生成'}
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            导出
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            保存
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto">
          <EditorContent editor={editor} className="h-full" />
        </div>
      </div>
    </div>
  )
}
