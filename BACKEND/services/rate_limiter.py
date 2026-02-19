import os
import time
from functools import wraps
from groq import Groq

# Simple rate limit tracker
class RateLimitTracker:
    def __init__(self):
        self.last_request_time = 0
        self.min_delay = 2  # seconds between requests
        self.daily_tokens_used = 0
        self.daily_limit = 100000
        self.reset_time = time.time() + 86400  # 24 hours
    
    def can_make_request(self, estimated_tokens=2000):
        """Check if we can make a request without hitting rate limit."""
        current_time = time.time()
        
        # Reset daily counter if 24 hours passed
        if current_time > self.reset_time:
            self.daily_tokens_used = 0
            self.reset_time = current_time + 86400
        
        # Check if we'd exceed daily limit
        if self.daily_tokens_used + estimated_tokens > self.daily_limit:
            return False, f"Daily limit would be exceeded. Used: {self.daily_tokens_used}, Limit: {self.daily_limit}"
        
        # Check minimum delay between requests
        if current_time - self.last_request_time < self.min_delay:
            time.sleep(self.min_delay - (current_time - self.last_request_time))
        
        return True, "OK"
    
    def record_request(self, tokens_used):
        """Record that a request was made."""
        self.last_request_time = time.time()
        self.daily_tokens_used += tokens_used

# Global tracker
rate_tracker = RateLimitTracker()

def safe_ai_call(func):
    """Decorator to handle AI API calls safely with rate limiting."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        can_proceed, message = rate_tracker.can_make_request()
        
        if not can_proceed:
            return {
                "error": "rate_limit",
                "message": message,
                "retry_after": "15 minutes"
            }
        
        try:
            result = func(*args, **kwargs)
            # Estimate tokens used (rough approximation)
            estimated_tokens = len(str(result)) // 4
            rate_tracker.record_request(estimated_tokens)
            return result
        except Exception as e:
            error_str = str(e)
            if "429" in error_str or "rate limit" in error_str.lower():
                return {
                    "error": "rate_limit",
                    "message": "AI service temporarily unavailable due to high demand. Please try again in 10-15 minutes.",
                    "retry_after": "15 minutes"
                }
            raise e
    
    return wrapper

# Example usage:
# @safe_ai_call
# def analyze_cv_with_ai(cv_text):
#     ... your AI logic here ...
