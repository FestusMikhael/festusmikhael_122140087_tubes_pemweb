from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .meta import Base

class Film(Base):
    __tablename__ = 'films'
    id = Column(Integer, primary_key=True)
    imdb_id = Column(String, unique=True, nullable=True)
    judul = Column(String, nullable=False)
    tahun = Column(Integer)
    sutradara = Column(String)
    genre = Column(String)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    poster = Column(String, nullable=True)
    sinopsis = Column(String, nullable=True)

    # Relationship
    reviews = relationship("Review", back_populates="film")
    user = relationship("User", back_populates="films")
    statuses = relationship("Status", back_populates="film", cascade="all, delete-orphan")


    def to_dict(self):
        return {
            'id': self.id,
            'imdb_id': self.imdb_id,
            'judul': self.judul,
            'tahun': self.tahun,
            'sutradara': self.sutradara,
            'genre': self.genre,
            'reviews': [review.to_dict() for review in self.reviews],
            'poster': self.poster,
            'sinopsis': self.sinopsis,
            'user_id': self.user_id,
        }
