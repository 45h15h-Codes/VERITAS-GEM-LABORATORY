export const resolveImageUrl = (path?: string | null, baseUrl = ""): string => {
  if (!path) return "";

  if (/^(https?:)?\/\//.test(path) || path.startsWith("data:") || path.startsWith("blob:")) {
    return path;
  }

  const cleanBaseUrl = baseUrl.replace(/\/$/, "");
  const cleanPath = path.replace(/^\//, "");

  return `${cleanBaseUrl}/${cleanPath}`;
};
