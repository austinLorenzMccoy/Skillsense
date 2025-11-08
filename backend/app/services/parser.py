import os
import requests
from typing import List, Optional
from urllib.parse import urlparse
import pdfminer.high_level
from io import BytesIO
import docx
import re

def parse_file(file_path: str) -> str:
    """Parse PDF or DOCX file to text"""
    if file_path.endswith('.pdf'):
        try:
            with open(file_path, 'rb') as f:
                text = pdfminer.high_level.extract_text(f)
            return text
        except Exception as e:
            print(f"Error parsing PDF: {e}")
            return ""
    
    elif file_path.endswith(('.docx', '.doc')):
        try:
            doc = docx.Document(file_path)
            text = ""
            for paragraph in doc.paragraphs:
                text += paragraph.text + "\n"
            return text
        except Exception as e:
            print(f"Error parsing DOCX: {e}")
            return ""
    
    return ""

def fetch_urls_text(urls: List[str]) -> str:
    """Fetch and extract text from URLs (GitHub repos, LinkedIn profiles, blogs)"""
    combined_text = ""
    
    for url in urls:
        try:
            text = fetch_single_url(url)
            combined_text += f"\n--- Content from {url} ---\n{text}\n"
        except Exception as e:
            print(f"Error fetching {url}: {e}")
            combined_text += f"\n--- Error fetching {url}: {str(e)} ---\n"
    
    return combined_text

def fetch_single_url(url: str) -> str:
    """Fetch content from a single URL"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    # Add GitHub token if available and it's a GitHub URL
    if 'github.com' in url and os.getenv('GITHUB_TOKEN'):
        headers['Authorization'] = f'token {os.getenv("GITHUB_TOKEN")}'
    
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()
    
    # For GitHub repos, try to get README
    if 'github.com' in url and '/blob/' not in url:
        return fetch_github_readme(url, headers)
    
    # For other URLs, return basic text extraction
    return extract_text_from_html(response.text)

def fetch_github_readme(repo_url: str, headers: dict) -> str:
    """Fetch README content from GitHub repository"""
    # Convert repo URL to raw README URL
    parsed = urlparse(repo_url)
    path_parts = parsed.path.strip('/').split('/')
    
    if len(path_parts) >= 2:
        owner, repo = path_parts[0], path_parts[1]
        readme_urls = [
            f"https://raw.githubusercontent.com/{owner}/{repo}/main/README.md",
            f"https://raw.githubusercontent.com/{owner}/{repo}/master/README.md"
        ]
        
        for readme_url in readme_urls:
            try:
                response = requests.get(readme_url, headers=headers, timeout=10)
                if response.status_code == 200:
                    return f"Repository: {repo_url}\n\nREADME Content:\n{response.text}"
            except:
                continue
    
    # Fallback to basic repo info
    return f"GitHub Repository: {repo_url}"

def extract_text_from_html(html: str) -> str:
    """Simple HTML text extraction"""
    # Remove HTML tags
    clean = re.sub(r'<[^>]+>', '', html)
    # Remove extra whitespace
    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean[:2000]  # Limit length
