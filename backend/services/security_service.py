import psutil
import socket
import datetime
from typing import List, Optional
from sqlalchemy.orm import Session
from models.system import SecurityEvent
from api.schemas.system import SecurityEventCreate

class SecurityService:
    
    @staticmethod
    def create_security_event(
        db: Session,
        event_type: str,
        severity: str,
        description: str,
        source: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_id: Optional[int] = None
    ) -> SecurityEvent:
        """Create a new security event"""
        security_event = SecurityEvent(
            event_type=event_type,
            severity=severity,
            source=source,
            description=description,
            ip_address=ip_address,
            user_id=user_id,
            resolved=False
        )
        
        db.add(security_event)
        db.commit()
        db.refresh(security_event)
        return security_event
    
    @staticmethod
    def get_security_events(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        severity: Optional[str] = None,
        resolved: Optional[bool] = None
    ) -> List[SecurityEvent]:
        """Get security events with filtering"""
        query = db.query(SecurityEvent)
        
        if severity:
            query = query.filter(SecurityEvent.severity == severity)
        
        if resolved is not None:
            query = query.filter(SecurityEvent.resolved == resolved)
        
        return query.order_by(SecurityEvent.timestamp.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_security_event_by_id(db: Session, event_id: int) -> Optional[SecurityEvent]:
        """Get security event by ID"""
        return db.query(SecurityEvent).filter(SecurityEvent.id == event_id).first()
    
    @staticmethod
    def mark_event_resolved(db: Session, event_id: int) -> bool:
        """Mark a security event as resolved"""
        event = SecurityService.get_security_event_by_id(db, event_id)
        if not event:
            return False
        
        event.resolved = True
        db.commit()
        return True
    
    @staticmethod
    def delete_security_event(db: Session, event_id: int) -> bool:
        """Delete a security event"""
        event = SecurityService.get_security_event_by_id(db, event_id)
        if not event:
            return False
        
        db.delete(event)
        db.commit()
        return True
    
    @staticmethod
    def get_security_stats(db: Session):
        """Get security statistics"""
        total_events = db.query(SecurityEvent).count()
        critical_events = db.query(SecurityEvent).filter(
            SecurityEvent.severity == "critical",
            SecurityEvent.resolved == False
        ).count()
        high_events = db.query(SecurityEvent).filter(
            SecurityEvent.severity == "high",
            SecurityEvent.resolved == False
        ).count()
        resolved_events = db.query(SecurityEvent).filter(
            SecurityEvent.resolved == True
        ).count()
        
        return {
            "total_events": total_events,
            "critical_events": critical_events,
            "high_events": high_events,
            "resolved_events": resolved_events,
            "unresolved_events": total_events - resolved_events
        }
    
    @staticmethod
    def scan_for_suspicious_activity(db: Session):
        """Scan for suspicious system activity"""
        events = []
        
        try:
            # Check for unusual CPU usage
            cpu_percent = psutil.cpu_percent(interval=1)
            if cpu_percent > 90:
                events.append(SecurityEventCreate(
                    event_type="high_cpu_usage",
                    severity="medium",
                    source="system_monitor",
                    description=f"CPU usage is unusually high: {cpu_percent}%",
                    ip_address=None
                ))
            
            # Check for unusual memory usage
            memory = psutil.virtual_memory()
            if memory.percent > 95:
                events.append(SecurityEventCreate(
                    event_type="high_memory_usage",
                    severity="medium",
                    source="system_monitor",
                    description=f"Memory usage is critically high: {memory.percent}%",
                    ip_address=None
                ))
            
            # Check for unusual disk usage
            disk = psutil.disk_usage('/')
            if disk.percent > 95:
                events.append(SecurityEventCreate(
                    event_type="high_disk_usage",
                    severity="medium",
                    source="system_monitor",
                    description=f"Disk usage is critically high: {disk.percent}%",
                    ip_address=None
                ))
            
            # Check for unusual network activity
            network = psutil.net_io_counters()
            # This would need baseline comparison in a real implementation
            
        except Exception as e:
            events.append(SecurityEventCreate(
                event_type="security_scan_error",
                severity="low",
                source="security_service",
                description=f"Error during security scan: {str(e)}",
                ip_address=None
            ))
        
        return events
    
    @staticmethod
    def get_security_event_count(db: Session) -> int:
        """Get total security event count"""
        return db.query(SecurityEvent).count()
    
    @staticmethod
    def get_unresolved_events_count(db: Session) -> int:
        """Get count of unresolved events"""
        return db.query(SecurityEvent).filter(SecurityEvent.resolved == False).count()
    
    @staticmethod
    def get_critical_events_count(db: Session) -> int:
        """Get count of critical events"""
        return db.query(SecurityEvent).filter(
            SecurityEvent.severity == "critical",
            SecurityEvent.resolved == False
        ).count()
