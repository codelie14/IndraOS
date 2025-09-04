from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db import Base
import datetime

class SystemMetrics(Base):
    __tablename__ = "system_metrics"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=func.now(), index=True)
    
    # CPU metrics
    cpu_usage = Column(Float)
    cpu_temperature = Column(Float)
    cpu_frequency = Column(Float)
    
    # Memory metrics
    memory_usage = Column(Float)
    memory_available = Column(Float)
    memory_total = Column(Float)
    
    # Disk metrics
    disk_usage = Column(Float)
    disk_available = Column(Float)
    disk_total = Column(Float)
    
    # Network metrics
    network_in = Column(Float)
    network_out = Column(Float)
    
    # System status
    system_status = Column(String(50), default="operational")
    uptime = Column(Float)

class Process(Base):
    __tablename__ = "processes"
    
    id = Column(Integer, primary_key=True, index=True)
    pid = Column(Integer, unique=True, index=True)
    name = Column(String(255), index=True)
    command = Column(Text)
    cpu_percent = Column(Float)
    memory_percent = Column(Float)
    status = Column(String(50))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class Service(Base):
    __tablename__ = "services"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True)
    display_name = Column(String(255))
    description = Column(Text)
    status = Column(String(50), default="stopped")
    start_type = Column(String(50), default="manual")
    path = Column(String(500))
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class NetworkInterface(Base):
    __tablename__ = "network_interfaces"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True)
    display_name = Column(String(255))
    mac_address = Column(String(17))
    ip_address = Column(String(45))
    netmask = Column(String(45))
    gateway = Column(String(45))
    status = Column(String(50), default="down")
    speed = Column(Integer)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

class SecurityEvent(Base):
    __tablename__ = "security_events"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=func.now(), index=True)
    event_type = Column(String(100), index=True)
    severity = Column(String(50), index=True)
    source = Column(String(255))
    description = Column(Text)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    ip_address = Column(String(45))
    resolved = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
