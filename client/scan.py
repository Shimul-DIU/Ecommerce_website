import os, re
vals=set()
for root,_,files in os.walk('src'):
    for f in files:
        if f.endswith(('.jsx','.js','.css')):
            p=os.path.join(root,f)
            s=open(p,encoding='utf-8',errors='ignore').read()
            for m in re.findall(r'(?:bg|text|border)-\[[^\]]+\]', s):
                vals.add(m)
print(sorted(vals))
print('count', len(vals))
PY