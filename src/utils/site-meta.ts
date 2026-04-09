export const siteMeta = {
  name: 'Biau Playlab',
  title: '独立游戏原型与系统设计博客',
  description: '围绕 Godot 游戏原型、系统策划拆解与开发复盘搭建的个人作品展示博客。',
  tagline: '独立游戏原型 / 系统设计 / 开发写作'
};

export const navLinks = [
  { href: '/', label: '首页' },
  { href: '/games', label: '作品' },
  { href: '/logs', label: '日志' },
  { href: '/articles', label: '文章' },
  { href: '/about', label: '关于' }
];

export const gameStatusLabels: Record<string, string> = {
  prototype: '原型阶段',
  playable: '可玩验证',
  showcase: '展示版本',
  ongoing: '持续迭代'
};

export const devlogProjectLabels: Record<string, string> = {
  'game-first-tetris': 'Game First Tetris',
  'game-next-spacewar': 'Game Next Spacewar',
  'blog-platform': 'Blog Platform'
};

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
