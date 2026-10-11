import os
import re

files = [
    'src/content/notes/active-directory-labs.md',
    'src/content/notes/ad-operator-theory.md',
    'src/content/notes/aslr.md'
]

def clean_content(content):
    # 1. Shield Frontmatter
    parts = content.split('---', 2)
    if len(parts) >= 3:
        frontmatter = parts[1]
        body = parts[2]
        
        # Remove <br /> from frontmatter completely
        frontmatter = frontmatter.replace('<br />', '').replace('<br/>', '').replace('<br>', '')
        
        # 2. Shield Code Blocks
        def remove_br_from_code(match):
            return match.group(0).replace('<br />', '').replace('<br/>', '').replace('<br>', '')
        
        body = re.sub(r'```.*?```', remove_br_from_code, body, flags=re.DOTALL)
        
        # 3. Clean body: remove <br /> tags that are on their own line
        body = re.sub(r'^\s*<br\s*/?>\s*$', '', body, flags=re.MULTILINE)
        
        # Remove <br /> that immediately follow a newline (the script signature)
        body = re.sub(r'\n<br\s*/?>\n', '\n\n', body)
        
        content = f"---{frontmatter}---{body}"
    
    return content

for file_path in files:
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            original = f.read()
        
        cleaned = clean_content(original)
        
        with open(file_path + '.tmp', 'w') as f:
            f.write(cleaned)
        print(f"Processed {file_path}")
