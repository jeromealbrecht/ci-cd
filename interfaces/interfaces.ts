export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  created_at: string;
}

export interface GitHubRepo {
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
}

export interface GitHubStatsProps {
  username: string;
}

export interface GitHubData {
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  avatar_url: string;
  login: string;
}

export interface GitHubStatsProps {
  username: string;
}
