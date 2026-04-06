from typing import Any, Optional
from fastapi.responses import JSONResponse


def success_response(
    message: str,
    data: Optional[Any] = None,
    status_code: int = 200
) -> JSONResponse:
    """
    Standardized success response.
    
    Args:
        message: Human-readable success message
        data: Response payload (optional)
        status_code: HTTP status code (default: 200)
    
    Returns:
        JSONResponse with consistent format
    """
    response = {
        "success": True,
        "message": message
    }
    
    if data is not None:
        response["data"] = data
    
    return JSONResponse(status_code=status_code, content=response)


def error_response(
    message: str,
    status_code: int = 400,
    error_code: Optional[str] = None,
    details: Optional[Any] = None
) -> JSONResponse:
    """
    Standardized error response.
    
    Args:
        message: Human-readable error message
        status_code: HTTP status code (default: 400)
        error_code: Machine-readable error code (optional)
        details: Additional error details (optional)
    
    Returns:
        JSONResponse with consistent error format
    """
    response = {
        "success": False,
        "message": message
    }
    
    if error_code:
        response["error_code"] = error_code
    
    if details:
        response["details"] = details
    
    return JSONResponse(status_code=status_code, content=response)


def created_response(
    message: str,
    data: Optional[Any] = None
) -> JSONResponse:
    """
    Standardized response for resource creation.
    
    Args:
        message: Success message
        data: Created resource data (optional)
    
    Returns:
        JSONResponse with 201 status
    """
    return success_response(message=message, data=data, status_code=201)


def paginated_response(
    message: str,
    data: list,
    total: int,
    page: int = 1,
    page_size: int = 20
) -> JSONResponse:
    """
    Standardized paginated response.
    
    Args:
        message: Success message
        data: List of items for current page
        total: Total number of items
        page: Current page number
        page_size: Items per page
    
    Returns:
        JSONResponse with pagination metadata
    """
    total_pages = (total + page_size - 1) // page_size if page_size > 0 else 0
    
    return success_response(
        message=message,
        data={
            "items": data,
            "pagination": {
                "total": total,
                "page": page,
                "page_size": page_size,
                "total_pages": total_pages,
                "has_next": page < total_pages,
                "has_prev": page > 1
            }
        }
    )
