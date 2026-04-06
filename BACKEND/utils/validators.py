from pathlib import Path
from fastapi import HTTPException, UploadFile


def validate_file_extension(file: UploadFile, allowed_extensions: set) -> str:
    """
    Validate file extension against allowed types.
    
    Args:
        file: UploadFile to validate
        allowed_extensions: Set of allowed extensions (e.g., {'.pdf', '.doc', '.docx'})
    
    Returns:
        Lowercase file extension
    
    Raises:
        HTTPException: If file extension is not allowed
    """
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="File must have a valid filename"
        )
    
    file_ext = Path(file.filename).suffix.lower()
    
    if file_ext not in allowed_extensions:
        allowed_str = ", ".join(sorted(allowed_extensions))
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{file_ext}'. Allowed types: {allowed_str}"
        )
    
    return file_ext


def validate_file_size(file_content: bytes, max_size: int) -> None:
    """
    Validate file size against maximum allowed.
    
    Args:
        file_content: File content in bytes
        max_size: Maximum allowed size in bytes
    
    Raises:
        HTTPException: If file exceeds maximum size
    """
    if len(file_content) > max_size:
        max_mb = max_size / (1024 * 1024)
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {max_mb:.0f}MB"
        )


def validate_file_not_empty(file_content: bytes, file_name: str = "file") -> None:
    """
    Validate file is not empty.
    
    Args:
        file_content: File content in bytes
        file_name: Name of file for error message
    
    Raises:
        HTTPException: If file is empty
    """
    if not file_content or len(file_content) == 0:
        raise HTTPException(
            status_code=400,
            detail=f"File '{file_name}' is empty. Please upload a valid file"
        )


def validate_text_content(text: str, min_length: int = 10) -> None:
    """
    Validate extracted text content is sufficient for processing.
    
    Args:
        text: Extracted text from file
        min_length: Minimum required text length
    
    Raises:
        HTTPException: If text is too short
    """
    if not text or len(text.strip()) < min_length:
        raise HTTPException(
            status_code=400,
            detail="Could not extract sufficient text from file. "
                   "Please ensure the file contains readable text"
        )


def validate_job_title(title: str) -> None:
    """
    Validate job title meets requirements.
    
    Args:
        title: Job title string
    
    Raises:
        HTTPException: If title is invalid
    """
    if not title or len(title.strip()) < 3:
        raise HTTPException(
            status_code=400,
            detail="Job title must be at least 3 characters long"
        )
    
    if len(title) > 200:
        raise HTTPException(
            status_code=400,
            detail="Job title must be less than 200 characters"
        )


def validate_job_requirements(requirements: str) -> None:
    """
    Validate job requirements description.
    
    Args:
        requirements: Job requirements text
    
    Raises:
        HTTPException: If requirements are invalid
    """
    if not requirements or len(requirements.strip()) < 20:
        raise HTTPException(
            status_code=400,
            detail="Job requirements must be at least 20 characters long"
        )


def validate_number_of_positions(count: int) -> None:
    """
    Validate number of open positions.
    
    Args:
        count: Number of positions
    
    Raises:
        HTTPException: If count is invalid
    """
    if count < 1:
        raise HTTPException(
            status_code=400,
            detail="Number of positions must be at least 1"
        )
    
    if count > 100:
        raise HTTPException(
            status_code=400,
            detail="Number of positions cannot exceed 100"
        )
