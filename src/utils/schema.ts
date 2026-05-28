import { siteMeta } from './site-meta';
import { toSiteUrl } from './site';

export type JsonLdNode = Record<string, unknown>;
export type JsonLdInput = JsonLdNode | JsonLdNode[];

export function serializeJsonLd(data: JsonLdInput): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

export function getAuthorSchema(site: URL | undefined): JsonLdNode {
  return {
    '@type': 'Person',
    '@id': `${toSiteUrl('/about', site)}#person`,
    name: siteMeta.name,
    url: toSiteUrl('/about', site),
    sameAs: [siteMeta.githubProfile]
  };
}

export function getWebSiteSchema(site: URL | undefined): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${toSiteUrl('/', site)}#website`,
    name: siteMeta.name,
    alternateName: siteMeta.title,
    description: siteMeta.description,
    url: toSiteUrl('/', site),
    inLanguage: 'zh-CN',
    publisher: getAuthorSchema(site)
  };
}

export function getProfilePageSchema(site: URL | undefined): JsonLdNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${toSiteUrl('/about', site)}#profile`,
    name: `关于 | ${siteMeta.name}`,
    description: '这个作品展示博客的定位、内容结构与当前关注。',
    url: toSiteUrl('/about', site),
    inLanguage: 'zh-CN',
    mainEntity: getAuthorSchema(site)
  };
}

export function getImageUrl(image: string | undefined, site: URL | undefined): string {
  return toSiteUrl(image ?? siteMeta.shareImage, site);
}
