from fastapi import APIRouter, Path, status

router = APIRouter()

@router.get("",
            status_code=status.HTTP_200_OK,
            summary="Health check endpoint")
async def health_check():
    """Health check endpoint for container health monitoring"""
    return {"status": "healthy", "service": "python-backend"}