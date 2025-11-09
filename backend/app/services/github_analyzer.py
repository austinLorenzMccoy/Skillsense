"""
GitHub repository analyzer for skill extraction
Analyzes repos, commits, and languages to infer technical skills
"""
import os
import requests
from typing import List, Dict, Any
from collections import Counter

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")

class GitHubAnalyzer:
    """Analyze GitHub profile and repositories to extract skills"""
    
    def __init__(self, github_url: str):
        self.github_url = github_url
        self.username = self._extract_username(github_url)
        self.headers = {"Authorization": f"token {GITHUB_TOKEN}"} if GITHUB_TOKEN else {}
        
    def _extract_username(self, url: str) -> str:
        """Extract username from GitHub URL"""
        # https://github.com/username -> username
        parts = url.rstrip('/').split('/')
        return parts[-1] if parts else ""
    
    def analyze_profile(self) -> Dict[str, Any]:
        """Analyze complete GitHub profile"""
        try:
            user_data = self._get_user_data()
            repos = self._get_repositories()
            languages = self._analyze_languages(repos)
            skills = self._extract_skills(repos, languages)
            
            return {
                "username": self.username,
                "profile_url": self.github_url,
                "public_repos": user_data.get("public_repos", 0),
                "followers": user_data.get("followers", 0),
                "languages": languages,
                "skills": skills,
                "top_repos": self._get_top_repos(repos),
                "activity_score": self._calculate_activity_score(repos)
            }
        except Exception as e:
            print(f"GitHub analysis error: {e}")
            return {
                "username": self.username,
                "error": str(e),
                "skills": []
            }
    
    def _get_user_data(self) -> Dict:
        """Get user profile data"""
        url = f"https://api.github.com/users/{self.username}"
        response = requests.get(url, headers=self.headers, timeout=10)
        response.raise_for_status()
        return response.json()
    
    def _get_repositories(self) -> List[Dict]:
        """Get user's public repositories"""
        url = f"https://api.github.com/users/{self.username}/repos"
        params = {"sort": "updated", "per_page": 100}
        response = requests.get(url, headers=self.headers, params=params, timeout=10)
        response.raise_for_status()
        return response.json()
    
    def _analyze_languages(self, repos: List[Dict]) -> Dict[str, int]:
        """Analyze programming languages used"""
        language_counter = Counter()
        
        for repo in repos:
            if repo.get("language"):
                language_counter[repo["language"]] += 1
        
        # Convert to percentage
        total = sum(language_counter.values())
        if total == 0:
            return {}
        
        return {
            lang: round((count / total) * 100, 1)
            for lang, count in language_counter.most_common(10)
        }
    
    def _extract_skills(self, repos: List[Dict], languages: Dict[str, int]) -> List[Dict]:
        """Extract skills from repositories and languages"""
        skills = []
        
        # Language-based skills
        for language, percentage in languages.items():
            confidence = min(95, 60 + (percentage * 0.5))  # 60-95% confidence
            skills.append({
                "name": language,
                "category": "hard",
                "confidence": round(confidence, 1),
                "source": "github",
                "evidence": f"Used in {percentage}% of repositories"
            })
        
        # Framework detection from repo names and descriptions
        frameworks = self._detect_frameworks(repos)
        for framework, count in frameworks.items():
            confidence = min(90, 50 + (count * 10))
            skills.append({
                "name": framework,
                "category": "hard",
                "confidence": round(confidence, 1),
                "source": "github",
                "evidence": f"Found in {count} repositories"
            })
        
        # Soft skills from activity
        if len(repos) > 10:
            skills.append({
                "name": "Project Management",
                "category": "soft",
                "confidence": 70,
                "source": "github",
                "evidence": f"Maintains {len(repos)} public repositories"
            })
        
        # Check for collaboration
        collab_repos = [r for r in repos if r.get("forks", 0) > 0 or r.get("stargazers_count", 0) > 5]
        if collab_repos:
            skills.append({
                "name": "Open Source Collaboration",
                "category": "soft",
                "confidence": 75,
                "source": "github",
                "evidence": f"{len(collab_repos)} repositories with community engagement"
            })
        
        return skills
    
    def _detect_frameworks(self, repos: List[Dict]) -> Counter:
        """Detect frameworks from repo names and descriptions"""
        frameworks = Counter()
        
        framework_keywords = {
            "React": ["react", "nextjs", "next.js", "gatsby"],
            "Vue": ["vue", "vuejs", "nuxt"],
            "Angular": ["angular", "@angular"],
            "Django": ["django"],
            "Flask": ["flask"],
            "FastAPI": ["fastapi"],
            "Express": ["express", "expressjs"],
            "Node.js": ["node", "nodejs"],
            "Docker": ["docker", "dockerfile", "container"],
            "Kubernetes": ["k8s", "kubernetes"],
            "TensorFlow": ["tensorflow", "tf"],
            "PyTorch": ["pytorch", "torch"],
            "MongoDB": ["mongo", "mongodb"],
            "PostgreSQL": ["postgres", "postgresql"],
            "Redis": ["redis"],
            "GraphQL": ["graphql"],
            "REST API": ["rest", "api", "restful"],
            "TypeScript": ["typescript", "ts"],
            "Tailwind": ["tailwind", "tailwindcss"],
        }
        
        for repo in repos:
            text = f"{repo.get('name', '')} {repo.get('description', '')}".lower()
            
            for framework, keywords in framework_keywords.items():
                if any(keyword in text for keyword in keywords):
                    frameworks[framework] += 1
        
        return frameworks
    
    def _get_top_repos(self, repos: List[Dict], limit: int = 5) -> List[Dict]:
        """Get top repositories by stars"""
        sorted_repos = sorted(
            repos,
            key=lambda r: r.get("stargazers_count", 0),
            reverse=True
        )
        
        return [
            {
                "name": repo["name"],
                "description": repo.get("description", ""),
                "stars": repo.get("stargazers_count", 0),
                "language": repo.get("language", ""),
                "url": repo["html_url"]
            }
            for repo in sorted_repos[:limit]
        ]
    
    def _calculate_activity_score(self, repos: List[Dict]) -> int:
        """Calculate activity score (0-100)"""
        if not repos:
            return 0
        
        # Factors: number of repos, stars, forks, recent activity
        total_stars = sum(r.get("stargazers_count", 0) for r in repos)
        total_forks = sum(r.get("forks", 0) for r in repos)
        repo_count = len(repos)
        
        # Simple scoring algorithm
        score = min(100, (
            (repo_count * 2) +           # 2 points per repo
            (total_stars * 0.5) +        # 0.5 points per star
            (total_forks * 1)            # 1 point per fork
        ))
        
        return round(score)


def analyze_github_profile(github_url: str) -> Dict[str, Any]:
    """Main function to analyze GitHub profile"""
    analyzer = GitHubAnalyzer(github_url)
    return analyzer.analyze_profile()
