"""Flask extensions initialized without an app context."""

from flask_jwt_extended import JWTManager
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask_marshmallow import Marshmallow
from flask_migrate import Migrate
from flask_smorest import Api
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()
migrate = Migrate()
ma = Marshmallow()
jwt = JWTManager()
api = Api()
limiter = Limiter(
    key_func=get_remote_address,
    default_limits=["100 per minute"],
)
