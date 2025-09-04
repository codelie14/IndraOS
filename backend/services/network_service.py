import psutil
import socket
from typing import List, Optional
from sqlalchemy.orm import Session
from models.system import NetworkInterface
from api.schemas.system import NetworkInterfaceCreate

class NetworkService:
    
    @staticmethod
    def get_network_interfaces() -> List[NetworkInterfaceCreate]:
        """Get system network interfaces information"""
        interfaces = []
        try:
            # Get network interfaces
            net_if_addrs = psutil.net_if_addrs()
            net_if_stats = psutil.net_if_stats()
            
            for interface_name, addresses in net_if_addrs.items():
                try:
                    # Get interface stats
                    stats = net_if_stats.get(interface_name)
                    
                    # Find IPv4 address
                    ip_address = None
                    netmask = None
                    for addr in addresses:
                        if addr.family == socket.AF_INET:  # IPv4
                            ip_address = addr.address
                            netmask = addr.netmask
                            break
                    
                    # Get MAC address
                    mac_address = None
                    for addr in addresses:
                        if addr.family == psutil.AF_LINK:  # MAC address
                            mac_address = addr.address
                            break
                    
                    # Get interface status
                    status = "up" if stats and stats.isup else "down"
                    speed = stats.speed if stats else None
                    
                    interfaces.append(NetworkInterfaceCreate(
                        name=interface_name,
                        display_name=interface_name,
                        mac_address=mac_address,
                        ip_address=ip_address,
                        netmask=netmask,
                        gateway=None,  # Would need additional logic to get gateway
                        status=status,
                        speed=speed
                    ))
                    
                except Exception as e:
                    continue
                    
        except Exception as e:
            pass
        
        return interfaces
    
    @staticmethod
    def sync_network_interfaces(db: Session) -> int:
        """Sync current network interfaces with database"""
        try:
            # Get current interfaces
            current_interfaces = NetworkService.get_network_interfaces()
            
            # Clear old interfaces
            db.query(NetworkInterface).delete()
            db.commit()
            
            # Add current interfaces
            for interface_data in current_interfaces:
                db_interface = NetworkInterface(**interface_data.dict())
                db.add(db_interface)
            
            db.commit()
            return len(current_interfaces)
        except Exception as e:
            db.rollback()
            return 0
    
    @staticmethod
    def get_network_interfaces_db(db: Session, skip: int = 0, limit: int = 100) -> List[NetworkInterface]:
        """Get network interfaces from database with pagination"""
        return db.query(NetworkInterface).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_interface_by_name(db: Session, name: str) -> Optional[NetworkInterface]:
        """Get network interface by name"""
        return db.query(NetworkInterface).filter(NetworkInterface.name == name).first()
    
    @staticmethod
    def get_network_stats():
        """Get network statistics"""
        try:
            stats = psutil.net_io_counters()
            return {
                "bytes_sent": stats.bytes_sent,
                "bytes_recv": stats.bytes_recv,
                "packets_sent": stats.packets_sent,
                "packets_recv": stats.packets_recv,
                "errin": stats.errin,
                "errout": stats.errout,
                "dropin": stats.dropin,
                "dropout": stats.dropout
            }
        except Exception as e:
            return {}
    
    @staticmethod
    def get_network_connections():
        """Get active network connections"""
        try:
            connections = psutil.net_connections()
            return [
                {
                    "fd": conn.fd,
                    "family": conn.family,
                    "type": conn.type,
                    "laddr": f"{conn.laddr.ip}:{conn.laddr.port}" if conn.laddr else None,
                    "raddr": f"{conn.raddr.ip}:{conn.raddr.port}" if conn.raddr else None,
                    "status": conn.status,
                    "pid": conn.pid
                }
                for conn in connections
            ]
        except Exception as e:
            return []
    
    @staticmethod
    def get_interface_count(db: Session) -> int:
        """Get total interface count"""
        return db.query(NetworkInterface).count()
    
    @staticmethod
    def get_active_interfaces_count(db: Session) -> int:
        """Get count of active interfaces"""
        return db.query(NetworkInterface).filter(NetworkInterface.status == "up").count()
