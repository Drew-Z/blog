export const siteMeta = {
  name: 'Biau Playlab',
  title: '独立游戏原型与系统设计博客',
  description: '围绕 Godot 游戏原型、系统策划拆解与开发复盘搭建的个人作品展示博客。',
  tagline: '独立游戏原型 / 系统设计 / 开发写作',
  englishTitle: 'Indie Game Prototypes, Systems Design, and Dev Writing',
  englishDescription:
    'A portfolio blog focused on Godot prototypes, systems analysis, and development write-ups, built to show both what was made and how the decisions were formed.',
  githubProfile: 'https://github.com/ciallo-bill',
  repository: 'https://github.com/ciallo-bill/blog',
  rss: '/rss.xml',
  shareImage: '/images/share-cover.svg',
  favicon: '/favicon.svg'
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

export const profileFocusAreas = [
  {
    title: '原型策划与玩法验证',
    ratio: '40%',
    summary: '把核心循环尽快做成可操作原型，再围绕反馈、可读性和阶段目标逐步收成可展示案例。'
  },
  {
    title: '系统拆解与表达组织',
    ratio: '35%',
    summary: '把复杂系统拆成可复用的分析结构，用文章和案例说明判断过程，而不是只给结论。'
  },
  {
    title: '项目收口与展示包装',
    ratio: '25%',
    summary: '把日志、里程碑、截图和浏览路径整理清楚，让外部第一次打开时就能快速建立理解。'
  }
] as const;

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function estimateReadingTime(source: string): string {
  const plainText = source
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/\[[^\]]*]\([^)]+\)/g, ' ')
    .replace(/[#>*_\-\r\n]/g, ' ')
    .replace(/\s+/g, '');

  const charCount = plainText.length;
  const minutes = Math.max(1, Math.ceil(charCount / 450));

  return `${minutes} 分钟阅读`;
}

export function slugifyTag(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/\+/g, ' plus ')
    .replace(/\s+/g, '-')
    .replace(/[^\p{Letter}\p{Number}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
