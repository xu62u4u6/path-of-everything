#!/usr/bin/env python3
"""Extract PoEDB spectre identity and displayed skills without executing Lua/JS."""
import argparse,datetime,hashlib,json,re,sys,urllib.parse,urllib.request
from pathlib import Path
try:
    from bs4 import BeautifulSoup
except ImportError:
    raise SystemExit('Requires existing beautifulsoup4; do not auto-install. Use a documented manual extraction if unavailable.')


def parse_spectre(raw, url):
    soup=BeautifulSoup(raw,'html.parser')
    title=soup.title.get_text(' ',strip=True) if soup.title else ''
    if any(x in title.lower() for x in ['just a moment','access denied','anubis']):
        raise ValueError('Blocked/challenge response; not monster evidence')
    lua=next((x.get_text() for x in soup.find_all('pre') if re.search(r'minions\["Metadata/',x.get_text())),None)
    if not lua:raise ValueError('No PoEDB Spectres.lua export; monster identity/eligibility cannot be established')
    hit=re.search(r'minions\["([^"]+)"\]\s*=\s*\{',lua)
    # Stop at the following skills export; never evaluate the remote Lua.
    block=lua[hit.end():].split('-- src\\Data\\Skills',1)[0]
    scalars={}
    for key,value in re.findall(r'^\s*(\w+)\s*=\s*("[^"\n]*"|true|false|-?[\d.]+)\s*,?\s*$',block,re.M):
        if value.startswith('"'):scalars[key]=value[1:-1]
        elif value in ['true','false']:scalars[key]=value=='true'
        else:scalars[key]=float(value) if '.' in value else int(value)
    if not scalars.get('name'):raise ValueError('Missing exported spectre name')
    skills_match=re.search(r'skillList\s*=\s*\{([^}]+)\}',block,re.S)
    skill_ids=re.findall(r'"([^"]+)"',skills_match.group(1)) if skills_match else []
    skills=[]
    for popup in soup.select('.gemPopup'):
        title_el=popup.select_one('.TitleBar')
        if not title_el:continue
        skill_id=title_el.get_text(' ',strip=True)
        if skill_id not in skill_ids:continue
        props={};tags=[]
        for el in popup.select('.property'):
            text=el.get_text(' ',strip=True)
            if ':' in text:
                key,value=text.split(':',1);props[key.strip()]=value.strip()
            elif ',' in text:tags=[x.strip() for x in text.split(',')]
        desc=popup.select_one('.text-gem')
        skills.append({'id':skill_id,'types':tags,'properties':props,'description':desc.get_text(' ',strip=True) if desc else None,'stats':[x.get_text(' ',strip=True) for x in popup.select('.explicitMod')]})
    sample={};base={};in_sample=False
    for th in soup.select('div.th'):
        key=th.get_text(' ',strip=True);parent=th.parent
        children=parent.find_all('div',recursive=False)
        if len(children)<2:continue
        value=children[-1].get_text(' ',strip=True)
        if key=='Level':in_sample=True
        (sample if in_sample else base)[key]=value
    level=sample.get('Level')
    if level is None:raise ValueError('Displayed monster level missing; reject unscoped damage values')
    eligible=None
    for th in soup.find_all('th'):
        if ''.join(th.find_all(string=True,recursive=False)).strip() in ['Spectre','幽魂']:
            cell=th.find_next('td')
            if cell and cell.select_one('.fa-check'):eligible=True
            elif cell and (cell.select_one('.fa-times') or cell.select_one('.fa-xmark')):eligible=False
            break
    missing=[x for x in skill_ids if x not in {s['id'] for s in skills}]
    return {'schema_version':1,'source':{'url':url,'retrieved_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sha256':hashlib.sha256(raw.encode()).hexdigest(),'html_bytes':len(raw.encode())},'identity':{'name':scalars['name'],'metadata_id':hit.group(1),'spectre_eligible':eligible},'base':{k:v for k,v in scalars.items() if k!='name'},'skill_ids':skill_ids,'skills':skills,'displayed_monster_level':int(level),'displayed_monster_stats':sample,'scope':['Displayed numeric skill values use the page monster level; not character DPS or final raised-spectre life.','Map buffs, AI uptime, overlap and number of spectres are not proven by this page.'],'warnings':(['Eligibility icon not recognized'] if eligible is None else [])+(['Missing displayed skill blocks: '+', '.join(missing)] if missing else [])}


def main():
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--url',required=True,help='Exact verified English PoEDB monster URL; do not guess aliases')
    ap.add_argument('--html',type=Path,help='Parse saved HTML without network')
    ap.add_argument('--output',type=Path,required=True)
    ap.add_argument('--save-html',type=Path)
    a=ap.parse_args();u=urllib.parse.urlsplit(a.url)
    if u.scheme!='https' or u.hostname!='poedb.tw' or not u.path.startswith('/us/'):
        raise ValueError('Use a verified https://poedb.tw/us/<monster> URL for stable English skill properties')
    if a.html:raw=a.html.read_bytes().decode('utf-8')
    else:
        req=urllib.request.Request(a.url,headers={'User-Agent':'Mozilla/5.0'})
        with urllib.request.urlopen(req,timeout=30) as r:raw=r.read().decode('utf-8')
    result=parse_spectre(raw,a.url)
    a.output.parent.mkdir(parents=True,exist_ok=True)
    a.output.write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
    if a.save_html:a.save_html.write_text(raw)
    compact=json.dumps(result,ensure_ascii=False,separators=(',',':'))
    print(json.dumps({'output':str(a.output),'name':result['identity']['name'],'level':result['displayed_monster_level'],'skills':len(result['skills']),'html_bytes':len(raw.encode()),'compact_json_bytes':len(compact.encode()),'warnings':result['warnings']},ensure_ascii=False))

if __name__=='__main__':
    try:main()
    except Exception as e:print('error: '+str(e),file=sys.stderr);sys.exit(1)
