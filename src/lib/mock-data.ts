export interface Commit {
  id: string;
  message: string;
  author: string;
  date: string;
}

export interface Project {
  id: string;
  name: string;
  provider: 'github' | 'gitlab';
  lastSync: string;
}

export const MOCK_PROJECTS: Project[] = [
  { id: '1', name: 'nebula-core', provider: 'github', lastSync: '2024-05-20T10:00:00Z' },
  { id: '2', name: 'atlas-ui-kit', provider: 'github', lastSync: '2024-05-18T14:30:00Z' },
];

export const MOCK_COMMITS: Commit[] = [
  { id: 'c1', message: 'feat: add advanced search filtering to dashboard', author: 'jane.doe', date: '2024-05-21T09:00:00Z' },
  { id: 'c2', message: 'fix: resolve memory leak in web-socket handler', author: 'john.smith', date: '2024-05-21T10:15:00Z' },
  { id: 'c3', message: 'perf: optimize image loading in feed component', author: 'jane.doe', date: '2024-05-21T11:45:00Z' },
  { id: 'c4', message: 'chore: update dependency typescript to v5.4', author: 'bot', date: '2024-05-21T13:00:00Z' },
  { id: 'c5', message: 'feat: implement multi-factor authentication flow', author: 'alex.rivera', date: '2024-05-22T08:30:00Z' },
  { id: 'c6', message: 'docs: update architectural diagrams for v2 launch', author: 'alex.rivera', date: '2024-05-22T09:00:00Z' },
];