import psutil
from typing import List, Optional
from sqlalchemy.orm import Session
from models.system import Process
from api.schemas.system import ProcessCreate

class ProcessService:
    
    @staticmethod
    def get_all_processes() -> List[Process]:
        """Get all running processes from system"""
        processes = []
        try:
            for proc in psutil.process_iter(['pid', 'name', 'cmdline', 'cpu_percent', 'memory_percent', 'status']):
                try:
                    proc_info = proc.info
                    processes.append(ProcessCreate(
                        pid=proc_info['pid'],
                        name=proc_info['name'],
                        command=' '.join(proc_info['cmdline']) if proc_info['cmdline'] else None,
                        cpu_percent=proc_info['cpu_percent'],
                        memory_percent=proc_info['memory_percent'],
                        status=proc_info['status']
                    ))
                except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                    continue
        except Exception as e:
            pass
        return processes
    
    @staticmethod
    def sync_processes(db: Session) -> int:
        """Sync current processes with database"""
        try:
            # Get current processes
            current_processes = ProcessService.get_all_processes()
            
            # Clear old processes
            db.query(Process).delete()
            db.commit()
            
            # Add current processes
            for proc_data in current_processes:
                db_proc = Process(**proc_data.dict())
                db.add(db_proc)
            
            db.commit()
            return len(current_processes)
        except Exception as e:
            db.rollback()
            return 0
    
    @staticmethod
    def get_processes(db: Session, skip: int = 0, limit: int = 100) -> List[Process]:
        """Get processes from database with pagination"""
        return db.query(Process).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_process_by_pid(db: Session, pid: int) -> Optional[Process]:
        """Get process by PID"""
        return db.query(Process).filter(Process.pid == pid).first()
    
    @staticmethod
    def kill_process(pid: int) -> bool:
        """Kill a process by PID"""
        try:
            proc = psutil.Process(pid)
            proc.terminate()
            return True
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            return False
    
    @staticmethod
    def get_process_count(db: Session) -> int:
        """Get total process count"""
        return db.query(Process).count()
    
    @staticmethod
    def get_running_processes_count(db: Session) -> int:
        """Get count of running processes"""
        return db.query(Process).filter(Process.status == "running").count()
