# Novel AI Editor 集成指南

本文档说明如何在 Morphic 项目中使用已集成的 Novel AI Editor。

## 概述

Novel 是一个基于 Tiptap 的所见即所得（WYSIWYG）编辑器，提供 AI 辅助写作功能。我们已将其集成到 Morphic 1.0.0 中，提供强大的文档编辑和 AI 内容生成能力。

## 已完成的集成

### 1. 依赖安装 ✅

已安装的核心包：

- `novel` - Novel 编辑器核心
- `@tiptap/react` - Tiptap React 集成
- `@tiptap/starter-kit` - 基础编辑功能
- `@tiptap/extension-placeholder` - 占位符支持
- `@tiptap/extension-task-list` - 任务列表
- `@tiptap/extension-task-item` - 任务项
- `@tiptap/extension-underline` - 下划线
- `tiptap-markdown` - Markdown 支持

### 2. 组件创建 ✅

创建了两个编辑器组件：

#### NovelEditor (`/components/editor/novel-editor.tsx`)

基础编辑器，提供核心功能

#### AdvancedEditor (`/components/editor/advanced-editor.tsx`)

高级编辑器，包含完整工具栏

### 3. 页面路由 ✅

创建了编辑器页面：

- **路径**: `/editor`
- **文件**: `/app/editor/page.tsx`
- **访问**: 点击侧边栏的 "AI Editor" 菜单项

### 4. API 路由 ✅

创建了 AI 生成 API：

- **路径**: `/api/editor/generate`
- **方法**: POST
- **功能**: 使用 OpenAI 流式生成文本内容

### 5. 导航集成 ✅

在侧边栏添加了编辑器入口：

- 位置：侧边栏顶部菜单
- 图标：Edit3 (笔形图标)
- 文本：AI Editor

## 使用方法

### 访问编辑器

1. 启动开发服务器：

   ```bash
   npm run dev
   # 或
   bun dev
   ```

2. 访问 http://localhost:3000

3. 点击侧边栏的 "AI Editor" 菜单项

### 基本操作

#### 文本格式化

使用工具栏按钮进行文本格式化：

- **粗体**: 点击 B 按钮或 Cmd/Ctrl + B
- **斜体**: 点击 I 按钮或 Cmd/Ctrl + I
- **下划线**: 点击 U 按钮或 Cmd/Ctrl + U
- **删除线**: 点击删除线按钮
- **代码**: 点击代码按钮

#### 标题

- H1: 点击 H1 按钮
- H2: 点击 H2 按钮
- H3: 点击 H3 按钮

#### 列表

- **无序列表**: 点击列表图标
- **有序列表**: 点击数字列表图标
- **引用块**: 点击引用图标

#### AI 生成

1. 输入一些文本作为提示
2. 选择要扩展的文本
3. 点击 "AI 生成" 按钮
4. AI 会实时生成内容

#### 保存和导出

- **保存**: 点击 "保存" 按钮（当前输出到控制台）
- **导出**: 点击 "导出" 按钮下载 HTML 文件

## 配置

### 环境变量

确保在 `.env.local` 中设置：

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

### 自定义 AI 模型

编辑 `/app/api/editor/generate/route.ts`:

```typescript
const result = streamText({
  model: openai('gpt-4o-mini'), // 改为 'gpt-4' 或其他模型
  messages: [
    {
      role: 'system',
      content: '自定义系统提示词'
    }
    // ...
  ],
  temperature: 0.7 // 0.0-1.0, 越高越有创造性
})
```

### 自定义编辑器样式

编辑 `/components/editor/advanced-editor.tsx`:

```typescript
editorProps: {
  attributes: {
    class: 'prose prose-lg dark:prose-invert mx-auto p-8'
    // 调整 prose 大小: prose-sm, prose-base, prose-lg, prose-xl, prose-2xl
  }
}
```

## 目录结构

```
/workspace/
├── app/
│   ├── editor/
│   │   └── page.tsx                    # 编辑器页面
│   └── api/
│       └── editor/
│           └── generate/
│               ├── route.ts            # AI 生成 API
│               └── __tests__/
│                   └── route.test.ts   # API 测试
├── components/
│   └── editor/
│       ├── novel-editor.tsx            # 基础编辑器
│       ├── advanced-editor.tsx         # 高级编辑器
│       ├── index.ts                    # 导出文件
│       └── README.md                   # 组件文档
└── docs/
    ├── EDITOR.md                       # 编辑器功能文档
    └── NOVEL_INTEGRATION.md            # 本文档
```

## 扩展功能

### 添加数据库持久化

在 `app/editor/page.tsx` 中实现保存功能：

```typescript
import { saveDocument } from '@/lib/actions/documents'

export default function EditorPage() {
  const handleSave = async (content: string) => {
    try {
      await saveDocument({
        content,
        userId: user.id,
        // 其他字段...
      })
      toast.success('文档已保存')
    } catch (error) {
      toast.error('保存失败')
    }
  }

  return <AdvancedEditor onSave={handleSave} />
}
```

### 添加协作功能

安装协作扩展：

```bash
npm install @tiptap/extension-collaboration @tiptap/extension-collaboration-cursor --legacy-peer-deps
```

在编辑器中配置：

```typescript
import Collaboration from '@tiptap/extension-collaboration'
import CollaborationCursor from '@tiptap/extension-collaboration-cursor'

const editor = useEditor({
  extensions: [
    // ... 其他扩展
    Collaboration.configure({
      document: ydoc
    }),
    CollaborationCursor.configure({
      provider: provider,
      user: {
        name: 'User Name',
        color: '#f783ac'
      }
    })
  ]
})
```

### 添加图片上传

安装图片扩展：

```bash
npm install @tiptap/extension-image --legacy-peer-deps
```

配置图片上传：

```typescript
import Image from '@tiptap/extension-image'

const editor = useEditor({
  extensions: [
    // ... 其他扩展
    Image.configure({
      inline: true,
      allowBase64: true,
    }),
  ],
})

// 添加上传按钮
<Button onClick={() => {
  const url = window.prompt('图片 URL')
  if (url) {
    editor.chain().focus().setImage({ src: url }).run()
  }
}}>
  上传图片
</Button>
```

## 测试

运行编辑器相关测试：

```bash
npm run test -- editor
```

或运行所有测试：

```bash
npm run test
```

## 故障排查

### 编辑器无法加载

**问题**: 页面显示空白或加载失败

**解决方案**:

1. 检查浏览器控制台错误
2. 确认所有依赖已安装: `npm install --legacy-peer-deps`
3. 清除缓存并重启: `rm -rf .next && npm run dev`

### AI 生成失败

**问题**: 点击 "AI 生成" 无响应或报错

**解决方案**:

1. 检查 `OPENAI_API_KEY` 是否设置
2. 查看网络请求: DevTools > Network
3. 检查 API 路由日志
4. 确认 OpenAI API 配额充足

### 样式显示异常

**问题**: 编辑器样式混乱或不显示

**解决方案**:

1. 确认 Tailwind CSS Typography 已安装
2. 检查 `globals.css` 是否正确导入
3. 验证 prose 类是否生效
4. 检查暗色模式配置

### 依赖冲突

**问题**: 安装依赖时出现版本冲突

**解决方案**:
使用 `--legacy-peer-deps` 标志：

```bash
npm install --legacy-peer-deps
```

## 性能优化建议

1. **懒加载编辑器**: 使用 React.lazy 和 Suspense
2. **虚拟滚动**: 对于长文档实现虚拟滚动
3. **节流保存**: 使用 debounce 限制自动保存频率
4. **代码分割**: 分离编辑器相关代码到独立 chunk

## 下一步

- [ ] 实现数据库持久化
- [ ] 添加文档列表页面
- [ ] 支持文档分享功能
- [ ] 集成多人协作
- [ ] 添加更多 AI 功能（改写、总结、翻译）
- [ ] 支持模板功能
- [ ] 添加版本历史
- [ ] 导出为 PDF/Markdown

## 参考资源

- [Novel 官方文档](https://novel.sh)
- [Tiptap 文档](https://tiptap.dev)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [编辑器组件文档](/components/editor/README.md)
- [功能文档](/docs/EDITOR.md)

## 支持

如有问题或建议，请：

1. 查看本文档和相关文档
2. 检查 GitHub Issues
3. 提交新的 Issue 或 PR

---

**集成日期**: 2025-12-14
**Morphic 版本**: 1.0.0
**Novel 集成**: ✅ 完成
