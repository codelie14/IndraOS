import psutil
import subprocess
from typing import List, Optional
from sqlalchemy.orm import Session
from models.system import Service
from api.schemas.system import ServiceCreate

class ServiceService:
    
    @staticmethod
    def get_system_services() -> List[ServiceCreate]:
        """Get system services information"""
        services = []
        try:
            # On Windows, we can use sc query or Get-Service
            # For now, return a basic list
            if hasattr(psutil, 'win_service_iter'):
                # Windows services
                for service in psutil.win_service_iter():
                    try:
                        services.append(ServiceCreate(
                            name=service.name(),
                            display_name=service.display_name(),
                            description=service.description() or "",
                            status=service.status(),
                            start_type=service.start_type(),
                            path=service.binpath() or ""
                        ))
                    except (psutil.NoSuchProcess, psutil.AccessDenied):
                        continue
            else:
                # Linux/Unix services - basic implementation
                # You might want to use systemctl or service commands
                pass
                
        except Exception as e:
            pass
        
        return services
    
    @staticmethod
    def sync_services(db: Session) -> int:
        """Sync current services with database"""
        try:
            # Get current services
            current_services = ServiceService.get_system_services()
            
            # Clear old services
            db.query(Service).delete()
            db.commit()
            
            # Add current services
            for service_data in current_services:
                db_service = Service(**service_data.dict())
                db.add(db_service)
            
            db.commit()
            return len(current_services)
        except Exception as e:
            print(f"Error syncing services: {e}")
            db.rollback()
            return 0
    
    @staticmethod
    def get_services(db: Session, skip: int = 0, limit: int = 100) -> List[Service]:
        """Get services from database with pagination"""
        return db.query(Service).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_service_by_name(db: Session, name: str) -> Optional[Service]:
        """Get service by name"""
        return db.query(Service).filter(Service.name == name).first()
    
    @staticmethod
    def start_service(service_name: str) -> bool:
        """Start a system service"""
        try:
            if hasattr(psutil, 'win_service_iter'):
                # Windows
                subprocess.run(['sc', 'start', service_name], check=True)
            else:
                # Linux/Unix
                subprocess.run(['systemctl', 'start', service_name], check=True)
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            return False
    
    @staticmethod
    def stop_service(service_name: str) -> bool:
        """Stop a system service"""
        try:
            if hasattr(psutil, 'win_service_iter'):
                # Windows
                subprocess.run(['sc', 'stop', service_name], check=True)
            else:
                # Linux/Unix
                subprocess.run(['systemctl', 'stop', service_name], check=True)
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            return False
    
    @staticmethod
    def restart_service(service_name: str) -> bool:
        """Restart a system service"""
        try:
            if hasattr(psutil, 'win_service_iter'):
                # Windows
                subprocess.run(['sc', 'stop', service_name], check=True)
                subprocess.run(['sc', 'start', service_name], check=True)
            else:
                # Linux/Unix
                subprocess.run(['systemctl', 'restart', service_name], check=True)
            return True
        except (subprocess.CalledProcessError, FileNotFoundError):
            return False
    
    @staticmethod
    def get_service_count(db: Session) -> int:
        """Get total service count"""
        return db.query(Service).count()
    
    @staticmethod
    def get_running_services_count(db: Session) -> int:
        """Get count of running services"""
        return db.query(Service).filter(Service.status == "running").count()
