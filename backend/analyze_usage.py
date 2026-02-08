import os
import re
import sys

# Configuration
PROJECT_ROOT = r'C:\Users\abint\Desktop\E-T-S_Website\ETS-site\clue-quest'
SRC_DIR = os.path.join(PROJECT_ROOT, 'src')
ENTRY_POINTS = [
    os.path.join(SRC_DIR, 'main.tsx'),
    os.path.join(SRC_DIR, 'vite-env.d.ts'),
    os.path.join(SRC_DIR, 'test', 'setup.ts'), 
]

# Regex for imports
# Handles:
# import ... from "..."
# import "..."
# require("...")
# import("...")
# export ... from "..."
IMPORT_REGEX = re.compile(r'(?:import|export)\s+(?:.*?from\s+)?[\'"]([^\'"]+)[\'"]|require\([\'"]([^\'"]+)[\'"]\)|import\([\'"]([^\'"]+)[\'"]\)')

def resolve_path(current_file, import_path):
    """
    Resolves an import path to an absolute file path.
    """
    if import_path.startswith('.'):
        # Relative path
        base_dir = os.path.dirname(current_file)
        target_path = os.path.normpath(os.path.join(base_dir, import_path))
    elif import_path.startswith('@/'):
        # Alias path
        target_path = os.path.normpath(os.path.join(SRC_DIR, import_path[2:]))
    else:
        # Node module or absolute path (ignore node_modules)
        return None

    # Extensions to try
    extensions = ['.tsx', '.ts', '.jsx', '.js', '.css', '.json', '']
    
    # Check if it's a directory (index file)
    if os.path.isdir(target_path):
        for ext in extensions:
            if not ext: continue # index must have extension
            index_path = os.path.join(target_path, f'index{ext}')
            if os.path.exists(index_path):
                return index_path
    
    # Check exact file or with extension
    for ext in extensions:
        candidate = target_path + ext
        if os.path.exists(candidate) and os.path.isfile(candidate):
            return candidate
            
    # Check for index file if target_path was essentially a directory but didn't exist as exact file
    # (e.g. import './components/ui') -> ./components/ui/index.tsx
    # We already checked isdir, but sometimes logic is tricky.
    
    return None

def get_all_src_files(directory):
    src_files = set()
    for root, dirs, files in os.walk(directory):
        for file in files:
            # Filter somewhat
            if file.endswith(('.tsx', '.ts', '.jsx', '.js', '.css', '.json')):
                src_files.add(os.path.normpath(os.path.join(root, file)))
    return src_files

def get_imports_from_file(file_path):
    imports = set()
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            matches = IMPORT_REGEX.findall(content)
            for match in matches:
                # match is a tuple due to groups
                raw_import = next(m for m in match if m)
                resolved = resolve_path(file_path, raw_import)
                if resolved:
                    imports.add(resolved)
    except Exception as e:
        # print(f"Error reading {file_path}: {e}")
        pass
    return imports

def main():
    all_files = get_all_src_files(SRC_DIR)
    
    # Build graph
    graph = {}
    for file in all_files:
        graph[file] = get_imports_from_file(file)

    # Traverse
    visited = set()
    queue = []
    
    # Add existing entry points
    for ep in ENTRY_POINTS:
        if os.path.exists(ep):
            queue.append(os.path.normpath(ep))
            visited.add(os.path.normpath(ep))
    
    head = 0
    while head < len(queue):
        current = queue[head]
        head += 1
        
        if current in graph:
            for neighbor in graph[current]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        
    unused_files = all_files - visited
    used_files = visited

    print("--- UNUSED FILES ---")
    for f in sorted(unused_files):
        print(os.path.relpath(f, SRC_DIR))
        
    print("\n--- USED FILES ---")
    for f in sorted(used_files):
        print(os.path.relpath(f, SRC_DIR))

if __name__ == "__main__":
    main()
