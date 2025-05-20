from pyramid.view import view_config
from pyramid.response import Response
from sqlalchemy.exc import IntegrityError
from ..models.user import User
import jwt
import datetime

SECRET_KEY = 'secretkey_rahasiamu'

@view_config(route_name='register', renderer='json', request_method='POST')
def register(request):
    try:
        data = request.json_body
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return {'error': 'Username, email, dan password wajib diisi'}

        user = User(username=username, email=email)
        user.set_password(password)

        request.dbsession.add(user)
        request.dbsession.flush()

        return {'message': 'Registrasi berhasil', 'user': user.to_dict()}

    except IntegrityError:
        request.dbsession.rollback()
        return {'error': 'Username atau email sudah digunakan'}

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
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

    return {'message': 'Login berhasil', 'token': token}

@view_config(route_name='register', request_method='OPTIONS')
def register_options_view(request):
    return Response(status=200)