from pyramid.config import Configurator
from pyramid.response import Response
from pyramid.events import NewResponse

def add_cors_headers(event):
    """Add CORS headers to all responses"""
    if event.request.path.startswith('/api'):
        event.response.headers.update({
            'Access-Control-Allow-Origin': 'http://localhost:5173',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Max-Age': '86400'
        })

def options_view(request):
    """Explicit OPTIONS handler"""
    response = Response()
    response.headers.update({
        'Access-Control-Allow-Origin': 'http://localhost:5173',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
    })
    return response

def main(global_config, **settings):
    config = Configurator(settings=settings)
    
    # Explicit OPTIONS route - MUST come first!
    config.add_route('options', '/api/{path:.*}', request_method='OPTIONS')
    config.add_view(options_view, route_name='options')
    
    # Include other components
    config.include('pyramid_jinja2')
    config.include('.models')
    config.include('.routes')
    
    # Add CORS headers to all responses
    config.add_subscriber(add_cors_headers, NewResponse)
    
    config.scan()
    return config.make_wsgi_app()