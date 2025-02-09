# 构建阶段
FROM node:18-alpine

# 使用阿里云镜像源
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
RUN apk add --no-cache git

# 安装 pnpm
RUN npm install -g pnpm

WORKDIR /app

# 设置 npm 镜像源
RUN echo "registry=https://registry.npmmirror.com" > .npmrc && \
    echo "shamefully-hoist=true" >> .npmrc

# 复制项目文件
COPY . .

# 安装依赖
RUN pnpm install

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV PORT=3000
ENV NODE_ENV=development

# 启动开发服务器
CMD ["pnpm", "dev"]
