import psutil
from typing import List, Dict, Any

class NetworkService:
    @staticmethod
    def get_network_adapters() -> List[Dict[str, Any]]:
        adapters = []
        stats = psutil.net_if_stats()
        addrs = psutil.net_if_addrs()
        io_counters = psutil.net_io_counters(pernic=True)

        for name, stat in stats.items():
            ip_info = addrs.get(name, [])
            io_info = io_counters.get(name)

            adapters.append({
                "name": name,
                "is_up": stat.isup,
                "speed": stat.speed,
                "mtu": stat.mtu,
                "ip_addresses": [addr.address for addr in ip_info if addr.family == psutil.AF_LINK or addr.family == 2], # AF_LINK for MAC, 2 for IPv4
                "bytes_sent": io_info.bytes_sent if io_info else 0,
                "bytes_recv": io_info.bytes_recv if io_info else 0,
                "packets_sent": io_info.packets_sent if io_info else 0,
                "packets_recv": io_info.packets_recv if io_info else 0,
                "errin": io_info.errin if io_info else 0,
                "errout": io_info.errout if io_info else 0,
                "dropin": io_info.dropin if io_info else 0,
                "dropout": io_info.dropout if io_info else 0,
            })
        return adapters

    @staticmethod
    def get_network_connections() -> List[Dict[str, Any]]:
        connections = []
        for conn in psutil.net_connections(kind='inet'):
            connection_data = {
                "fd": conn.fd,
                "family": conn.family.name,
                "type": conn.type.name,
                "local_addr": f"{conn.laddr.ip}:{conn.laddr.port}" if conn.laddr else "",
                "remote_addr": f"{conn.raddr.ip}:{conn.raddr.port}" if conn.raddr else "",
                "status": conn.status,
                "pid": conn.pid,
            }
            if conn.pid:
                try:
                    p = psutil.Process(conn.pid)
                    connection_data["process_name"] = p.name()
                except (psutil.NoSuchProcess, psutil.AccessDenied):
                    connection_data["process_name"] = "N/A"
            else:
                connection_data["process_name"] = "N/A"
            
            connections.append(connection_data)
        return connections

    @staticmethod
    def get_network_io_counters() -> Dict[str, Any]:
        io = psutil.net_io_counters()
        return {
            "bytes_sent": io.bytes_sent,
            "bytes_recv": io.bytes_recv,
            "packets_sent": io.packets_sent,
            "packets_recv": io.packets_recv,
            "errin": io.errin,
            "errout": io.errout,
            "dropin": io.dropin,
            "dropout": io.dropout,
        }

    @staticmethod
    def get_all_network_info() -> Dict[str, Any]:
        return {
            "adapters": NetworkService.get_network_adapters(),
            "connections": NetworkService.get_network_connections(),
            "io_counters": NetworkService.get_network_io_counters(),
        }