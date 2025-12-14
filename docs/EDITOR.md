# AI Editor Integration

此文档说明如何使用集成到 Morphic 的 Novel AI Editor。

## 功能特性

### 编辑器功能

- **富文本编辑**: 支持粗体、斜体、下划线、删除线等基本格式
- **标题**: 支持 H1、H2、H3 三级标题
- **列表**: 支持有序列表、无序列表和任务列表
- **引用块**: 支持引用文本块
- **代码**: 支持行内代码和代码块
- **撤销/重做**: 完整的编辑历史管理

### AI 功能

- **AI 内容生成**: 基于提示词或选中文本生成内容
- **流式响应**: 实时显示 AI 生成的内容
- **上下文感知**: AI 会根据当前文档内容提供相关建议

### 导入/导出

- **HTML 导出**: 将文档导出为 HTML 文件
- **Markdown 支持**: 编辑器支持 Markdown 语法

## 使用方法

### 访问编辑器

1. 启动 Morphic 应用
2. 在侧边栏点击 "AI Editor" 菜单项
3. 开始编写或使用 AI 生成内容

### 使用 AI 生成

1. 输入文本或选择要扩展的内容
2. 点击工具栏的 "AI 生成" 按钮
3. AI 会基于上下文生成相关内容

### 格式化文本

- 使用工具栏按钮进行文本格式化
- 支持键盘快捷键（标准文本编辑器快捷键）

### 保存文档

- 点击 "保存" 按钮保存当前文档
- 点击 "导出" 按钮下载 HTML 文件

## 技术架构

### 依赖包

- `@tiptap/react`: Tiptap 编辑器核心
- `@tiptap/starter-kit`: 基础扩展包
- `@tiptap/extension-*`: 各种编辑器扩展
- `tiptap-markdown`: Markdown 支持
- `novel`: Novel 编辑器组件

### API 路由

- `POST /api/editor/generate`: AI 内容生成接口
  - 请求体: `{ prompt: string }`
  - 响应: 流式文本响应

### 组件结构

```
components/editor/
  ├── novel-editor.tsx        # 基础编辑器组件
  └── advanced-editor.tsx     # 高级编辑器（带工具栏）

app/editor/
  └── page.tsx                # 编辑器页面

app/api/editor/
  └── generate/
      └── route.ts            # AI 生成 API
```

## 自定义配置

### 修改 AI 模型

编辑 `/app/api/editor/generate/route.ts`:

```typescript
const result = streamText({
  model: openai('gpt-4o-mini') // 更改为其他模型
  // ...
})
```

### 添加扩展

在编辑器组件中添加新的 Tiptap 扩展:

```typescript
const editor = useEditor({
  extensions: [
    // ... 现有扩展
    YourNewExtension.configure({
      // 配置选项
    })
  ]
})
```

### 自定义工具栏

在 `advanced-editor.tsx` 中修改工具栏组件，添加新的按钮或功能。

## 开发建议

1. **性能优化**: 对于大型文档，考虑使用虚拟滚动
2. **持久化**: 实现自动保存到数据库的功能
3. **协作**: 可以集成 Tiptap Collaboration 扩展实现多人协作
4. **版本控制**: 添加文档版本历史功能

## 故障排查

### 编辑器不显示

- 检查浏览器控制台是否有错误
- 确认所有依赖已正确安装
- 验证 OPENAI_API_KEY 环境变量已设置

### AI 生成失败

- 检查 API 密钥是否有效
- 查看网络请求是否成功
- 检查 API 路由日志

### 样式问题

- 确认 Tailwind CSS 配置正确
- 检查 prose 类是否正确应用
- 验证暗色模式配置

## 未来计划

- [ ] 添加图片上传功能
- [ ] 支持表格编辑
- [ ] 集成语法检查
- [ ] 添加协作编辑功能
- [ ] 支持更多导出格式（PDF、Markdown）
- [ ] AI 辅助写作建议
- [ ] 文档模板功能
