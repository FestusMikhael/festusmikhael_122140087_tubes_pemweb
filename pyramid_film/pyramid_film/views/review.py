import datetime
from pyramid.view import view_config
from pyramid.httpexceptions import (
    HTTPFound,
    HTTPNotFound,
    HTTPBadRequest,
)
from pyramid.response import Response
from ..models import Review

@view_config(route_name='get_reviews', renderer='json')
def get_reviews(request):
    """Get all reviews."""
    dbsession = request.dbsession
    reviews = dbsession.query(Review).all()
    return {'reviews': [review.to_dict() for review in reviews]}

@view_config(route_name='add_review', renderer='json', request_method='POST')
def add_review(request):
    """Add a new review."""
    data = request.json_body
    dbsession = request.dbsession
    new_review = Review(**data)
    dbsession.add(new_review)
    dbsession.commit()
    return new_review.to_dict()

@view_config(route_name='delete_review', renderer='json', request_method='DELETE')
def delete_review(request):
    """Delete a review."""
    review_id = request.matchdict['id']
    dbsession = request.dbsession
    review = dbsession.query(Review).filter_by(id=review_id).first()
    if review:
        dbsession.delete(review)
        dbsession.commit()
        return Response(status=204)  # Status 204 for successful deletion (no content)
    return Response(status=404, json_body={"message": "Review not found"})
