export const getPlaceholderImage = (text: string, width = 600, height = 600) => {
  const cleanText = encodeURIComponent(text);
  // Teal brand color: #0d9488 (represented as 0d9488 in placehold.co hex format)
  return `https://placehold.co/${width}x${height}/0d9488/ffffff?text=${cleanText}`;
};

export const handleImageError = (
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackText = 'EcoBazar'
) => {
  const img = e.currentTarget;
  const fallback = getPlaceholderImage(fallbackText);
  if (img.src !== fallback) {
    img.src = fallback;
  }
};
