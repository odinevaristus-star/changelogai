'use server';

/**
 * @fileOverview Server actions for interacting with the GitHub API.
 */

export async function fetchGitHubRepos(token: string) {
  try {
    const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=10', {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch repositories');
    }

    const repos = await response.json();
    return repos.map((repo: any) => ({
      id: repo.id.toString(),
      name: repo.full_name,
      provider: 'github' as const,
      lastSync: repo.updated_at,
      url: repo.html_url,
    }));
  } catch (error: any) {
    console.error('GitHub API Error:', error);
    throw new Error(error.message || 'An unexpected error occurred');
  }
}
