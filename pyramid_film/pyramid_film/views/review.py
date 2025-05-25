from pyramid.view import view_config
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest
from ..models import Review, Film
from .auth import require_auth

@view_config(route_name='user_film_review', renderer='json', request_method='GET')
@require_auth
def get_user_review(request):
    """Get current user's review for a film"""
    film_id = request.matchdict['film_id']
    user_id = request.user_id

    review = request.dbsession.query(Review).filter_by(
        film_id=film_id,
        user_id=user_id
    ).first()

    if not review:
        raise HTTPNotFound(json_body={"error": "Review tidak ditemukan"})

    return {'review': review.to_dict()}

@view_config(route_name='user_film_review', renderer='json', request_method='POST')
@require_auth
def create_user_review(request):
    """Create a new review for a film"""
    film_id = request.matchdict['film_id']
    user_id = request.user_id
    data = request.json_body

    if 'rating' not in data or not (1 <= int(data['rating']) <= 5):
        raise HTTPBadRequest(json_body={"error": "Rating harus antara 1-5"})

    dbsession = request.dbsession

    film = dbsession.query(Film).get(film_id)
    if not film:
        raise HTTPNotFound(json_body={"error": "Film tidak ditemukan"})

    existing = dbsession.query(Review).filter_by(film_id=film_id, user_id=user_id).first()
    if existing:
        raise HTTPBadRequest(json_body={"error": "Review sudah ada. Gunakan PUT untuk memperbarui."})

    review = Review(
        film_id=film_id,
        user_id=user_id,
        komentar=data.get('komentar', ''),
        rating=data['rating']
    )
    dbsession.add(review)
    dbsession.flush()

    return {'review': review.to_dict()}

@view_config(route_name='user_film_review', renderer='json', request_method='PUT')
@require_auth
def update_user_review(request):
    """Update existing user's review"""
    film_id = request.matchdict['film_id']
    user_id = request.user_id
    data = request.json_body

    if 'rating' not in data or not (1 <= int(data['rating']) <= 5):
        raise HTTPBadRequest(json_body={"error": "Rating harus antara 1-5"})

    dbsession = request.dbsession

    review = dbsession.query(Review).filter_by(film_id=film_id, user_id=user_id).first()
    if not review:
        raise HTTPNotFound(json_body={"error": "Review belum ada. Gunakan POST untuk membuat."})

    review.komentar = data.get('komentar', review.komentar)
    review.rating = data['rating']

    dbsession.flush()
    return {'review': review.to_dict()}

@view_config(route_name='review_action', renderer='json', request_method='DELETE')
@require_auth
def delete_review(request):
    """Delete a review"""
    review_id = request.matchdict['review_id']
    user_id = request.user_id

    review = request.dbsession.query(Review).filter_by(id=review_id, user_id=user_id).first()
    if not review:
        raise HTTPNotFound(json_body={"error": "Review tidak ditemukan"})

    request.dbsession.delete(review)
    return {'status': 'success', 'message': 'Review berhasil dihapus'}
