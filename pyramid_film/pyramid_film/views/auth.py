import datetime
import jwt

from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPUnauthorized
from sqlalchemy.exc import IntegrityError

from ..models.user import User

SECRET_KEY = 'secretkey_rahasiamu'
JWT_ALGORITHM = 'HS256'
JWT_EXP_DELTA_HOURS = 24


@view_config(route_name='register', renderer='json', request_method='POST')
def register(request):
    try:
        data = request.json_body
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return {'error': 'Username, email, dan password wajib diisi'}

        # Cek user sudah ada
        existing_user = request.dbsession.query(User).filter(
            (User.username == username) | (User.email == email)
        ).first()
        if existing_user:
            return {'error': 'Username atau email sudah digunakan'}

        user = User(username=username, email=email)
        user.set_password(password)

        request.dbsession.add(user)
        request.dbsession.flush()

        return {'message': 'Registrasi berhasil', 'user': user.to_dict()}

    except IntegrityError:
        request.dbsession.rollback()
        return {'error': 'Terjadi kesalahan pada database'}


@view_config(route_name='login', renderer='json', request_method='POST')
def login(request):
    data = request.json_body
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return {'error': 'Username dan password wajib diisi'}

    user = request.dbsession.query(User).filter_by(username=username).first()
    if not user or not user.verify_password(password):
        return {'error': 'Username atau password salah'}

    payload = {
        'user_id': user.id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=JWT_EXP_DELTA_HOURS)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)

    return {'message': 'Login berhasil', 'token': token, 'user': user.to_dict()}



def require_auth(view_func):
    def wrapper(request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise HTTPUnauthorized('Authorization header missing or invalid')

        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[JWT_ALGORITHM])
            request.user_id = payload['user_id']
        except jwt.ExpiredSignatureError:
            raise HTTPUnauthorized('Token kadaluarsa')
        except jwt.InvalidTokenError:
            raise HTTPUnauthorized('Token tidak valid')

        return view_func(request)

    return wrapper

@view_config(route_name='register', request_method='OPTIONS')
def register_options_view(request):
    """Response untuk preflight CORS pada register endpoint"""
    return Response(status=200)
