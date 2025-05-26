from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest
from sqlalchemy.exc import SQLAlchemyError
from ..models import Status
from .auth import require_auth

@view_config(route_name='statuses', renderer='json', request_method='GET')
@require_auth
def get_statuses(request):
    user_id = request.user_id
    film_id = request.GET.get('film_id')

    query = request.dbsession.query(Status).filter_by(user_id=user_id)
    if film_id:
        query = query.filter_by(film_id=film_id)

    statuses = query.all()
    return {'statuses': [status.to_dict() for status in statuses]}

@view_config(route_name='statuses', renderer='json', request_method='POST')
@require_auth
def add_status(request):
    data = request.json_body
    user_id = request.user_id

    if not data.get('status') or not data.get('film_id'):
        return HTTPBadRequest(json_body={'error': 'Field status dan film_id wajib diisi'})

    try:
        # Cek apakah status untuk user dan film ini sudah ada
        existing = request.dbsession.query(Status).filter_by(
            user_id=user_id,
            film_id=data['film_id']
        ).first()
        if existing:
            return HTTPBadRequest(json_body={'error': 'Status untuk film ini sudah ada'})

        new_status = Status(
            status=data['status'],
            user_id=user_id,
            film_id=data['film_id'],
        )
        request.dbsession.add(new_status)
        request.dbsession.flush()
        return new_status.to_dict()

    except SQLAlchemyError as e:
        request.dbsession.rollback()
        return HTTPBadRequest(json_body={'error': f'Gagal menyimpan status: {str(e)}'})

@view_config(route_name='status_detail', renderer='json', request_method='DELETE')
@require_auth
def delete_status(request):
    user_id = request.user_id
    status_id = request.matchdict.get('id')

    status = request.dbsession.query(Status).filter_by(
        id=status_id,
        user_id=user_id
    ).first()

    if not status:
        return HTTPNotFound(json_body={'error': 'Status tidak ditemukan'})

    try:
        request.dbsession.delete(status)
        request.dbsession.flush()
        return {'message': 'Status berhasil dihapus'}
    except SQLAlchemyError as e:
        request.dbsession.rollback()
        return HTTPBadRequest(json_body={'error': f'Gagal menghapus status: {str(e)}'})

@view_config(route_name='status_detail', request_method='PUT', renderer='json')
@require_auth
def update_status(request):
    status_id = request.matchdict.get('id')
    user_id = request.user_id
    data = request.json_body

    if not data.get('status'):
        return HTTPBadRequest(json_body={'error': 'Field status wajib diisi'})

    status = request.dbsession.query(Status).filter_by(
        id=status_id,
        user_id=user_id
    ).first()

    if not status:
        return HTTPNotFound(json_body={'error': 'Status tidak ditemukan'})

    try:
        status.status = data['status']
        request.dbsession.flush()
        return status.to_dict()
    except SQLAlchemyError as e:
        request.dbsession.rollback()
        return HTTPBadRequest(json_body={'error': f'Gagal update status: {str(e)}'})
