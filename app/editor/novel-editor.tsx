'use client'

import {
  EditorCommand,
  EditorCommandEmpty,
  EditorCommandItem,
  EditorCommandList,
  EditorContent,
  EditorInstance,
  EditorRoot,
  StarterKit,
} from 'novel'
import { useState } from 'react'

const extensions = [StarterKit]

export default function NovelEditor() {
  const [content, setContent] = useState<any>(null)

  return (
    <EditorRoot>
      <EditorContent
        extensions={extensions}
        initialContent={content}
        onUpdate={({ editor }: { editor: EditorInstance }) => {
          setContent(editor.getJSON())
        }}
        className="relative min-h-[500px] w-full max-w-screen-lg border-muted bg-background sm:mb-[calc(20vh)] sm:rounded-lg sm:border sm:shadow-lg"
      >
        <EditorCommand className="z-50 h-auto max-h-[330px] w-72 overflow-y-auto rounded-md border border-muted bg-background px-1 py-2 shadow-md transition-all">
          <EditorCommandEmpty className="px-2 text-muted-foreground">
            No results
          </EditorCommandEmpty>
          <EditorCommandList>
            <EditorCommandItem
              onCommand={({ editor, range }) => {
                editor.chain().focus().deleteRange(range).toggleBold().run()
              }}
            >
              <div className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent">
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                  B
                </div>
                <div>
                  <p className="font-medium">Bold</p>
                  <p className="text-xs text-muted-foreground">
                    Make text bold.
                  </p>
                </div>
              </div>
            </EditorCommandItem>
            <EditorCommandItem
                onCommand={({ editor, range }) => {
                    editor.chain().focus().deleteRange(range).toggleItalic().run()
                }}
                >
                <div className="flex w-full items-center space-x-2 rounded-md px-2 py-1 text-left text-sm hover:bg-accent aria-selected:bg-accent">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md border border-muted bg-background">
                    I
                    </div>
                    <div>
                    <p className="font-medium">Italic</p>
                    <p className="text-xs text-muted-foreground">
                        Make text italic.
                    </p>
                    </div>
                </div>
            </EditorCommandItem>
          </EditorCommandList>
        </EditorCommand>
      </EditorContent>
    </EditorRoot>
  )
}
