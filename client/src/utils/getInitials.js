export const getInitials = (name) => {
  if (!name) return "U";

  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 1)
    .join("")
    .toUpperCase();
};