from pyramid.config import Configurator
from pyramid.view import view_config
from pyramid.response import Response
from .views.auth import register, login
import json

def includeme(config):
    config.add_route('home', '/')
    config.add_static_view('static', 'static', cache_max_age=3600)

    config.add_route('films', '/api/films')
    config.add_route('film_detail', '/api/films/{id}')

    config.add_route('statuses', '/api/statuses')
    config.add_route('status_detail', '/api/statuses/{id}')

    config.add_route('user_film_review', '/api/films/{film_id}/my-review')
    config.add_route('review_action', '/api/reviews/{review_id}')
    
    config.add_route('register', '/api/register')
    config.add_route('login', '/api/login')
    config.add_route('profile', '/profile')

    config.scan()