from pyramid.config import Configurator
from pyramid.view import view_config
from pyramid.response import Response
from .views.auth import register, login
import json

def includeme(config):
    config.add_route('home', '/')
    config.add_static_view('static', 'static', cache_max_age=3600)

    config.add_route('films', '/api/films')
    config.add_route('get_film', '/api/films/{id}', request_method='GET')
    config.add_route('update_film', '/api/films/{id}')
    config.add_route('delete_film', '/api/films/{id}', request_method='DELETE')

    config.add_route('get_statuses', '/api/statuses')
    config.add_route('add_status', '/api/statuses')
    config.add_route('delete_status', '/api/statuses/{id}')

    config.add_route('get_reviews', '/api/reviews')
    config.add_route('add_review', '/api/reviews')
    config.add_route('delete_review', '/api/reviews/{id}')

    config.add_route('register', '/api/register')
    config.add_route('login', '/api/login')
    config.add_route('profile', '/profile')

    # Tidak perlu add_view dan tidak perlu import views
    config.scan()