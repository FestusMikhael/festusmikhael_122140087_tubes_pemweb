from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from .meta import Base

class Status(Base):
    __tablename__ = 'statuses'
    id = Column(Integer, primary_key=True)
    nama = Column(String, nullable=False)

    # Relationship
    films = relationship("Film", back_populates="status")

    # Method to_dict untuk API Response
    def to_dict(self):
        return {
            'id': self.id,
            'nama': self.nama
        }
