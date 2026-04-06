export const formatScore = (score) => {
  if (score >= 90) return { label: "Excellent", color: "text-green-600", bg: "bg-green-100", percentage: score };
  if (score >= 75) return { label: "Good", color: "text-blue-600", bg: "bg-blue-100", percentage: score };
  if (score >= 60) return { label: "Average", color: "text-yellow-600", bg: "bg-yellow-100", percentage: score };
  if (score >= 40) return { label: "Below Average", color: "text-orange-600", bg: "bg-orange-100", percentage: score };
  return { label: "Poor", color: "text-red-600", bg: "bg-red-100", percentage: score };
};

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export const formatJobTitle = (title) => {
  if (!title) return "N/A";
  return title
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const formatSkillTag = (skill) => {
  if (!skill) return "";
  return skill.trim().replace(/\s+/g, " ");
};
