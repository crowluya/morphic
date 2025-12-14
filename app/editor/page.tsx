import { Suspense } from 'react'

import { AdvancedEditor } from '@/components/editor/advanced-editor'

export const metadata = {
  title: 'AI Editor - Morphic',
  description: 'AI-powered writing editor with Novel'
}

export default function EditorPage() {
  const handleSave = (content: string) => {
    console.log('Saving content:', content)
    // Here you can add logic to save to database
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <Suspense fallback={<div>Loading editor...</div>}>
        <AdvancedEditor onSave={handleSave} />
      </Suspense>
    </div>
  )
}
