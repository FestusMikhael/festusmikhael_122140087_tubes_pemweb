from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .meta import Base

class Film(Base):
    __tablename__ = 'films'
    id = Column(Integer, primary_key=True)
    judul = Column(String, nullable=False)
    tahun = Column(Integer)
    sutradara = Column(String)
    genre = Column(String)
    status_id = Column(Integer, ForeignKey('statuses.id'))
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)  # ✅ Tambahkan ini
    poster = Column(String, nullable=True)
    sinopsis = Column(String, nullable=True)


    # Relationship
    status = relationship("Status", back_populates="films")
    reviews = relationship("Review", back_populates="film")
    user = relationship("User", back_populates="films")  # ✅ Tambahkan ini untuk relasi 2 arah

    def to_dict(self):
        return {
            'id': self.id,
            'judul': self.judul,
            'tahun': self.tahun,
            'sutradara': self.sutradara,
            'genre': self.genre,
            'status_id': self.status_id,
            'status': self.status.to_dict() if self.status else None,
            'reviews': [review.to_dict() for review in self.reviews],
            'poster': self.poster,
            'sinopsis': self.sinopsis,
            'user_id': self.user_id,
        }
