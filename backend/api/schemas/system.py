from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Base schemas
class SystemInfo(BaseModel):
    status: str
    version: str
    uptime: Optional[float] = None
    last_update: Optional[datetime] = None

class SystemMetricsBase(BaseModel):
    cpu_usage: Optional[float] = None
    cpu_temperature: Optional[float] = None
    cpu_frequency: Optional[float] = None
    memory_usage: Optional[float] = None
    memory_available: Optional[float] = None
    memory_total: Optional[float] = None
    disk_usage: Optional[float] = None
    disk_available: Optional[float] = None
    disk_total: Optional[float] = None
    network_in: Optional[float] = None
    network_out: Optional[float] = None
    system_status: str = "operational"
    uptime: Optional[float] = None

class SystemMetricsCreate(SystemMetricsBase):
    pass

class SystemMetrics(SystemMetricsBase):
    id: int
    timestamp: datetime
    
    class Config:
        from_attributes = True

class ProcessBase(BaseModel):
    pid: int
    name: str
    command: Optional[str] = None
    cpu_percent: Optional[float] = None
    memory_percent: Optional[float] = None
    status: Optional[str] = None

class ProcessCreate(ProcessBase):
    pass

class Process(ProcessBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class ServiceBase(BaseModel):
    name: str
    display_name: Optional[str] = None
    description: Optional[str] = None
    status: str = "stopped"
    start_type: str = "manual"
    path: Optional[str] = None

class ServiceCreate(ServiceBase):
    pass

class Service(ServiceBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class NetworkInterfaceBase(BaseModel):
    name: str
    display_name: Optional[str] = None
    mac_address: Optional[str] = None
    ip_address: Optional[str] = None
    netmask: Optional[str] = None
    gateway: Optional[str] = None
    status: str = "down"
    speed: Optional[int] = None

class NetworkInterfaceCreate(NetworkInterfaceBase):
    pass

class NetworkInterface(NetworkInterfaceBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

class SecurityEventBase(BaseModel):
    event_type: str
    severity: str
    source: Optional[str] = None
    description: str
    ip_address: Optional[str] = None
    resolved: bool = False

class SecurityEventCreate(SecurityEventBase):
    pass

class SecurityEvent(SecurityEventBase):
    id: int
    timestamp: datetime
    user_id: Optional[int] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Response schemas
class SystemOverview(BaseModel):
    system_info: SystemInfo
    current_metrics: Optional[SystemMetrics] = None
    active_processes_count: int
    running_services_count: int
    network_interfaces_count: int
    security_alerts_count: int

class ProcessList(BaseModel):
    processes: List[Process]
    total: int
    page: int
    size: int

class ServiceList(BaseModel):
    services: List[Service]
    total: int
    page: int
    size: int

class NetworkInterfaceList(BaseModel):
    interfaces: List[NetworkInterface]
    total: int
    page: int
    size: int

class SecurityEventList(BaseModel):
    events: List[SecurityEvent]
    total: int
    page: int
    size: int
