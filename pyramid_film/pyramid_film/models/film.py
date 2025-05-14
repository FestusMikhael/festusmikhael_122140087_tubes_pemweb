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

    # Relationship
    status = relationship("Status", back_populates="films")
    reviews = relationship("Review", back_populates="film")

    # Method to_dict untuk API Response
    def to_dict(self):
        return {
            'id': self.id,
            'judul': self.judul,
            'tahun': self.tahun,
            'sutradara': self.sutradara,
            'genre': self.genre,
            'status_id': self.status_id,
            'status': self.status.to_dict() if self.status else None,  # Menambahkan status film
            'reviews': [review.to_dict() for review in self.reviews]  # Menambahkan review film
        }
