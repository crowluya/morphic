# 🎨 AI Editor Feature - NEW!

## Overview

Morphic now includes a powerful AI-powered text editor based on [Novel](https://github.com/steven-tey/novel) and Tiptap, providing an intuitive writing experience with AI assistance.

## Access the Editor

Click **"AI Editor"** in the sidebar to access the new editor feature.

## Key Features

### ✨ Rich Text Editing

- **Formatting**: Bold, Italic, Underline, Strikethrough
- **Headings**: H1, H2, H3
- **Lists**: Bulleted, Numbered, Task lists
- **Blocks**: Quotes, Code blocks
- **History**: Full Undo/Redo support

### 🤖 AI-Powered Content Generation

- Select text and click "AI Generate" to expand content
- Streaming responses for real-time feedback
- Context-aware generation
- Powered by OpenAI GPT models

### 💾 Export & Save

- Export documents as HTML
- Save functionality (console output, ready for database integration)
- Markdown support

### 🎨 Modern UI

- Clean, distraction-free interface
- Full toolbar with formatting options
- Dark mode support
- Responsive design

## Quick Start

1. **Set up API Key**:

   ```bash
   echo "OPENAI_API_KEY=your_key_here" >> .env.local
   ```

2. **Start the server**:

   ```bash
   npm run dev
   ```

3. **Access the editor**:
   - Open http://localhost:3000
   - Click "AI Editor" in the sidebar
   - Start writing!

## Documentation

- 📚 [Quick Start Guide](./docs/QUICKSTART_EDITOR.md) - Get started in 5 minutes
- 📖 [Feature Documentation](./docs/EDITOR.md) - Complete feature guide
- 🔧 [Integration Guide](./docs/NOVEL_INTEGRATION.md) - Technical details
- 💻 [Component API](./components/editor/README.md) - Developer reference

## Example Use Cases

- ✍️ **Blog Writing**: Draft and refine blog posts with AI assistance
- 📝 **Note Taking**: Create structured notes with formatting
- 💡 **Brainstorming**: Generate ideas and expand concepts
- 📖 **Creative Writing**: Write stories with AI co-author
- 📋 **Task Lists**: Organize todos with checkboxes

## Technical Details

- **Framework**: Next.js 16 + React 19
- **Editor**: Tiptap + Novel
- **AI**: Vercel AI SDK + OpenAI
- **Styling**: Tailwind CSS + Typography
- **Runtime**: Edge Runtime for fast responses

## Architecture

```
/app/editor/           → Editor page route
/app/api/editor/       → AI generation API
/components/editor/    → Editor components
  ├── novel-editor.tsx       → Basic editor
  └── advanced-editor.tsx    → Full-featured editor with toolbar
```

## Keyboard Shortcuts

- `Cmd/Ctrl + B` - Bold
- `Cmd/Ctrl + I` - Italic
- `Cmd/Ctrl + U` - Underline
- `Cmd/Ctrl + Z` - Undo
- `Cmd/Ctrl + Shift + Z` - Redo

## Configuration

### Change AI Model

Edit `/app/api/editor/generate/route.ts`:

```typescript
model: openai('gpt-4') // Change to any OpenAI model
```

### Customize Editor Style

Edit component's `editorProps.attributes.class`:

```typescript
class: 'prose prose-lg dark:prose-invert mx-auto p-8'
```

## Future Enhancements

- [ ] Database persistence
- [ ] Document management
- [ ] Real-time collaboration
- [ ] Image upload
- [ ] Table support
- [ ] PDF export
- [ ] Version history

## Integration Status

✅ **Completed** - December 14, 2025

All features are production-ready and fully integrated into Morphic 1.0.0.

## Get Help

- Check [Quick Start Guide](./docs/QUICKSTART_EDITOR.md)
- Read [Troubleshooting](./docs/NOVEL_INTEGRATION.md#故障排查)
- Open a GitHub Issue

---

**Happy Writing with AI! 🚀**
