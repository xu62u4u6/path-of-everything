#!/usr/bin/env python3
"""Validate source ownership and coherent references. Semantic review remains a separate step."""
import argparse,json,math,pathlib,sys
p=argparse.ArgumentParser();p.add_argument('source');p.add_argument('analysis');a=p.parse_args();s=json.loads(pathlib.Path(a.source).read_text());d=json.loads(pathlib.Path(a.analysis).read_text());errors=[];owners={};nodes={n['id']:n for n in s['nodes']};sections={x['id'] for x in s['sections']};entries={e['id']:e for e in d['entries']}
def err(message):errors.append(message)
if d['version']!=s['version']:err('Version mismatch')
if d.get('source_sha256')!=s['sha256']:err('Source snapshot mismatch; re-review analysis against this source')
if set(d['sections'])!=sections:err('Section labels mismatch')
if len(entries)!=len(d['entries']):err('Duplicate entry ids')
for e in d['entries']:
 eid=e['id']
 if e['section'] not in sections:err(f'{eid}: unknown chapter')
 if e['verdict'] not in ['up','down','mixed','rework','new','fix','neutral']:err(f'{eid}: invalid verdict')
 if e['importance'] not in ['major','normal','minor']:err(f'{eid}: invalid importance')
 if not e.get('name') or not e.get('changes'):err(f'{eid}: empty reading layer')
 if e['verdict']=='mixed' and not e.get('conclusion'):err(f'{eid}: mixed requires a visible concrete tradeoff conclusion')
 for c in e['changes']:
  if not c.get('text') or not c.get('source_ids'):err(f'{eid}: change without text/evidence')
  for nid in c.get('source_ids',[]):
   if nid not in nodes:err(f'{eid}: unknown source {nid}');continue
   if nodes[nid]['section']!=e['section']:err(f'{eid}: source {nid} belongs to different chapter; use related entry')
   owners.setdefault(nid,[]).append(eid)
  for m in c.get('metrics',[]):
   for key in ['old','new']:
    value=m.get(key)
    if value is None:
     if not m.get(key+'_text'):err(f'{eid}: missing {key}_text for nonnumeric metric')
    elif isinstance(value,bool) or not isinstance(value,(float,int)) or not math.isfinite(value):err(f'{eid}: invalid numeric metric')
 for related in e.get('related',[]):
  if related not in entries or related==eid:err(f'{eid}: bad related id {related}')
for nid in nodes:
 if nid not in owners:err(f'Unreviewed source: {nid} {nodes[nid]["text"][:75]}')
for direction in d['directions']:
 if direction['status'] not in ['explicit','inferred']:err('Invalid direction provenance')
 if not direction.get('supports'):err('Direction without support')
 for eid in direction.get('supports',[])+direction.get('exceptions',[]):
  if eid not in entries:err(f'Direction references missing entry {eid}')
report={'version':s['version'],'source_nodes':len(nodes),'mapped_nodes':len(owners),'entries':len(entries),'directions':len(d['directions']),'metrics':sum(len(c.get('metrics',[])) for e in entries.values() for c in e['changes']),'excluded_revision_nodes':len(s.get('revision_log',[])),'errors':errors}
print(json.dumps(report,ensure_ascii=False,indent=2));sys.exit(bool(errors))
