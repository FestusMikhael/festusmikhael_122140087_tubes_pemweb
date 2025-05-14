import datetime
from pyramid.view import view_config
from pyramid.httpexceptions import (
    HTTPNotFound,
    HTTPBadRequest,
)
from pyramid.response import Response
from ..models import Film

@view_config(route_name='get_films', renderer='json')
def get_films(request):
    """Get all films."""
    dbsession = request.dbsession
    films = dbsession.query(Film).all()
    return {'films': [film.to_dict() for film in films]}  # Ensure to_dict() is implemented in Film model

@view_config(route_name='get_film', renderer='json')
def get_film(request):
    """Get a single film by ID."""
    film_id = request.matchdict['id']
    dbsession = request.dbsession
    film = dbsession.query(Film).filter_by(id=film_id).first()
    if film:
        return film.to_dict()  # Return film data in dict format
    return Response(status=404, json_body={"message": "Film not found"})

@view_config(route_name='add_film', renderer='json', request_method='POST')
def add_film(request):
    """Add a new film."""
    data = request.json_body
    dbsession = request.dbsession
    new_film = Film(**data)  # Create a new Film object from JSON data
    dbsession.add(new_film)
    dbsession.commit()
    return new_film.to_dict()  # Return the newly created film

@view_config(route_name='update_film', renderer='json', request_method='PUT')
def update_film(request):
    """Update an existing film."""
    film_id = request.matchdict['id']
    dbsession = request.dbsession
    film = dbsession.query(Film).filter_by(id=film_id).first()
    if film:
        data = request.json_body
        for key, value in data.items():
            setattr(film, key, value)  # Update film fields with new data
        dbsession.commit()
        return film.to_dict()  # Return the updated film
    return Response(status=404, json_body={"message": "Film not found"})

@view_config(route_name='delete_film', renderer='json', request_method='DELETE')
def delete_film(request):
    """Delete a film."""
    film_id = request.matchdict['id']
    dbsession = request.dbsession
    film = dbsession.query(Film).filter_by(id=film_id).first()
    if film:
        dbsession.delete(film)
        dbsession.commit()
        return Response(status=204)  # Return 204 status (No Content) after deletion
    return Response(status=404, json_body={"message": "Film not found"})
