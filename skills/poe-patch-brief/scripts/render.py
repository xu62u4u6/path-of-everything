#!/usr/bin/env python3
import argparse,json,pathlib,shutil
p=argparse.ArgumentParser();p.add_argument('source');p.add_argument('analysis');p.add_argument('--out',required=True);p.add_argument('--catalog',action='append',default=[]);a=p.parse_args();root=pathlib.Path(__file__).resolve().parents[1];out=pathlib.Path(a.out);out.mkdir(parents=True,exist_ok=True)
s=json.loads(pathlib.Path(a.source).read_text());d=json.loads(pathlib.Path(a.analysis).read_text())
catalog={}
for filename in a.catalog:
 for english,item in json.loads(pathlib.Path(filename).read_text()).items():
  catalog[english.lower()]=item['url'];catalog[item['name'].lower()]=item['url']
for e in d['entries']:
 key=e['name'].lower().strip()
 if key in catalog:e['poedb_url']=catalog[key]
 else:
  parts=[part.strip() for part in key.split(' · ')]
  urls={catalog[part] for part in parts if part in catalog}
  if len(urls)==1:e['poedb_url']=next(iter(urls))
for f in ['index.html','styles.css','app.js']:shutil.copyfile(root/'assets'/f,out/f)
(out/'data.js').write_text('window.PN = '+json.dumps({'source':s,'analysis':d},ensure_ascii=False,separators=(',',':')).replace('</','<\\/')+';\n')
print(str(out/'index.html'))
