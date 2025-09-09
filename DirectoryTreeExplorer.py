#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import argparse
import json
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional, Union, Set
import fnmatch
import logging
import shutil


class DirectoryTreeExplorer:
    """Explorateur d'arborescence de dossiers avec options avancées."""
    
    # Patterns d'exclusion par défaut plus complets
    DEFAULT_EXCLUDE_PATTERNS = [
        # Fichiers Python
        '*.pyc', '*.pyo', '*.pyd', '__pycache__', '*.egg-info',
        # Environnements virtuels Python
        'venv', 'env', '.venv', '.env', 'virtualenv', '.virtualenv',
        'pipenv', '.pipenv', 'conda-meta',
        # Node.js
        'node_modules', 'npm-debug.log', 'yarn-error.log', '.npm', '.yarn',
        # Git et autres VCS
        '.git', '.svn', '.hg', '.bzr', 'CVS',
        # IDE et éditeurs
        '.vscode', '.idea', '*.swp', '*.swo', '*~', '.DS_Store', 'Thumbs.db',
        # Build et cache
        'build', 'dist', '.cache', '.pytest_cache', '.mypy_cache', '.tox',
        'target', 'bin', 'obj', '.gradle',
        # Logs et temporaires
        '*.log', '*.tmp', '*.temp', '*.bak', '*.old', '*.orig',
        # Archives et binaires
        '*.zip', '*.rar', '*.7z', '*.tar', '*.gz', '*.exe', '*.dll', '*.so',
        # Documentation générée
        'docs/_build', 'site', '_site',
        # Autres
        '.coverage', '.nyc_output', 'coverage', '.sass-cache'
    ]
    
    def __init__(self, show_hidden: bool = False, show_size: bool = True, 
                 max_depth: int = None, exclude_patterns: List[str] = None,
                 use_default_excludes: bool = True, custom_excludes: List[str] = None):
        """
        Initialise l'explorateur.
        
        Args:
            show_hidden: Afficher les fichiers/dossiers cachés
            show_size: Afficher les tailles des fichiers
            max_depth: Profondeur maximale d'exploration
            exclude_patterns: Patterns à exclure (remplace les défauts si fourni)
            use_default_excludes: Utiliser les exclusions par défaut
            custom_excludes: Patterns d'exclusion supplémentaires
        """
        self.show_hidden = show_hidden
        self.show_size = show_size
        self.max_depth = max_depth
        
        # Gestion des patterns d'exclusion
        if exclude_patterns is not None:
            # Utilisation des patterns fournis uniquement
            self.exclude_patterns = exclude_patterns
        else:
            # Combinaison des patterns par défaut et personnalisés
            self.exclude_patterns = []
            if use_default_excludes:
                self.exclude_patterns.extend(self.DEFAULT_EXCLUDE_PATTERNS)
            if custom_excludes:
                self.exclude_patterns.extend(custom_excludes)
        
        # Cache pour les exclusions (optimisation)
        self._exclude_cache: Dict[str, bool] = {}
        
        # Statistiques
        self.stats = {
            'total_dirs': 0,
            'total_files': 0,
            'total_size': 0,
            'largest_file': {'name': '', 'size': 0},
            'file_types': {},
            'empty_dirs': 0,
            'excluded_items': 0,
            'permission_errors': 0
        }
        
        # Configuration du logging
        logging.basicConfig(level=logging.WARNING)
        self.logger = logging.getLogger(__name__)
    
    def _should_exclude(self, path: Path) -> bool:
        """Vérifie si un chemin doit être exclu avec cache."""
        path_str = str(path)
        
        # Vérification du cache
        if path_str in self._exclude_cache:
            return self._exclude_cache[path_str]
        
        name = path.name
        should_exclude = False
        
        # Fichiers cachés (commence par .)
        if not self.show_hidden and name.startswith('.'):
            should_exclude = True
        
        # Patterns d'exclusion
        if not should_exclude:
            for pattern in self.exclude_patterns:
                if fnmatch.fnmatch(name, pattern) or fnmatch.fnmatch(path_str, pattern):
                    should_exclude = True
                    break
        
        # Mise en cache du résultat
        self._exclude_cache[path_str] = should_exclude
        
        if should_exclude:
            self.stats['excluded_items'] += 1
        
        return should_exclude
    
    def _format_size(self, size_bytes: int) -> str:
        """Formate la taille en unités lisibles."""
        if size_bytes == 0:
            return "0 B"
        
        for unit in ['B', 'KB', 'MB', 'GB', 'TB', 'PB']:
            if size_bytes < 1024.0:
                return f"{size_bytes:.1f} {unit}"
            size_bytes /= 1024.0
        return f"{size_bytes:.1f} EB"
    
    def _get_file_icon(self, path: Path) -> str:
        """Retourne une icône basée sur le type de fichier."""
        if path.is_dir():
            # Icônes spéciales pour certains dossiers
            special_dirs = {
                '.git': '🔧', '.vscode': '💙', '.idea': '🧠',
                'node_modules': '📦', 'venv': '🐍', 'env': '🐍',
                'build': '🔨', 'dist': '📦', 'src': '📝',
                'test': '🧪', 'tests': '🧪', 'docs': '📚'
            }
            return special_dirs.get(path.name.lower(), "📁")
        
        suffix = path.suffix.lower()
        icons = {
            '.txt': '📄', '.md': '📝', '.pdf': '📕', '.doc': '📘', '.docx': '📘',
            '.xls': '📊', '.xlsx': '📊', '.csv': '📋', '.json': '🔧', '.xml': '🔧',
            '.yml': '⚙️', '.yaml': '⚙️', '.toml': '⚙️', '.ini': '⚙️', '.cfg': '⚙️',
            '.py': '🐍', '.js': '⚡', '.ts': '💎', '.html': '🌐', '.css': '🎨', '.scss': '🎨',
            '.php': '🐘', '.java': '☕', '.cpp': '⚙️', '.c': '⚙️', '.cs': '💙', '.go': '🐹',
            '.rs': '🦀', '.rb': '💎', '.swift': '🍎', '.kt': '🟧', '.dart': '🎯',
            '.jpg': '🖼️', '.jpeg': '🖼️', '.png': '🖼️', '.gif': '🎬', '.svg': '🎭', '.ico': '🖼️',
            '.mp4': '🎥', '.avi': '🎥', '.mkv': '🎥', '.mov': '🎥', '.webm': '🎥',
            '.mp3': '🎵', '.wav': '🎵', '.flac': '🎵', '.ogg': '🎵', '.m4a': '🎵',
            '.zip': '📦', '.rar': '📦', '.7z': '📦', '.tar': '📦', '.gz': '📦',
            '.exe': '⚙️', '.msi': '📦', '.deb': '📦', '.rpm': '📦', '.dmg': '💽',
            '.iso': '💽', '.img': '💽', '.vdi': '💽', '.vmdk': '💽',
            '.sql': '🗃️', '.db': '🗃️', '.sqlite': '🗃️', '.sqlite3': '🗃️',
            '.log': '📋', '.env': '🔐', '.gitignore': '🚫', '.dockerignore': '🚫',
            '.dockerfile': '🐳', '.docker-compose.yml': '🐳', '.docker-compose.yaml': '🐳',
            '.makefile': '🔨', '.cmake': '🔨', '.gradle': '🐘', '.maven': '☕',
        }
        return icons.get(suffix, '📄')
    
    def copy_to_clipboard(self, text: str) -> bool:
        """Copie le texte dans le presse-papiers."""
        try:
            # Tentative avec pyperclip (nécessite installation)
            try:
                import pyperclip
                pyperclip.copy(text)
                return True
            except ImportError:
                pass
            
            # Alternatives système
            if shutil.which('pbcopy'):  # macOS
                import subprocess
                subprocess.run(['pbcopy'], input=text.encode(), check=True)
                return True
            elif shutil.which('xclip'):  # Linux avec xclip
                import subprocess
                subprocess.run(['xclip', '-selection', 'clipboard'], 
                             input=text.encode(), check=True)
                return True
            elif shutil.which('wl-copy'):  # Linux avec Wayland
                import subprocess
                subprocess.run(['wl-copy'], input=text.encode(), check=True)
                return True
            elif sys.platform == 'win32':  # Windows
                import subprocess
                subprocess.run(['clip'], input=text.encode(), shell=True, check=True)
                return True
                
        except Exception as e:
            self.logger.warning(f"Échec de la copie dans le presse-papiers: {e}")
        
        return False
    
    def _get_dir_size(self, directory: Path) -> int:
        """Calcule la taille totale d'un dossier."""
        total_size = 0
        try:
            for path in directory.rglob('*'):
                if path.is_file() and not self._should_exclude(path):
                    try:
                        total_size += path.stat().st_size
                    except (OSError, PermissionError):
                        self.stats['permission_errors'] += 1
                        continue
        except (OSError, PermissionError):
            self.stats['permission_errors'] += 1
        return total_size
    
    def _update_stats(self, path: Path):
        """Met à jour les statistiques."""
        if path.is_dir():
            self.stats['total_dirs'] += 1
            # Vérifier si le dossier est vide
            try:
                if not any(item for item in path.iterdir() if not self._should_exclude(item)):
                    self.stats['empty_dirs'] += 1
            except (OSError, PermissionError):
                self.stats['permission_errors'] += 1
        else:
            self.stats['total_files'] += 1
            
            try:
                file_size = path.stat().st_size
                self.stats['total_size'] += file_size
                
                # Fichier le plus volumineux
                if file_size > self.stats['largest_file']['size']:
                    self.stats['largest_file'] = {
                        'name': str(path),
                        'size': file_size
                    }
                
                # Types de fichiers
                ext = path.suffix.lower() or 'no_extension'
                self.stats['file_types'][ext] = self.stats['file_types'].get(ext, 0) + 1
                
            except (OSError, PermissionError):
                self.stats['permission_errors'] += 1
    
    def generate_tree(self, directory: Union[str, Path], prefix: str = "", 
                     current_depth: int = 0) -> List[str]:
        """
        Génère l'arborescence d'un dossier.
        
        Args:
            directory: Chemin du dossier à explorer
            prefix: Préfixe pour l'indentation
            current_depth: Profondeur actuelle
            
        Returns:
            Liste des lignes de l'arborescence
        """
        directory = Path(directory)
        lines = []
        
        if not directory.exists():
            return [f"❌ Dossier inexistant: {directory}"]
        
        if not directory.is_dir():
            return [f"❌ Pas un dossier: {directory}"]
        
        # Vérification de la profondeur maximale
        if self.max_depth is not None and current_depth >= self.max_depth:
            return []
        
        try:
            # Récupération et tri des éléments
            items = []
            for item in directory.iterdir():
                if not self._should_exclude(item):
                    items.append(item)
            
            # Tri : dossiers d'abord, puis fichiers, alphabétique
            items.sort(key=lambda x: (not x.is_dir(), x.name.lower()))
            
            for i, item in enumerate(items):
                try:
                    is_last = i == len(items) - 1
                    
                    # Symboles pour l'arborescence
                    if is_last:
                        current_prefix = "└── "
                        next_prefix = prefix + "    "
                    else:
                        current_prefix = "├── "
                        next_prefix = prefix + "│   "
                    
                    # Icône et nom
                    icon = self._get_file_icon(item)
                    name = item.name
                    
                    # Informations supplémentaires
                    info_parts = []
                    
                    if item.is_file() and self.show_size:
                        try:
                            size = item.stat().st_size
                            info_parts.append(self._format_size(size))
                        except (OSError, PermissionError):
                            info_parts.append("? B")
                            self.stats['permission_errors'] += 1
                    
                    # Construction de la ligne
                    line = f"{prefix}{current_prefix}{icon} {name}"
                    if info_parts:
                        line += f" ({', '.join(info_parts)})"
                    
                    lines.append(line)
                    
                    # Mise à jour des statistiques
                    self._update_stats(item)
                    
                    # Récursion pour les sous-dossiers
                    if item.is_dir():
                        sub_lines = self.generate_tree(
                            item, next_prefix, current_depth + 1
                        )
                        lines.extend(sub_lines)
                
                except (OSError, PermissionError) as e:
                    self.logger.warning(f"Accès refusé: {item} - {e}")
                    lines.append(f"{prefix}├── ❌ {item.name} (Accès refusé)")
                    self.stats['permission_errors'] += 1
        
        except (OSError, PermissionError) as e:
            self.logger.error(f"Erreur lecture dossier {directory}: {e}")
            lines.append(f"❌ Erreur lecture: {e}")
            self.stats['permission_errors'] += 1
        
        return lines
    
    def print_tree(self, directory: Union[str, Path], copy_to_clipboard: bool = False):
        """Affiche l'arborescence d'un dossier."""
        directory = Path(directory).resolve()
        
        header = f"📂 Arborescence de: {directory}"
        separator = "=" * 80
        
        print(header)
        print(separator)
        
        # Réinitialisation des statistiques
        self._reset_stats()
        
        # Génération de l'arborescence
        tree_lines = self.generate_tree(directory)
        
        # Construction du contenu complet
        content_lines = [header, separator, ""]
        content_lines.extend(tree_lines)
        
        # Affichage
        for line in tree_lines:
            print(line)
        
        # Affichage des statistiques
        stats_lines = self._get_statistics_lines()
        content_lines.extend([""] + stats_lines)
        
        self._print_statistics()
        
        # Copie dans le presse-papiers si demandée
        if copy_to_clipboard:
            full_content = "\n".join(content_lines + [""] + stats_lines)
            if self.copy_to_clipboard(full_content):
                print(f"\n✅ Arborescence copiée dans le presse-papiers!")
            else:
                print(f"\n⚠️ Impossible de copier dans le presse-papiers")
                print("💡 Installez 'pip install pyperclip' pour activer cette fonctionnalité")
    
    def _reset_stats(self):
        """Réinitialise les statistiques."""
        self.stats = {
            'total_dirs': 0,
            'total_files': 0,
            'total_size': 0,
            'largest_file': {'name': '', 'size': 0},
            'file_types': {},
            'empty_dirs': 0,
            'excluded_items': 0,
            'permission_errors': 0
        }
        self._exclude_cache.clear()
    
    def _get_statistics_lines(self) -> List[str]:
        """Retourne les lignes de statistiques."""
        lines = [
            "=" * 80,
            "📊 STATISTIQUES",
            "=" * 80,
            f"📁 Dossiers: {self.stats['total_dirs']}",
            f"📄 Fichiers: {self.stats['total_files']}",
            f"💾 Taille totale: {self._format_size(self.stats['total_size'])}"
        ]
        
        if self.stats['empty_dirs'] > 0:
            lines.append(f"📂 Dossiers vides: {self.stats['empty_dirs']}")
        
        if self.stats['excluded_items'] > 0:
            lines.append(f"🚫 Éléments exclus: {self.stats['excluded_items']}")
        
        if self.stats['permission_errors'] > 0:
            lines.append(f"⚠️ Erreurs d'accès: {self.stats['permission_errors']}")
        
        if self.stats['largest_file']['name']:
            lines.append(f"🗃️ Plus gros fichier: {Path(self.stats['largest_file']['name']).name} "
                        f"({self._format_size(self.stats['largest_file']['size'])})")
        
        # Top 10 des types de fichiers
        if self.stats['file_types']:
            lines.append(f"\n📈 Types de fichiers les plus fréquents:")
            sorted_types = sorted(
                self.stats['file_types'].items(),
                key=lambda x: x[1],
                reverse=True
            )
            for ext, count in sorted_types[:10]:
                ext_display = ext if ext != 'no_extension' else '(sans extension)'
                lines.append(f"   {ext_display}: {count}")
        
        return lines
    
    def _print_statistics(self):
        """Affiche les statistiques de l'exploration."""
        for line in self._get_statistics_lines():
            print(line)
    
    def show_excluded_patterns(self):
        """Affiche les patterns d'exclusion actuels."""
        print("🚫 Patterns d'exclusion actifs:")
        print("=" * 40)
        for i, pattern in enumerate(self.exclude_patterns, 1):
            print(f"{i:2}. {pattern}")
        print(f"\nTotal: {len(self.exclude_patterns)} patterns")
    
    def save_to_file(self, directory: Union[str, Path], output_file: str, 
                    format_type: str = "txt"):
        """
        Sauvegarde l'arborescence dans un fichier.
        
        Args:
            directory: Dossier à explorer
            output_file: Fichier de sortie
            format_type: Format (txt, json, html)
        """
        directory = Path(directory).resolve()
        self._reset_stats()
        
        if format_type.lower() == "json":
            self._save_to_json(directory, output_file)
        elif format_type.lower() == "html":
            self._save_to_html(directory, output_file)
        else:
            self._save_to_txt(directory, output_file)
    
    def _save_to_txt(self, directory: Path, output_file: str):
        """Sauvegarde en format texte."""
        tree_lines = self.generate_tree(directory)
        stats_lines = self._get_statistics_lines()
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(f"Arborescence de: {directory}\n")
            f.write(f"Généré le: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}\n")
            f.write("=" * 80 + "\n\n")
            
            for line in tree_lines:
                f.write(line + "\n")
            
            f.write("\n")
            for line in stats_lines:
                f.write(line + "\n")
        
        print(f"✅ Arborescence sauvegardée: {output_file}")
    
    def _build_json_tree(self, directory: Path, current_depth: int = 0) -> Dict:
        """Construit une structure JSON de l'arborescence."""
        if self.max_depth is not None and current_depth >= self.max_depth:
            return {}
        
        tree_data = {
            "name": directory.name,
            "path": str(directory),
            "type": "directory",
            "children": []
        }
        
        try:
            items = sorted(
                [item for item in directory.iterdir() if not self._should_exclude(item)],
                key=lambda x: (not x.is_dir(), x.name.lower())
            )
            
            for item in items:
                try:
                    if item.is_dir():
                        child_data = self._build_json_tree(item, current_depth + 1)
                        tree_data["children"].append(child_data)
                    else:
                        try:
                            file_size = item.stat().st_size
                        except (OSError, PermissionError):
                            file_size = 0
                        
                        file_data = {
                            "name": item.name,
                            "path": str(item),
                            "type": "file",
                            "size": file_size,
                            "extension": item.suffix.lower()
                        }
                        tree_data["children"].append(file_data)
                except (OSError, PermissionError):
                    continue
        
        except (OSError, PermissionError):
            pass
        
        return tree_data
    
    def _save_to_json(self, directory: Path, output_file: str):
        """Sauvegarde en format JSON."""
        tree_data = {
            "root_directory": str(directory),
            "generated_at": datetime.now().isoformat(),
            "configuration": {
                "show_hidden": self.show_hidden,
                "show_size": self.show_size,
                "max_depth": self.max_depth,
                "exclude_patterns": self.exclude_patterns
            },
            "statistics": self.stats,
            "tree": self._build_json_tree(directory)
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(tree_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Arborescence JSON sauvegardée: {output_file}")
    
    def _save_to_html(self, directory: Path, output_file: str):
        """Sauvegarde en format HTML."""
        tree_lines = self.generate_tree(directory)
        stats_lines = self._get_statistics_lines()
        
        html_content = f"""
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Arborescence - {directory.name}</title>
    <style>
        body {{ 
            font-family: 'Courier New', monospace; 
            margin: 20px; 
            background: #1e1e1e; 
            color: #d4d4d4;
            line-height: 1.4;
        }}
        .header {{ 
            color: #569cd6; 
            border-bottom: 2px solid #569cd6; 
            padding-bottom: 10px; 
            margin-bottom: 20px;
        }}
        .tree {{ 
            white-space: pre-wrap; 
            background: #2d2d30;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }}
        .stats {{ 
            background: #2d2d30; 
            padding: 15px; 
            border-radius: 5px; 
            margin-top: 20px; 
        }}
        .stats h3 {{ 
            color: #569cd6; 
            margin-top: 0;
        }}
        .copy-btn {{
            background: #0e639c;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-family: inherit;
        }}
        .copy-btn:hover {{
            background: #1177bb;
        }}
    </style>
    <script>
        function copyToClipboard() {{
            const treeContent = document.querySelector('.tree').textContent;
            const statsContent = document.querySelector('.stats').textContent;
            const fullContent = treeContent + '\\n\\n' + statsContent;
            
            navigator.clipboard.writeText(fullContent).then(() => {{
                const btn = document.querySelector('.copy-btn');
                const originalText = btn.textContent;
                btn.textContent = '✅ Copié!';
                setTimeout(() => {{
                    btn.textContent = originalText;
                }}, 2000);
            }}).catch(err => {{
                console.error('Erreur lors de la copie:', err);
            }});
        }}
    </script>
</head>
<body>
    <div class="header">
        <h1>📂 Arborescence de {directory}</h1>
        <p>Généré le: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}</p>
        <button class="copy-btn" onclick="copyToClipboard()">📋 Copier l'arborescence</button>
    </div>
    
    <div class="tree">{"".join(line + "\\n" for line in tree_lines)}</div>
    
    <div class="stats">
        <h3>📊 Statistiques</h3>
{"".join(f"        <p>{line}</p>\\n" for line in stats_lines[3:] if not line.startswith("="))}
    </div>
</body>
</html>
"""
        
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        print(f"✅ Arborescence HTML sauvegardée: {output_file}")


def main():
    """Fonction principale avec arguments en ligne de commande."""
    parser = argparse.ArgumentParser(
        description="Explorateur d'arborescence de dossiers amélioré",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Exemples d'utilisation:
  python DirectoryTreeExplorer.py /home/user                    # Arborescence basique
  python DirectoryTreeExplorer.py . --max-depth 3               # Profondeur limitée
  python DirectoryTreeExplorer.py ~/Documents --hidden --size   # Avec fichiers cachés
  python DirectoryTreeExplorer.py . --copy                      # Copie dans le presse-papiers
  python DirectoryTreeExplorer.py . --no-default-excludes       # Sans exclusions par défaut
  python DirectoryTreeExplorer.py . --add-exclude "*.bak,temp"  # Exclusions supplémentaires
  python DirectoryTreeExplorer.py . --show-excludes             # Voir les patterns d'exclusion
  python DirectoryTreeExplorer.py . --output tree.txt           # Sauvegarde en fichier
  python DirectoryTreeExplorer.py . --output tree.json --format json  # Export JSON
        """
    )
    
    parser.add_argument("directory", 
                       nargs="?", 
                       default=".", 
                       help="Dossier à explorer (défaut: dossier courant)")
    
    parser.add_argument("--hidden", 
                       action="store_true",
                       help="Afficher les fichiers et dossiers cachés")
    
    parser.add_argument("--no-size", 
                       action="store_true",
                       help="Ne pas afficher les tailles des fichiers")
    
    parser.add_argument("--max-depth", "-d",
                       type=int,
                       help="Profondeur maximale d'exploration")
    
    parser.add_argument("--exclude", "-e",
                       help="Patterns à exclure (remplace les défauts, séparés par des virgules)")
    
    parser.add_argument("--add-exclude", "-a",
                       help="Patterns d'exclusion supplémentaires (séparés par des virgules)")
    
    parser.add_argument("--no-default-excludes",
                       action="store_true",
                       help="Ne pas utiliser les patterns d'exclusion par défaut")
    
    parser.add_argument("--show-excludes",
                       action="store_true",
                       help="Afficher les patterns d'exclusion actifs et quitter")
    
    parser.add_argument("--copy", "-c",
                       action="store_true",
                       help="Copier l'arborescence dans le presse-papiers")
    
    parser.add_argument("--output", "-o",
                       help="Fichier de sortie pour sauvegarder l'arborescence")
    
    parser.add_argument("--format", "-f",
                       choices=["txt", "json", "html"],
                       default="txt",
                       help="Format de sortie (défaut: txt)")
    
    parser.add_argument("--verbose", "-v",
                       action="store_true",
                       help="Mode verbeux (affiche plus d'informations)")
    
    args = parser.parse_args()
    
    # Configuration du logging en mode verbeux
    if args.verbose:
        logging.getLogger().setLevel(logging.INFO)
    
    try:
        # Traitement des exclusions
        exclude_patterns = None
        custom_excludes = None
        use_default_excludes = not args.no_default_excludes
        
        if args.exclude:
            # Patterns fournis remplacent les défauts
            exclude_patterns = [pattern.strip() for pattern in args.exclude.split(",")]
            use_default_excludes = False
        
        if args.add_exclude:
            # Patterns supplémentaires à ajouter aux défauts
            custom_excludes = [pattern.strip() for pattern in args.add_exclude.split(",")]
        
        # Création de l'explorateur
        explorer = DirectoryTreeExplorer(
            show_hidden=args.hidden,
            show_size=not args.no_size,
            max_depth=args.max_depth,
            exclude_patterns=exclude_patterns,
            use_default_excludes=use_default_excludes,
            custom_excludes=custom_excludes
        )
        
        # Affichage des patterns d'exclusion si demandé
        if args.show_excludes:
            explorer.show_excluded_patterns()
            return 0
        
        directory = Path(args.directory).resolve()
        
        if not directory.exists():
            print(f"❌ Erreur: Le dossier '{directory}' n'existe pas!")
            return 1
        
        if not directory.is_dir():
            print(f"❌ Erreur: '{directory}' n'est pas un dossier!")
            return 1
        
        # Affichage ou sauvegarde
        if args.output:
            explorer.save_to_file(directory, args.output, args.format)
        else:
            explorer.print_tree(directory, copy_to_clipboard=args.copy)
        
    except KeyboardInterrupt:
        print("\n👋 Exploration interrompue!")
    except Exception as e:
        print(f"❌ Erreur: {e}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        return 1
    
    return 0


def interactive_mode():
    """Mode interactif pour explorer des dossiers."""
    print("🚀 Mode interactif - Explorateur d'arborescence")
    print("=" * 50)
    
    while True:
        try:
            print("\nOptions disponibles:")
            print("1. Explorer un dossier")
            print("2. Configurer les exclusions")
            print("3. Afficher l'aide")
            print("4. Quitter")
            
            choice = input("\nChoix (1-4): ").strip()
            
            if choice == "1":
                path = input("Chemin du dossier à explorer: ").strip()
                if not path:
                    path = "."
                
                show_hidden = input("Afficher les fichiers cachés? (o/n): ").lower().startswith('o')
                show_size = not input("Cacher les tailles? (o/n): ").lower().startswith('o')
                
                max_depth_input = input("Profondeur max (vide=illimitée): ").strip()
                max_depth = int(max_depth_input) if max_depth_input.isdigit() else None
                
                copy_clipboard = input("Copier dans le presse-papiers? (o/n): ").lower().startswith('o')
                
                explorer = DirectoryTreeExplorer(
                    show_hidden=show_hidden,
                    show_size=show_size,
                    max_depth=max_depth
                )
                
                explorer.print_tree(path, copy_to_clipboard=copy_clipboard)
                
            elif choice == "2":
                print("\nConfiguration des exclusions:")
                print("1. Voir les exclusions actuelles")
                print("2. Utiliser uniquement les exclusions par défaut")
                print("3. Ajouter des exclusions personnalisées")
                
                config_choice = input("Choix (1-3): ").strip()
                
                if config_choice == "1":
                    explorer = DirectoryTreeExplorer()
                    explorer.show_excluded_patterns()
                elif config_choice in ["2", "3"]:
                    print("Fonctionnalité disponible en mode ligne de commande")
                
            elif choice == "3":
                print_help()
                
            elif choice == "4":
                print("👋 Au revoir!")
                break
                
            else:
                print("❌ Choix invalide!")
                
        except KeyboardInterrupt:
            print("\n👋 Au revoir!")
            break
        except Exception as e:
            print(f"❌ Erreur: {e}")


def print_help():
    """Affiche l'aide détaillée."""
    help_text = """
🔍 AIDE - Explorateur d'arborescence

FONCTIONNALITÉS PRINCIPALES:
• Affichage d'arborescence avec icônes
• Exclusion intelligente des dossiers courants (node_modules, venv, etc.)
• Calcul de statistiques (tailles, types de fichiers, etc.)
• Copie dans le presse-papiers
• Export en multiple formats (txt, json, html)
• Mode interactif

EXCLUSIONS PAR DÉFAUT:
• Environnements virtuels: venv, env, node_modules, etc.
• Fichiers de cache: __pycache__, .cache, .pytest_cache, etc.
• Systèmes de contrôle de version: .git, .svn, etc.
• IDEs: .vscode, .idea, etc.
• Fichiers temporaires: *.tmp, *.log, *.bak, etc.

EXEMPLES D'USAGE:
  python DirectoryTreeExplorer.py                              # Dossier courant
  python DirectoryTreeExplorer.py /path/to/folder --copy       # Avec copie
  python DirectoryTreeExplorer.py . --max-depth 2             # Profondeur limitée
  python DirectoryTreeExplorer.py . --no-default-excludes     # Sans exclusions
  python DirectoryTreeExplorer.py . --add-exclude "*.pdf"     # Exclusions custom
  python DirectoryTreeExplorer.py --show-excludes             # Voir exclusions

FORMATS D'EXPORT:
• TXT: Format texte simple
• JSON: Structure arborescente pour traitement automatique
• HTML: Page web interactive avec copie en un clic

INSTALLATION RECOMMANDÉE:
  pip install pyperclip  # Pour la fonctionnalité presse-papiers
"""
    print(help_text)


if __name__ == "__main__":
    if len(sys.argv) == 1:
        # Mode interactif si aucun argument
        try:
            interactive_mode()
        except KeyboardInterrupt:
            print("\n👋 Au revoir!")
    else:
        # Mode ligne de commande
        exit(main())


# DOCUMENTATION TECHNIQUE
"""
DirectoryTreeExplorer - Explorateur d'arborescence de dossiers amélioré

NOUVELLES FONCTIONNALITÉS AJOUTÉES:

1. GESTION AVANCÉE DES EXCLUSIONS:
   - Patterns par défaut étendus incluant node_modules, venv, etc.
   - Option --no-default-excludes pour désactiver les exclusions par défaut
   - Option --add-exclude pour ajouter des exclusions personnalisées
   - Cache d'exclusion pour optimiser les performances
   - Compteur d'éléments exclus dans les statistiques

2. PRESSE-PAPIERS:
   - Fonction copy_to_clipboard() compatible multi-plateforme
   - Support pour pyperclip, pbcopy (macOS), xclip/wl-copy (Linux), clip (Windows)
   - Option --copy pour copier automatiquement l'arborescence
   - Bouton de copie dans l'export HTML

3. ICÔNES AMÉLIORÉES:
   - Icônes spéciales pour les dossiers système (.git, node_modules, etc.)
   - Support étendu des types de fichiers (TypeScript, Rust, Docker, etc.)
   - Icônes contextuelles selon le type de dossier

4. STATISTIQUES ÉTENDUES:
   - Compteur d'éléments exclus
   - Compteur d'erreurs de permission
   - Détection des dossiers vides améliorée

5. MODE INTERACTIF:
   - Lancement automatique si aucun argument fourni
   - Interface utilisateur simple pour configurer l'exploration
   - Gestion des exceptions améliorée

6. EXPORT HTML AMÉLIORÉ:
   - Bouton de copie JavaScript intégré
   - Styles améliorés avec thème sombre
   - Responsive design

7. OPTIONS SUPPLÉMENTAIRES:
   - --verbose pour plus d'informations de debug
   - --show-excludes pour voir les patterns actifs
   - Validation des arguments améliorée

UTILISATION RECOMMANDÉE:

Pour un usage quotidien:
  python DirectoryTreeExplorer.py ~/projet --copy

Pour analyser un projet sans pollution:
  python DirectoryTreeExplorer.py . --max-depth 3 --add-exclude "*.min.js,dist"

Pour export documenté:
  python DirectoryTreeExplorer.py . --output arbre.html --format html

OPTIMISATIONS:
- Cache d'exclusion pour éviter les réévaluations
- Tri optimisé (dossiers avant fichiers)
- Gestion robuste des erreurs de permission
- Logging configurable selon le niveau de verbosité

DÉPENDANCES OPTIONNELLES:
- pyperclip: Pour la fonctionnalité presse-papiers optimale
- Outils système: pbcopy, xclip, wl-copy, clip selon la plateforme

COMPATIBILITÉ:
- Python 3.6+
- Windows, macOS, Linux
- Tous environnements de développement courants
"""