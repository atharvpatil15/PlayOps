export function getInitials(name: string): string {
  if (!name) return "PO";
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function truncate(str: string, length: number): string {
  if (!str || str.length <= length) return str;
  return `${str.slice(0, length)}...`;
}

export function generateQrValue(playerId: string): string {
  return `PLAYOPS-${playerId.replace(/-/g, "").toUpperCase()}`;
}
