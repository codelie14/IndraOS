from fastapi import APIRouter, Depends, HTTPException, Query, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session
from typing import List, Optional
import asyncio

from api.schemas.system import (
    SystemInfo, SystemMetrics, SystemOverview, 
    Process, ProcessList, Service, ServiceList,
    NetworkInterface, NetworkInterfaceList,
    SecurityEvent, SecurityEventList
)
from services import (
    SystemService, ProcessService, ServiceService,
    NetworkService, SecurityService
)
from db import get_db

router = APIRouter()

@router.websocket("/ws/system-metrics")
async def websocket_system_metrics(websocket: WebSocket):
    """WebSocket endpoint for real-time system metrics."""
    await websocket.accept()
    try:
        while True:
            metrics = SystemService.get_realtime_metrics()
            await websocket.send_json(metrics)
            await asyncio.sleep(1)  # Send updates every second
    except WebSocketDisconnect:
        print("Client disconnected from system metrics websocket")
    except Exception as e:
        print(f"Error in system metrics websocket: {e}")
    finally:
        await websocket.close()

@router.get("/system", response_model=SystemInfo)
def get_system_info():
    """Retrieve basic system information."""
    return SystemService.get_system_info()

@router.get("/system/overview", response_model=SystemOverview)
def get_system_overview(db: Session = Depends(get_db)):
    """Get comprehensive system overview."""
    return SystemService.get_system_overview(db)

@router.get("/system/metrics", response_model=List[SystemMetrics])
def get_system_metrics(
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Get system metrics history."""
    return SystemService.get_metrics_history(db, limit)

@router.get("/system/metrics/latest", response_model=SystemMetrics)
def get_latest_metrics(db: Session = Depends(get_db)):
    """Get the latest system metrics."""
    metrics = SystemService.get_latest_metrics(db)
    if not metrics:
        raise HTTPException(status_code=404, detail="No metrics found")
    return metrics

@router.post("/system/metrics/collect")
def collect_system_metrics(db: Session = Depends(get_db)):
    """Collect and store current system metrics."""
    metrics = SystemService.collect_system_metrics()
    saved_metrics = SystemService.save_metrics(db, metrics)
    return {"message": "Metrics collected", "id": saved_metrics.id}

# Process endpoints
@router.get("/processes", response_model=ProcessList)
def get_processes(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Get all processes with pagination."""
    processes = ProcessService.get_processes(db, skip, limit)
    total = ProcessService.get_process_count(db)
    
    return ProcessList(
        processes=processes,
        total=total,
        page=skip // limit + 1,
        size=limit
    )

@router.get("/processes/sync")
def sync_processes(db: Session = Depends(get_db)):
    """Sync current system processes with database."""
    count = ProcessService.sync_processes(db)
    return {"message": f"Synced {count} processes"}

@router.get("/processes/{pid}", response_model=Process)
def get_process(pid: int, db: Session = Depends(get_db)):
    """Get process by PID."""
    process = ProcessService.get_process_by_pid(db, pid)
    if not process:
        raise HTTPException(status_code=404, detail="Process not found")
    return process

@router.delete("/processes/{pid}")
def kill_process(pid: int):
    """Kill a process by PID."""
    success = ProcessService.kill_process(pid)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to kill process")
    return {"message": f"Process {pid} killed successfully"}

# Service endpoints
@router.get("/services", response_model=ServiceList)
def get_services(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Get all services with pagination."""
    services = ServiceService.get_services(db, skip, limit)
    total = ServiceService.get_service_count(db)
    
    return ServiceList(
        services=services,
        total=total,
        page=skip // limit + 1,
        size=limit
    )

@router.get("/services/sync")
def sync_services(db: Session = Depends(get_db)):
    """Sync current system services with database."""
    count = ServiceService.sync_services(db)
    return {"message": f"Synced {count} services"}

@router.get("/services/{name}", response_model=Service)
def get_service(name: str, db: Session = Depends(get_db)):
    """Get service by name."""
    service = ServiceService.get_service_by_name(db, name)
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    return service

@router.post("/services/{name}/start")
def start_service(name: str):
    """Start a system service."""
    success = ServiceService.start_service(name)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to start service")
    return {"message": f"Service {name} started successfully"}

@router.post("/services/{name}/stop")
def stop_service(name: str):
    """Stop a system service."""
    success = ServiceService.stop_service(name)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to stop service")
    return {"message": f"Service {name} stopped successfully"}

@router.post("/services/{name}/restart")
def restart_service(name: str):
    """Restart a system service."""
    success = ServiceService.restart_service(name)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to restart service")
    return {"message": f"Service {name} restarted successfully"}

# Network endpoints
@router.get("/network/interfaces", response_model=NetworkInterfaceList)
def get_network_interfaces(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    """Get all network interfaces with pagination."""
    interfaces = NetworkService.get_network_interfaces_db(db, skip, limit)
    total = NetworkService.get_interface_count(db)
    
    return NetworkInterfaceList(
        interfaces=interfaces,
        total=total,
        page=skip // limit + 1,
        size=limit
    )

@router.get("/network/interfaces/sync")
def sync_network_interfaces(db: Session = Depends(get_db)):
    """Sync current network interfaces with database."""
    count = NetworkService.sync_network_interfaces(db)
    return {"message": f"Synced {count} network interfaces"}

@router.get("/network/interfaces/{name}", response_model=NetworkInterface)
def get_network_interface(name: str, db: Session = Depends(get_db)):
    """Get network interface by name."""
    interface = NetworkService.get_interface_by_name(db, name)
    if not interface:
        raise HTTPException(status_code=404, detail="Network interface not found")
    return interface

@router.get("/network/stats")
def get_network_stats():
    """Get network statistics."""
    return NetworkService.get_network_stats()

@router.get("/network/connections")
def get_network_connections():
    """Get active network connections."""
    return NetworkService.get_network_connections()

# Security endpoints
@router.get("/security/events", response_model=SecurityEventList)
def get_security_events(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    severity: Optional[str] = Query(None),
    resolved: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    """Get all security events with pagination and filtering."""
    events = SecurityService.get_security_events(db, skip, limit, severity, resolved)
    total = SecurityService.get_security_event_count(db)
    
    return SecurityEventList(
        events=events,
        total=total,
        page=skip // limit + 1,
        size=limit
    )

@router.get("/security/events/{event_id}", response_model=SecurityEvent)
def get_security_event(event_id: int, db: Session = Depends(get_db)):
    """Get security event by ID."""
    event = SecurityService.get_security_event_by_id(db, event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Security event not found")
    return event

@router.post("/security/events/{event_id}/resolve")
def resolve_security_event(event_id: int, db: Session = Depends(get_db)):
    """Mark a security event as resolved."""
    success = SecurityService.mark_event_resolved(db, event_id)
    if not success:
        raise HTTPException(status_code=404, detail="Security event not found")
    return {"message": "Security event marked as resolved"}

@router.delete("/security/events/{event_id}")
def delete_security_event(event_id: int, db: Session = Depends(get_db)):
    """Delete a security event."""
    success = SecurityService.delete_security_event(db, event_id)
    if not success:
        raise HTTPException(status_code=404, detail="Security event not found")
    return {"message": "Security event deleted"}

@router.get("/security/stats")
def get_security_stats(db: Session = Depends(get_db)):
    """Get security statistics."""
    return SecurityService.get_security_stats(db)

@router.post("/security/scan")
def scan_security(db: Session = Depends(get_db)):
    """Perform security scan for suspicious activity."""
    events = SecurityService.scan_for_suspicious_activity(db)
    
    # Save events to database
    saved_events = []
    for event_data in events:
        event = SecurityService.create_security_event(
            db=db,
            event_type=event_data.event_type,
            severity=event_data.severity,
            description=event_data.description,
            source=event_data.source,
            ip_address=event_data.ip_address
        )
        saved_events.append(event)
    
    return {
        "message": f"Security scan completed. Found {len(events)} events.",
        "events_found": len(events),
        "events_saved": len(saved_events)
    }
