export type RouteType = 'home' | 'subject' | 'read';

export interface RouteState {
  type: RouteType;
  subjectId?: string;
  itemId?: string;
}

export function parseHash(hash: string): RouteState {
  const cleanHash = hash.replace(/^#\/?/, '').trim();
  if (!cleanHash || cleanHash === '/' || cleanHash === 'home') {
    return { type: 'home' };
  }

  const parts = cleanHash.split('/');

  if (parts[0] === 'subject' && parts[1]) {
    return { type: 'subject', subjectId: parts[1] };
  }

  if (parts[0] === 'read' && parts[1]) {
    return { type: 'read', itemId: parts[1] };
  }

  // Backward compatibility / legacy route fallback
  return { type: 'read', itemId: parts[0] };
}

export function buildHash(state: RouteState): string {
  if (state.type === 'home') return '#/';
  if (state.type === 'subject') return `#/subject/${state.subjectId}`;
  if (state.type === 'read') return `#/read/${state.itemId}`;
  return '#/';
}
