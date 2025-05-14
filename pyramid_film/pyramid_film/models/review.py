from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .meta import Base

class Review(Base):
    __tablename__ = 'reviews'
    id = Column(Integer, primary_key=True)
    komentar = Column(String)
    rating = Column(Integer)
    film_id = Column(Integer, ForeignKey('films.id'))

    # Relationship
    film = relationship("Film", back_populates="reviews")

    # Method to_dict untuk API Response
    def to_dict(self):
        return {
            'id': self.id,
            'komentar': self.komentar,
            'rating': self.rating,
            'film_id': self.film_id
        }
