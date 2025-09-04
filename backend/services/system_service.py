import psutil
import platform
from datetime import datetime
from typing import Optional, List
from sqlalchemy.orm import Session
from models.system import SystemMetrics
from api.schemas.system import SystemMetricsCreate, SystemInfo
from core.config import settings

class SystemService:
    
    @staticmethod
    def get_system_info() -> SystemInfo:
        """Get basic system information"""
        try:
            uptime = psutil.boot_time()
            current_time = datetime.now().timestamp()
            uptime_seconds = current_time - uptime
            
            return SystemInfo(
                status="operational",
                version=settings.api_version,
                uptime=uptime_seconds,
                last_update=datetime.now()
            )
        except Exception as e:
            return SystemInfo(
                status="error",
                version=settings.api_version,
                uptime=None,
                last_update=datetime.now()
            )
    
    @staticmethod
    def collect_system_metrics() -> SystemMetricsCreate:
        """Collect current system metrics"""
        try:
            # CPU metrics
            cpu_usage = psutil.cpu_percent(interval=1)
            cpu_freq = psutil.cpu_freq()
            cpu_frequency = cpu_freq.current if cpu_freq else None
            
            # Memory metrics
            memory = psutil.virtual_memory()
            memory_usage = memory.percent
            memory_available = memory.available / (1024**3)  # GB
            memory_total = memory.total / (1024**3)  # GB
            
            # Disk metrics
            disk = psutil.disk_usage('/')
            disk_usage = disk.percent
            disk_available = disk.free / (1024**3)  # GB
            disk_total = disk.total / (1024**3)  # GB
            
            # Network metrics
            network = psutil.net_io_counters()
            network_in = network.bytes_recv / (1024**2)  # MB
            network_out = network.bytes_sent / (1024**2)  # MB
            
            # Uptime
            uptime = psutil.boot_time()
            current_time = datetime.now().timestamp()
            uptime_seconds = current_time - uptime
            
            return SystemMetricsCreate(
                cpu_usage=cpu_usage,
                cpu_frequency=cpu_frequency,
                memory_usage=memory_usage,
                memory_available=memory_available,
                memory_total=memory_total,
                disk_usage=disk_usage,
                disk_available=disk_available,
                disk_total=disk_total,
                network_in=network_in,
                network_out=network_out,
                system_status="operational",
                uptime=uptime_seconds
            )
        except Exception as e:
            # Return default metrics in case of error
            return SystemMetricsCreate(
                system_status="error",
                uptime=0
            )
    
    @staticmethod
    def save_metrics(db: Session, metrics: SystemMetricsCreate) -> SystemMetrics:
        """Save system metrics to database"""
        db_metrics = SystemMetrics(**metrics.dict())
        db.add(db_metrics)
        db.commit()
        db.refresh(db_metrics)
        return db_metrics
    
    @staticmethod
    def get_latest_metrics(db: Session) -> Optional[SystemMetrics]:
        """Get the latest system metrics from database"""
        return db.query(SystemMetrics).order_by(SystemMetrics.timestamp.desc()).first()
    
    @staticmethod
    def get_metrics_history(db: Session, limit: int = 100) -> List[SystemMetrics]:
        """Get system metrics history"""
        return db.query(SystemMetrics).order_by(SystemMetrics.timestamp.desc()).limit(limit).all()
    
    @staticmethod
    def get_system_overview(db: Session):
        """Get comprehensive system overview"""
        from models import Process, Service, NetworkInterface, SecurityEvent
        
        # Get latest metrics
        current_metrics = SystemService.get_latest_metrics(db)
        
        # Count active processes
        active_processes_count = db.query(Process).filter(Process.status == "running").count()
        
        # Count running services
        running_services_count = db.query(Service).filter(Service.status == "running").count()
        
        # Count network interfaces
        network_interfaces_count = db.query(NetworkInterface).count()
        
        # Count security alerts
        security_alerts_count = db.query(SecurityEvent).filter(
            SecurityEvent.resolved == False,
            SecurityEvent.severity.in_(["high", "critical"])
        ).count()
        
        return {
            "system_info": SystemService.get_system_info(),
            "current_metrics": current_metrics,
            "active_processes_count": active_processes_count,
            "running_services_count": running_services_count,
            "network_interfaces_count": network_interfaces_count,
            "security_alerts_count": security_alerts_count
        }
