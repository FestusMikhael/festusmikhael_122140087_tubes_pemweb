import datetime
from pyramid.view import view_config
from pyramid.httpexceptions import (
    HTTPFound,
    HTTPNotFound,
    HTTPBadRequest,
)
from ..models import Status, Film


@view_config(route_name='get_statuses', renderer='json')
def get_statuses(request):
    """Get all statuses."""
    dbsession = request.dbsession
    statuses = dbsession.query(Status).all()
    return {'statuses': [status.to_dict() for status in statuses]}


@view_config(route_name='add_status', renderer='json', request_method='POST')
def add_status(request):
    """Add a new status."""
    data = request.json_body
    dbsession = request.dbsession
    new_status = Status(**data)
    dbsession.add(new_status)
    dbsession.commit()
    return new_status.to_dict()


@view_config(route_name='delete_status', renderer='json', request_method='DELETE')
def delete_status(request):
    """Delete a status."""
    status_id = request.matchdict['id']
    dbsession = request.dbsession
    status = dbsession.query(Status).filter_by(id=status_id).first()
    if status:
        dbsession.delete(status)
        dbsession.commit()
        return HTTPFound(location='/api/statuses')  # Redirect to statuses list
    return HTTPNotFound(json_body={"message": "Status not found"})

