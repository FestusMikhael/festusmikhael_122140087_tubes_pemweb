import jwt
from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPUnauthorized, HTTPNotFound, HTTPBadRequest
from sqlalchemy.exc import SQLAlchemyError
from ..models import Film
from .auth import SECRET_KEY, require_auth

@view_config(route_name='films', renderer='json', request_method='GET')
@require_auth
def get_films(request):
    user_id = request.user_id
    films = request.dbsession.query(Film).filter_by(user_id=user_id).all()
    return {'films': [film.to_dict() for film in films]}


@view_config(route_name='films', renderer='json', request_method='POST')
@require_auth
def add_film(request):
    user_id = request.user_id
    data = request.json_body

    # Validasi minimal judul dan tahun
    if not data.get('judul') or not data.get('tahun'):
        return HTTPBadRequest(json_body={'error': 'Judul dan tahun wajib diisi'})

    try:
        # Cek duplikasi
        existing = request.dbsession.query(Film).filter_by(
            judul=data.get('judul'),
            tahun=data.get('tahun'),
            user_id=user_id
        ).first()
        if existing:
            return Response(status=400, json_body={"error": "Film sudah ada di koleksi"})

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
        request.dbsession.flush()
        return new_film.to_dict()

    except SQLAlchemyError as e:
        request.dbsession.rollback()
        return Response(status=500, json_body={"error": f"Gagal menyimpan film: {str(e)}"})


@view_config(route_name='film_detail', renderer='json', request_method='GET')
@require_auth
def get_film(request):
    user_id = request.user_id
    film_id = request.matchdict.get('id')
    film = request.dbsession.query(Film).filter_by(id=film_id, user_id=user_id).first()
    if film:
        return film.to_dict()
    return HTTPNotFound(json_body={"error": "Film tidak ditemukan atau bukan milik user"})


@view_config(route_name='film_detail', renderer='json', request_method='PUT')
@require_auth
def update_film(request):
    user_id = request.user_id
    film_id = request.matchdict.get('id')
    film = request.dbsession.query(Film).filter_by(id=film_id, user_id=user_id).first()
    if not film:
        return HTTPNotFound(json_body={"error": "Film tidak ditemukan atau bukan milik user"})

    data = request.json_body
    try:
        for key, value in data.items():
            setattr(film, key, value)
        request.dbsession.flush()
        return film.to_dict()

    except SQLAlchemyError as e:
        request.dbsession.rollback()
        return Response(status=500, json_body={"error": f"Gagal update film: {str(e)}"})


@view_config(route_name='film_detail', renderer='json', request_method='DELETE')
@require_auth
def delete_film(request):
    user_id = request.user_id
    film_id = request.matchdict.get('id')
    try:
        film = request.dbsession.query(Film).filter_by(id=film_id, user_id=user_id).first()
        if not film:
            return HTTPNotFound(json_body={'error': 'Film tidak ditemukan'})

        request.dbsession.delete(film)
        request.dbsession.flush()
        return {'message': 'Film berhasil dihapus'}

    except SQLAlchemyError as e:
        request.dbsession.rollback()
        return Response(status=500, json_body={'error': f'Gagal hapus film: {str(e)}'})
