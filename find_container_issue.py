import pathlib
import re
root = pathlib.Path('the_ranger_mobile/lib')
for path in root.rglob('*.dart'):
    text = path.read_text(encoding='utf-8')
    if 'Container(' not in text or 'decoration:' not in text or 'color:' not in text:
        continue
    lines = text.splitlines()
    for i, line in enumerate(lines):
        if 'Container(' in line:
            depth = line.count('(') - line.count(')')
            block = [line]
            j = i
            while depth > 0 and j + 1 < len(lines):
                j += 1
                block.append(lines[j])
                depth += lines[j].count('(') - lines[j].count(')')
            b = '\n'.join(block)
            if 'decoration:' in b and 'color:' in b:
                print(f'{path}:{i+1}')
                print(b)
                print('---')
                break
