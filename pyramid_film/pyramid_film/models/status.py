from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from .meta import Base

class Status(Base):
    __tablename__ = 'statuses'
    id = Column(Integer, primary_key=True)
    status = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    film_id = Column(Integer, ForeignKey('films.id'), nullable=False)

    # Relationship
    user = relationship("User", back_populates="statuses")
    film = relationship("Film", back_populates="statuses")

    __table_args__ = (
        UniqueConstraint('user_id', 'film_id', name='user_film_unique'),
    )

    def to_dict(self):
        return {
            'id': self.id,
            'status': self.status,
            'user_id': self.user_id,
            'film_id': self.film_id,
        }
