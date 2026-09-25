export function formatDisplayText(text: string): string {
  return text.trim();
}

export function getDisplayTextFromHistory(history: any[]): string {
  return history.map(item => item.content || item.text || '').join('\n');
}

export function formatJSONString(obj: any): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (error) {
    return String(obj);
  }
}