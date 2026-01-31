export const getImageUrl = (url: string) => {
  const initial = "https://localhost:44309";
  if (url.startsWith("http")) {
    return url; // already absolute
  }
  return `${initial}/${url}`;
};
