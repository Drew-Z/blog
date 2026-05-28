function isPassthroughPath(path: string): boolean {
  return /^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith('#') || path.startsWith('mailto:') || path.startsWith('tel:');
}

export function withBase(path: string): string {
  if (!path) {
    return '/';
  }

  if (isPassthroughPath(path)) {
    return path;
  }

  const normalizedPath = path === "/" ? "/" : `/${path.replace(/^\/+/, "")}`;
  const baseUrl = import.meta.env.BASE_URL || "/";
  const normalizedBase = baseUrl === "/" ? "" : baseUrl.replace(/\/$/, "");

  if (normalizedPath === "/") {
    return normalizedBase ? `${normalizedBase}/` : "/";
  }

  return `${normalizedBase}${normalizedPath}`;
}

export function toSiteUrl(path: string, site: URL | undefined): string {
  return new URL(withBase(path), site ?? 'https://blog.playlab.eu.cc').toString();
}
