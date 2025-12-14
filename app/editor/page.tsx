'use client'

import NovelEditor from './novel-editor'

export default function EditorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center p-8 sm:p-24">
      <div className="w-full max-w-4xl space-y-4">
        <h1 className="text-3xl font-bold">AI Editor</h1>
        <p className="text-muted-foreground">
          Powered by Novel and Vercel AI SDK
        </p>
        <NovelEditor />
      </div>
    </div>
  )
}
