# Novel AI Editor Components

此目录包含集成到 Morphic 的 Novel AI Editor 组件。

## 组件说明

### NovelEditor (`novel-editor.tsx`)

基础编辑器组件，提供核心的富文本编辑和 AI 生成功能。

**特性:**

- 基本富文本编辑
- AI 内容生成
- Markdown 支持
- 任务列表支持

**使用示例:**

```tsx
import { NovelEditor } from '@/components/editor'

export default function MyPage() {
  const handleSave = (content: string) => {
    // 保存逻辑
    console.log('Content:', content)
  }

  return <NovelEditor initialContent="Hello world" onSave={handleSave} />
}
```

### AdvancedEditor (`advanced-editor.tsx`)

高级编辑器组件，包含完整的工具栏和更多编辑功能。

**特性:**

- 完整的格式化工具栏
- 标题支持 (H1, H2, H3)
- 列表和引用
- 撤销/重做
- AI 生成
- HTML 导出

**使用示例:**

```tsx
import { AdvancedEditor } from '@/components/editor'

export default function EditorPage() {
  const handleSave = (content: string) => {
    // 保存到数据库
    saveToDatabase(content)
  }

  return (
    <div className="h-screen">
      <AdvancedEditor onSave={handleSave} />
    </div>
  )
}
```

## Props

### NovelEditor Props

| Prop           | Type                      | Required | Description      |
| -------------- | ------------------------- | -------- | ---------------- |
| initialContent | string                    | No       | 初始内容（HTML） |
| onSave         | (content: string) => void | No       | 保存回调函数     |

### AdvancedEditor Props

| Prop           | Type                      | Required | Description      |
| -------------- | ------------------------- | -------- | ---------------- |
| initialContent | string                    | No       | 初始内容（HTML） |
| onSave         | (content: string) => void | No       | 保存回调函数     |

## 键盘快捷键

- `Cmd/Ctrl + B` - 粗体
- `Cmd/Ctrl + I` - 斜体
- `Cmd/Ctrl + U` - 下划线
- `Cmd/Ctrl + Z` - 撤销
- `Cmd/Ctrl + Shift + Z` - 重做
- `Cmd/Ctrl + Shift + X` - 删除线

## AI 功能

编辑器使用 OpenAI API 来生成内容。需要确保 `OPENAI_API_KEY` 环境变量已正确设置。

### 使用 AI 生成

1. 选择要扩展的文本
2. 点击 "AI 生成" 按钮
3. AI 会基于选中的文本生成相关内容

### 自定义 AI 行为

编辑 `/app/api/editor/generate/route.ts` 来自定义 AI 的行为：

```typescript
const result = streamText({
  model: openai('gpt-4o-mini'),
  messages: [
    {
      role: 'system',
      content: '你的自定义系统提示词'
    },
    {
      role: 'user',
      content: `Continue or improve this text: ${prompt}`
    }
  ],
  temperature: 0.7 // 调整创造性
})
```

## 样式自定义

编辑器使用 Tailwind CSS 的 Typography 插件来渲染富文本内容。你可以通过修改 `editorProps` 来自定义样式：

```tsx
editorProps: {
  attributes: {
    class: 'prose prose-lg dark:prose-invert mx-auto p-4'
  }
}
```

## Tiptap 扩展

当前集成的扩展：

- `StarterKit` - 基础编辑功能
- `Placeholder` - 占位符文本
- `TaskList` / `TaskItem` - 任务列表
- `Underline` - 下划线
- `Markdown` - Markdown 支持

### 添加新扩展

```bash
npm install @tiptap/extension-{extension-name} --legacy-peer-deps
```

然后在编辑器配置中添加：

```tsx
const editor = useEditor({
  extensions: [
    // ... 现有扩展
    YourExtension.configure({
      // 配置选项
    })
  ]
})
```

## 性能优化

对于大型文档：

1. 使用 `useMemo` 缓存编辑器配置
2. 实现虚拟滚动
3. 延迟加载扩展
4. 使用 `debounce` 处理自动保存

## 故障排查

### 编辑器无法加载

确保所有依赖已安装：

```bash
npm install --legacy-peer-deps
```

### AI 生成失败

检查环境变量：

```bash
echo $OPENAI_API_KEY
```

### 样式问题

确保 Tailwind 配置包含 Typography 插件：

```js
// tailwind.config.js
module.exports = {
  plugins: [require('@tailwindcss/typography')]
}
```
