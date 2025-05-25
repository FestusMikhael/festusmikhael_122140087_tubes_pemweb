from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .meta import Base

class Review(Base):
    __tablename__ = 'reviews'
    id = Column(Integer, primary_key=True)
    komentar = Column(String)
    rating = Column(Integer)
    film_id = Column(Integer, ForeignKey('films.id'))
    user_id = Column(Integer, ForeignKey('users.id'))  # Add this line

    # Relationships
    film = relationship("Film", back_populates="reviews")
    user = relationship("User", back_populates="reviews")
    
    def to_dict(self):
        return {
            'id': self.id,
            'komentar': self.komentar,
            'rating': self.rating,
            'film_id': self.film_id,
            'user_id': self.user_id  # Add this line
        }