#!/usr/bin/env python
"""Build dist/pcea-study-lab.zip with a top-level pcea-study-lab/ folder.

Includes: index.html, package.json, server.js, Start PCEA Study Lab.bat,
Start PCEA Study Lab.command, start.sh, HOW TO START.txt, css/, js/
(recursively, including js/shop/), content/, vendor/.

Excludes: tests/, docs/, tools/, profiles/, dist/, .git, .superpowers,
node_modules, 'PCEA Study Guide.md'.

.sh and .command files get unix mode 0755; everything else 0644.
"""
import os
import sys
import zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'dist')
ZIP_PATH = os.path.join(DIST, 'pcea-study-lab.zip')
TOP = 'pcea-study-lab'

TOP_FILES = [
    'index.html',
    'package.json',
    'server.js',
    'Start PCEA Study Lab.bat',
    'Start PCEA Study Lab.command',
    'start.sh',
    'HOW TO START.txt',
]

TOP_DIRS = ['css', 'js', 'content', 'vendor']

EXCLUDE_DIR_NAMES = {
    'tests', 'docs', 'tools', 'profiles', 'dist',
    '.git', '.superpowers', 'node_modules',
}

UNIX_EXT = {'.sh', '.command'}


def add_file(zf, abs_path, arcname):
    ext = os.path.splitext(abs_path)[1]
    zi = zipfile.ZipInfo(arcname)
    zi.date_time = (2026, 1, 1, 0, 0, 0)
    if ext in UNIX_EXT:
        zi.external_attr = (0o100755 << 16)
        zi.create_system = 3
    else:
        zi.external_attr = (0o100644 << 16)
        zi.create_system = 3
    with open(abs_path, 'rb') as f:
        data = f.read()
    zf.writestr(zi, data, zipfile.ZIP_DEFLATED)


def iter_dir_files(base_dir):
    for dirpath, dirnames, filenames in os.walk(base_dir):
        dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIR_NAMES and not d.startswith('.')]
        for fn in filenames:
            yield os.path.join(dirpath, fn)


def main():
    os.makedirs(DIST, exist_ok=True)
    count = 0
    with zipfile.ZipFile(ZIP_PATH, 'w', zipfile.ZIP_DEFLATED) as zf:
        for name in TOP_FILES:
            abs_path = os.path.join(ROOT, name)
            if not os.path.isfile(abs_path):
                print('WARNING: missing top-level file: %s' % name, file=sys.stderr)
                continue
            arcname = '/'.join([TOP, name])
            add_file(zf, abs_path, arcname)
            count += 1

        for d in TOP_DIRS:
            base_dir = os.path.join(ROOT, d)
            if not os.path.isdir(base_dir):
                print('WARNING: missing dir: %s' % d, file=sys.stderr)
                continue
            for abs_path in iter_dir_files(base_dir):
                rel = os.path.relpath(abs_path, ROOT).replace(os.sep, '/')
                arcname = '/'.join([TOP, rel])
                add_file(zf, abs_path, arcname)
                count += 1

    size = os.path.getsize(ZIP_PATH)
    print('Wrote %s: %d files, %d bytes (%.1f KB)' % (ZIP_PATH, count, size, size / 1024.0))


if __name__ == '__main__':
    main()
