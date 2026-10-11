import os
import glob
import re

files = glob.glob('src/content/notes/*.md')

def clean_content(content):
    # 1. Shield Frontmatter: Remove ALL <br /> from between first and second ---
    parts = content.split('---', 2)
    if len(parts) >= 3:
        frontmatter = parts[1]
        body = parts[2]
        
        # Remove <br /> from frontmatter completely (as it is invalid YAML)
        frontmatter = frontmatter.replace('<br />', '').replace('<br/>', '').replace('<br>', '')
        
        # 2. Shield Code Blocks: Remove <br /> from inside ```...```
        def remove_br_from_code(match):
            return match.group(0).replace('<br />', '').replace('<br/>', '').replace('<br>', '')
        
        body = re.sub(r'```.*?```', remove_br_from_code, body, flags=re.DOTALL)
        
        # 3. Clean body: remove <br /> tags that are on their own line 
        # (this is the signature of the faulty script)
        body = re.sub(r'^\s*<br\s*/?>\s*$', '', body, flags=re.MULTILINE)
        
        # Remove <br /> that immediately follow a line (common in the script output)
        # This handles the cases where <br /> was just appended to the end of a line.
        body = re.sub(r'(?<=\n)<br\s*/?>\n', '\n', body)
        
        content = f"---{frontmatter}---{body}"
    
    return content

# Process first 3 files only for verification
for i, file_path in enumerate(files):
    if i >= 3: break
    with open(file_path, 'r') as f:
        original = f.read()
    
    cleaned = clean_content(original)
    
    with open(file_path + '.tmp', 'w') as f:
        f.write(cleaned)

