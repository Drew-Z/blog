export function withBase(path: string): string {
  const normalizedPath = path === "/" ? "/" : `/${path.replace(/^\/+/, "")}`;
  const baseUrl = import.meta.env.BASE_URL || "/";
  const normalizedBase = baseUrl === "/" ? "" : baseUrl.replace(/\/$/, "");

  if (normalizedPath === "/") {
    return normalizedBase ? `${normalizedBase}/` : "/";
  }

  return `${normalizedBase}${normalizedPath}`;
}
