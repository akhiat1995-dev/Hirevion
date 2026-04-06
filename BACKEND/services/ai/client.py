import os
from groq import Groq
from config.settings import settings


class GroqClient:
    """
    Centralized Groq AI client with configuration from settings.
    
    Single point of AI client configuration - easy to swap providers later.
    """

    def __init__(self):
        self.client = Groq(api_key=settings.GROQ_API_KEY)
        self.model = settings.AI_MODEL
        self.temperature = settings.AI_TEMPERATURE
        self.max_tokens = settings.AI_MAX_TOKENS

    def chat_completion(self, system_prompt: str, user_message: str, max_tokens: int = None, temperature: float = None) -> str:
        """
        Send a chat completion request to Groq.
        
        Args:
            system_prompt: System prompt for the AI
            user_message: User message/input
            max_tokens: Override max tokens (uses settings default if None)
            temperature: Override temperature (uses settings default if None)
        
        Returns:
            Response text from the AI
        """
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message}
            ],
            temperature=temperature if temperature is not None else self.temperature,
            max_tokens=max_tokens if max_tokens is not None else self.max_tokens
        )

        return response.choices[0].message.content

    def extract_json_from_response(self, response_text: str) -> str:
        """
        Extract JSON object from AI response that may contain extra text.
        
        Args:
            response_text: Raw response from AI
        
        Returns:
            JSON string extracted from response
        """
        json_start = response_text.find("{")
        json_end = response_text.rfind("}") + 1

        if json_start >= 0 and json_end > json_start:
            return response_text[json_start:json_end]
        
        return response_text


# Global client instance
groq_client = GroqClient()
