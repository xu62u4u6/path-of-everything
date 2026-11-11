#!/usr/bin/env python3
"""Freeze an official GGG main post as addressable source nodes; no balance classification."""
import argparse,hashlib,json,pathlib
from bs4 import BeautifulSoup
p=argparse.ArgumentParser();p.add_argument('html');p.add_argument('--version',required=True);p.add_argument('--url',required=True);p.add_argument('--out',required=True);a=p.parse_args()
raw=pathlib.Path(a.html).read_bytes();soup=BeautifulSoup(raw,'html.parser');post=soup.select_one('.newsPost .content')
if not post:raise SystemExit('Official main post not found; refusing a navigation/comment fallback')
if a.version not in soup.title.get_text():raise SystemExit('Version mismatch in page title')
sections=[];nodes=[];revision_log=[]
for box in post.select('.lbox-container'):
 heading=box.find(['h2','h3']);body=box.select_one('.box-content')
 if not heading or not body:continue
 title=heading.get_text(' ',strip=True)
 if title=='Table of Contents' or title.startswith('Content Update') or title in ['Updates','Patch Note Updates']:continue
 sid=f's{len(sections)+1:02d}';section={'id':sid,'title':title,'anchor':box.get('id',''),'source_ids':[]};sections.append(section)
 assigned={}
 positions={id(tag):i for i,tag in enumerate(body.descendants)}
 update_markers=[tag for tag in body.select('strong') if tag.get_text(' ',strip=True).startswith('Updates for ')]
 revision_start=min((positions[id(tag)] for tag in update_markers),default=float('inf'))
 for li in body.select('li'):
  if positions[id(li)] > revision_start:
   revision_log.append({'section':sid,'text':li.get_text(' ',strip=True)})
   continue
  # Direct node text, excluding every child list; child nodes retain their parent context.
  clone=BeautifulSoup(str(li),'html.parser').find('li')
  for child in clone.find_all(['ul','ol']):child.decompose()
  text=clone.get_text(' ',strip=True);images=[{'url':im.get('src'),'alt':im.get('alt','')} for im in clone.select('img')]
  if not text and not images:continue
  nid=f'{sid}-{len(section["source_ids"])+1:03d}';assigned[id(li)]=nid
  parents=[assigned[id(parent)] for parent in reversed(list(li.parents)) if id(parent) in assigned]
  node={'id':nid,'section':sid,'parents':parents,'text':text,'images':images,'links':[{'text':link.get_text(' ',strip=True),'url':link.get('href')} for link in clone.select('a[href]')],'hash':hashlib.sha256(text.encode()).hexdigest()}
  nodes.append(node);section['source_ids'].append(nid)
 if not section['source_ids']:
  text=body.get_text(' ',strip=True)
  if text and text!=title:raise SystemExit(f'Non-list section needs explicit extraction review: {title}')
out={'version':a.version,'url':a.url,'sha256':hashlib.sha256(raw).hexdigest(),'sections':sections,'nodes':nodes,'revision_log':revision_log}
pathlib.Path(a.out).write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print(f'{a.version}: {len(sections)} sections; {len(nodes)} source nodes; {sum(bool(n["images"]) for n in nodes)} nodes with images')
