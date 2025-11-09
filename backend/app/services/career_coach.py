"""
AI Career Coach using Groq API
Provides personalized career advice, skill recommendations, and learning paths
"""
import os
from typing import List, Dict, Any
from groq import Groq

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

class CareerCoach:
    """AI-powered career coaching using Groq LLM"""
    
    def __init__(self):
        self.client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None
        self.model = "mixtral-8x7b-32768"  # Fast, capable model
    
    def analyze_skill_gaps(self, current_skills: List[Dict], target_role: str = "Senior Developer") -> Dict[str, Any]:
        """Analyze skill gaps for a target role"""
        if not self.client:
            return {"error": "Groq API not configured"}
        
        skills_text = ", ".join([s.get("name", "") for s in current_skills[:10]])
        
        prompt = f"""You are an expert career coach. Analyze these skills and provide recommendations for becoming a {target_role}.

Current Skills: {skills_text}

Provide a JSON response with:
1. missing_skills: List of 5 critical skills they should learn
2. learning_priority: Order skills by importance (1-5)
3. estimated_time: Time to learn each skill (weeks)
4. resources: Recommended learning resources
5. career_advice: 2-3 sentences of personalized advice

Format as valid JSON."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=1000
            )
            
            advice = response.choices[0].message.content
            
            # Parse response (simplified - in production, use proper JSON parsing)
            return {
                "target_role": target_role,
                "analysis": advice,
                "generated_at": "now"
            }
        except Exception as e:
            return {"error": str(e)}
    
    def get_learning_path(self, skill_name: str) -> Dict[str, Any]:
        """Get personalized learning path for a skill"""
        if not self.client:
            return {"error": "Groq API not configured"}
        
        prompt = f"""Create a detailed learning path for mastering {skill_name}.

Provide:
1. Beginner steps (1-2 weeks)
2. Intermediate steps (2-4 weeks)
3. Advanced steps (4-8 weeks)
4. Project ideas to practice
5. Best resources (courses, books, tutorials)

Be specific and actionable. Format as clear sections."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=1500
            )
            
            return {
                "skill": skill_name,
                "learning_path": response.choices[0].message.content,
                "estimated_weeks": "8-12"
            }
        except Exception as e:
            return {"error": str(e)}
    
    def get_salary_insights(self, skills: List[Dict], location: str = "United States") -> Dict[str, Any]:
        """Get salary insights based on skills"""
        if not self.client:
            return {"error": "Groq API not configured"}
        
        skills_text = ", ".join([s.get("name", "") for s in skills[:10]])
        
        prompt = f"""As a career advisor, estimate salary ranges for someone with these skills in {location}:

Skills: {skills_text}

Provide:
1. Junior level salary range
2. Mid-level salary range
3. Senior level salary range
4. High-demand skills that increase salary
5. Salary growth tips

Use realistic market data. Be specific with numbers."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.5,
                max_tokens=800
            )
            
            return {
                "location": location,
                "insights": response.choices[0].message.content
            }
        except Exception as e:
            return {"error": str(e)}
    
    def get_interview_prep(self, skills: List[Dict], job_title: str) -> Dict[str, Any]:
        """Get interview preparation advice"""
        if not self.client:
            return {"error": "Groq API not configured"}
        
        skills_text = ", ".join([s.get("name", "") for s in skills[:8]])
        
        prompt = f"""Prepare interview questions and tips for a {job_title} role with these skills:

Skills: {skills_text}

Provide:
1. 5 technical questions they should prepare for
2. 3 behavioral questions
3. How to showcase their skills
4. Common mistakes to avoid
5. Negotiation tips

Be practical and specific."""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7,
                max_tokens=1200
            )
            
            return {
                "job_title": job_title,
                "prep_guide": response.choices[0].message.content
            }
        except Exception as e:
            return {"error": str(e)}
    
    def get_daily_insight(self, user_skills: List[Dict]) -> str:
        """Get a daily career insight"""
        if not self.client:
            return "Configure Groq API to get personalized insights!"
        
        skills_text = ", ".join([s.get("name", "") for s in user_skills[:5]])
        
        prompt = f"""Give one actionable career tip for someone with skills in: {skills_text}

Make it:
- Specific and actionable
- Under 100 words
- Motivating and practical
- Related to their skills"""

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.8,
                max_tokens=150
            )
            
            return response.choices[0].message.content
        except Exception as e:
            return f"Error: {str(e)}"


# Convenience function
def get_career_advice(skills: List[Dict], advice_type: str = "gap_analysis", **kwargs) -> Dict[str, Any]:
    """Get career advice from AI coach"""
    coach = CareerCoach()
    
    if advice_type == "gap_analysis":
        return coach.analyze_skill_gaps(skills, kwargs.get("target_role", "Senior Developer"))
    elif advice_type == "learning_path":
        return coach.get_learning_path(kwargs.get("skill_name", "Python"))
    elif advice_type == "salary":
        return coach.get_salary_insights(skills, kwargs.get("location", "United States"))
    elif advice_type == "interview":
        return coach.get_interview_prep(skills, kwargs.get("job_title", "Software Engineer"))
    elif advice_type == "daily":
        return {"insight": coach.get_daily_insight(skills)}
    else:
        return {"error": "Unknown advice type"}
