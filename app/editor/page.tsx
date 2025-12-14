'use client'

import {
  EditorRoot,
  EditorContent,
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  ImageResizer,
  handleCommandNavigation,
  createSuggestionItems,
  useEditor,
  StarterKit,
  Placeholder,
  HorizontalRule,
  UpdatedImage,
  type JSONContent
} from 'novel'
import { useEffect, useState } from 'react'
import { useCompletion } from 'ai/react'
import { FileText, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code, CheckSquare } from 'lucide-react'

// Create suggestion items for slash commands
const suggestionItems = createSuggestionItems([
  {
    title: 'Text',
    description: 'Start writing with plain text.',
    icon: <FileText size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleNode('paragraph', 'paragraph')
        .run()
    }
  },
  {
    title: 'Heading 1',
    description: 'Big section heading.',
    icon: <Heading1 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 1 })
        .run()
    }
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading.',
    icon: <Heading2 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 2 })
        .run()
    }
  },
  {
    title: 'Heading 3',
    description: 'Small section heading.',
    icon: <Heading3 size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode('heading', { level: 3 })
        .run()
    }
  },
  {
    title: 'Bullet List',
    description: 'Create a simple bullet list.',
    icon: <List size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleBulletList()
        .run()
    }
  },
  {
    title: 'Numbered List',
    description: 'Create a list with numbering.',
    icon: <ListOrdered size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleOrderedList()
        .run()
    }
  },
  {
    title: 'Quote',
    description: 'Capture a quote.',
    icon: <Quote size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleBlockquote()
        .run()
    }
  },
  {
    title: 'Code',
    description: 'Capture a code snippet.',
    icon: <Code size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleCodeBlock()
        .run()
    }
  },
  {
    title: 'Task List',
    description: 'Track tasks with a to-do list.',
    icon: <CheckSquare size={18} />,
    command: ({ editor, range }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .toggleTaskList()
        .run()
    }
  }
])

const extensions = [
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
        return `Heading ${node.attrs.level}`
      }
      return "Press '/' for commands, or start writing..."
    },
    includeChildren: true
  }),
  HorizontalRule,
  UpdatedImage
]

export default function EditorPage() {
  const [content, setContent] = useState<JSONContent>()
  const [completionStartPos, setCompletionStartPos] = useState<number | null>(null)

  const { complete, completion, isLoading } = useCompletion({
    api: '/api/editor/completion',
    onFinish: () => {
      setCompletionStartPos(null)
    }
  })

  const { editor } = useEditor({
    extensions,
    editorProps: {
      handleDOMEvents: {
        keydown: (_view, event) => handleCommandNavigation(event)
      }
    },
    autofocus: 'end',
    onUpdate: ({ editor }) => {
      const json = editor.getJSON()
      setContent(json)
    },
    initialContent: content
  })

  // Handle AI completion - insert completion text as it streams
  useEffect(() => {
    if (!editor || !completion || completionStartPos === null) return

    // Replace text from completion start position
    const { from } = editor.state.selection
    const endPos = completionStartPos + completion.length
    
    // Delete old completion and insert new one
    editor.commands.deleteRange({ from: completionStartPos, to: from })
    editor.commands.insertContentAt(completionStartPos, completion)
    editor.commands.setTextSelection(completionStartPos + completion.length)
  }, [completion, editor, completionStartPos])

  // Trigger completion on specific key combinations
  useEffect(() => {
    if (!editor) return

    const handleKeyDown = (event: KeyboardEvent) => {
      // Trigger completion with Ctrl+Space or Cmd+Space
      if ((event.ctrlKey || event.metaKey) && event.key === ' ') {
        event.preventDefault()
        const { from } = editor.state.selection
        const context = editor.getText().slice(0, from)
        const prompt = context.slice(-50) // Last 50 chars as prompt
        
        // Set completion start position
        setCompletionStartPos(from)
        
        complete(prompt, {
          body: {
            prompt,
            context: context.slice(-200) // Last 200 chars as context
          }
        })
      }
    }

    // Attach to editor's DOM instead of window
    const editorElement = editor.view.dom
    editorElement.addEventListener('keydown', handleKeyDown as any)
    return () => {
      editorElement.removeEventListener('keydown', handleKeyDown as any)
    }
  }, [editor, complete])

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading editor...</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-1 overflow-auto p-4 sm:p-8">
        <EditorRoot>
          <EditorContent
            editor={editor}
            className="min-h-[500px] w-full max-w-none sm:mb-[calc(20vh)] sm:rounded-lg border-stone-200 bg-white sm:border sm:shadow-lg prose prose-lg sm:prose-lg lg:prose-xl focus:outline-none max-w-full"
          />
          <EditorCommand className="z-50 h-auto max-h-[330px] overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
            <EditorCommandEmpty className="px-2 text-muted-foreground">No results</EditorCommandEmpty>
            <EditorCommandList>
              {suggestionItems.map((item) => (
                <EditorCommandItem
                  value={item.title}
                  onCommand={({ editor, range }) => {
                    item.command?.({ editor, range })
                  }}
                  className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent"
                  key={item.title}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                </EditorCommandItem>
              ))}
            </EditorCommandList>
          </EditorCommand>
          <ImageResizer />
        </EditorRoot>
        {isLoading && (
          <div className="fixed bottom-4 right-4 px-4 py-2 bg-background border rounded-md shadow-lg">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
              <span className="text-sm text-muted-foreground">AI is writing...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
