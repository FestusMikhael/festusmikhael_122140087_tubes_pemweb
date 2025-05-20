from pyramid.request import Request
from pyramid.httpexceptions import HTTPUnauthorized
import jwt

SECRET_KEY = 'secretkey_rahasiamu'

def auth_required(view_callable):
    def wrapper(request: Request):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            raise HTTPUnauthorized('Token tidak ditemukan')

        token = auth_header.split(' ')[1]
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
            request.user_id = payload['user_id']
        except jwt.ExpiredSignatureError:
            raise HTTPUnauthorized('Token kadaluarsa')
        except jwt.InvalidTokenError:
            raise HTTPUnauthorized('Token tidak valid')

        return view_callable(request)
    return wrapper
