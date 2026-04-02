const SESSION_KEY = 'SESSION_ID';

export function getSessionId(): string | null {
  return sessionStorage.getItem(SESSION_KEY);
}

export function setSessionId(id: string): void {
  sessionStorage.setItem(SESSION_KEY, id);
}

export function removeSessionId(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
