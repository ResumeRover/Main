from fastapi import Request, HTTPException, Response
import httpx
import logging
from urllib.parse import urljoin

logger = logging.getLogger(__name__)

async def proxy_request(
    request: Request, 
    target_service_url: str, 
    path: str = "",
    include_body: bool = True,
    include_headers: bool = True,
    timeout: int = 30
):
    """
    Proxy a request to another service and return the response
    """
    # Build the target URL
    target_url = urljoin(target_service_url, path)
    
    # Get request body if it exists
    body = b""
    if include_body:
        body = await request.body()
    
    # Get headers to forward
    headers = {}
    if include_headers:
        headers = dict(request.headers)
        # Remove host header as it will be set by httpx
        headers.pop("host", None)
    
    # Get client to use for request
    client = request.app.state.http_client
    
    try:
        logger.info(f"Proxying request to {target_url}")
        response = await client.request(
            method=request.method,
            url=target_url,
            headers=headers,
            content=body,
            params=request.query_params,
            timeout=timeout,
            follow_redirects=True
        )
        
        return Response(
            content=response.content,
            status_code=response.status_code,
            headers=dict(response.headers),
        )
    except httpx.TimeoutException:
        logger.error(f"Timeout while connecting to {target_url}")
        raise HTTPException(status_code=504, detail="Gateway Timeout")
    except httpx.RequestError as exc:
        logger.error(f"Error while connecting to {target_url}: {str(exc)}")
        raise HTTPException(status_code=502, detail="Bad Gateway")