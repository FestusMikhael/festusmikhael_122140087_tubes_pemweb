import jwt
from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPUnauthorized
from pyramid.httpexceptions import HTTPNotFound
from ..models import Film
from .auth import SECRET_KEY

def get_current_user_id(request):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        raise HTTPUnauthorized('Missing or invalid Authorization header')

    token = auth_header.split(' ')[1]

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        raise HTTPUnauthorized('Token expired')
    except jwt.InvalidTokenError:
        raise HTTPUnauthorized('Invalid token')

@view_config(route_name='films', renderer='json', request_method='GET')
def get_films(request):
    user_id = get_current_user_id(request)
    films = request.dbsession.query(Film).filter_by(user_id=user_id).all()
    return {'films': [film.to_dict() for film in films]}

@view_config(route_name='films', renderer='json', request_method='POST')
def add_film(request):
    try:
        user_id = get_current_user_id(request)
        data = request.json_body
        data['user_id'] = user_id

        # Cek duplikasi dulu
        existing = request.dbsession.query(Film).filter_by(
            judul=data.get('judul'),
            tahun=data.get('tahun'),
            user_id=user_id
        ).first()
        if existing:
            return Response(status=400, json_body={"message": "Film sudah ada di koleksi"})

        new_film = Film(
            judul=data.get('judul'),
            tahun=data.get('tahun'),
            sutradara=data.get('sutradara', ''),
            genre=data.get('genre', ''),
            poster=data.get('poster', ''),
            sinopsis=data.get('sinopsis', ''),
            user_id=user_id,
        )
        request.dbsession.add(new_film)

        return new_film.to_dict()
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response(status=500, json_body={"message": f"Gagal menyimpan film: {str(e)}"})

@view_config(route_name='get_film', renderer='json')
def get_film(request):
    user_id = get_current_user_id(request)
    film_id = request.matchdict['id']
    film = request.dbsession.query(Film).filter_by(id=film_id, user_id=user_id).first()
    if film:
        return film.to_dict()
    return Response(status=404, json_body={"message": "Film not found or not owned by user"})

@view_config(route_name='update_film', renderer='json', request_method='PUT')
def update_film(request):
    user_id = get_current_user_id(request)
    film_id = request.matchdict['id']
    film = request.dbsession.query(Film).filter_by(id=film_id, user_id=user_id).first()
    if not film:
        return Response(status=404, json_body={"message": "Film not found or not owned by user"})

    data = request.json_body
    for key, value in data.items():
        setattr(film, key, value)

    return film.to_dict()

@view_config(route_name='delete_film', request_method='DELETE', renderer='json')
def delete_film(request):
    try:
        user_id = get_current_user_id(request)
        film_id = int(request.matchdict['id'])
        
        film = request.dbsession.query(Film).filter_by(id=film_id, user_id=user_id).first()
        if not film:
            return HTTPNotFound(json_body={'error': 'Film not found'})

        request.dbsession.delete(film)
        request.dbsession.flush()
        return {'message': 'Film deleted successfully'}
        
    except Exception as e:
        request.dbsession.rollback()
        print(f"DELETE ERROR: {str(e)}")  # Ini akan muncul di terminal server
        return Response(
            status=500,
            json_body={'error': f'Database error: {str(e)}'}
        )


