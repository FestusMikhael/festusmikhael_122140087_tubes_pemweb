from pyramid.config import Configurator
from pyramid.view import view_config
from pyramid.response import Response
import json

def includeme(config):
    config.add_route('home', '/')
    # Static view (untuk file-file statis seperti CSS/JS)
    config.add_static_view('static', 'static', cache_max_age=3600)

    # Routes untuk API
    config.add_route('get_films', '/api/films')
    config.add_route('get_film', '/api/films/{id}')
    config.add_route('add_film', '/api/films')
    config.add_route('update_film', '/api/films/{id}')
    config.add_route('delete_film', '/api/films/{id}')
    
    config.add_route('get_statuses', '/api/statuses')
    config.add_route('add_status', '/api/statuses')
    config.add_route('delete_status', '/api/statuses/{id}')
    
    config.add_route('get_reviews', '/api/reviews')
    config.add_route('add_review', '/api/reviews')
    config.add_route('delete_review', '/api/reviews/{id}')

    # Views harus didaftarkan untuk setiap route
    config.scan()
