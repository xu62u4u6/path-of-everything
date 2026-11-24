#!/usr/bin/env python3
"""Batch a prepared upgrade watchlist; preserve raw sources and emit compact evidence."""
import argparse,datetime,hashlib,json,time,urllib.request,urllib.parse,urllib.error
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--manifest',required=True);p.add_argument('--output',required=True);p.add_argument('--refresh',action='store_true');p.add_argument('--offline',action='store_true');args=p.parse_args()
root=Path(args.output).resolve();root.mkdir(parents=True,exist_ok=True);cache=root/'cache';cache.mkdir(exist_ok=True);manifest=json.loads(Path(args.manifest).read_text())
now=datetime.datetime.now(datetime.timezone.utc).isoformat();league=manifest['league']
def get(url,method='GET',body=None):
 key=hashlib.sha256((method+url+json.dumps(body,sort_keys=True)).encode()).hexdigest();file=cache/(key+'.json')
 if file.exists() and (args.offline or not args.refresh and time.time()-file.stat().st_mtime<600):
  value=json.loads(file.read_text());return {**value,'cacheHit':True}
 if args.offline:return {'url':url,'status':'not_cached','retrievedUtc':None}
 try:
  req=urllib.request.Request(url,data=json.dumps(body).encode() if body else None,method=method,headers={'User-Agent':'Mozilla/5.0','Content-Type':'application/json'})
  with urllib.request.urlopen(req,timeout=25) as response:data=json.load(response)
  value={'url':url,'status':200,'retrievedUtc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'data':data}
 except urllib.error.HTTPError as e:value={'url':url,'status':e.code,'retrievedUtc':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 except Exception as e:value={'url':url,'status':'error','error':str(e),'retrievedUtc':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 file.write_text(json.dumps(value,ensure_ascii=False));return {**value,'cacheHit':False}
items=manifest['items']
if not items: raise ValueError('Watchlist has no items')
league=urllib.parse.quote(league,safe='')
# A single official request establishes availability; a 403/429 opens the circuit.
probe=get('https://www.pathofexile.com/api/trade/search/'+league,'POST',items[0]['query']);blocked=probe['status'] in [403,429] or probe['status']!=200
category_data={}
for category in sorted({i['category'] for i in items if 'category' in i}):
 kind=next((i.get('sourceKind','stash') for i in items if i.get('category')==category),'stash')
 endpoint='exchange/current/overview' if kind=='exchange' else 'stash/current/item/overview'
 result=get('https://poe.ninja/poe1/api/economy/'+endpoint+'?'+urllib.parse.urlencode({'league':urllib.parse.unquote(league),'type':category}))
 if kind=='exchange' and result.get('status')==200:
  raw=result['data'];converted=[]
  if raw.get('core',{}).get('primary')=='chaos':
   by_id={i['id']:i for i in raw.get('items',[])}
   for line in raw.get('lines',[]):
    meta=by_id.get(line['id'],{});converted.append({'name':meta.get('name'),'detailsId':meta.get('detailsId'),'chaosValue':line.get('primaryValue')})
  result={**result,'data':{'lines':converted}}
 category_data[category]=result
 time.sleep(.35) if not args.offline else None
results=[]
for index,item in enumerate(items):
 source=category_data.get(item.get('category'),{});lines=source.get('data',{}).get('lines',[])
 matches=[x for x in lines if x.get('name')==item.get('name') and all((x.get(k) or 0)==item[k] for k in ['gemLevel','gemQuality'] if k in item)]
 refs=[{k:x.get(k) for k in ['name','gemLevel','gemQuality','corrupted','variant','chaosValue','listingCount','detailsId']} for x in matches]
 trade=probe if index==0 else {'status':'skipped_after_official_block'} if blocked else get('https://www.pathofexile.com/api/trade/search/'+league,'POST',item['query'])
 if trade['status'] in [403,429]:blocked=True
 records=[]
 if trade.get('status')==200:
  search=trade['data'];ids=search.get('result',[])[:max(5,min(10,int(item.get('inspectLimit',5))))]
  if ids:
   fetched=get('https://www.pathofexile.com/api/trade/fetch/'+','.join(ids)+'?query='+search['id'])
   for x in fetched.get('data',{}).get('result',[]):
    it=x.get('item',{});records.append({'id':x.get('id'),'price':x.get('listing',{}).get('price'),'name':it.get('name'),'typeLine':it.get('typeLine'),'properties':it.get('properties'),'implicitMods':it.get('implicitMods'),'explicitMods':it.get('explicitMods'),'craftedMods':it.get('craftedMods'),'fracturedMods':it.get('fracturedMods'),'corrupted':it.get('corrupted'),'sockets':it.get('sockets')})
  link='https://www.pathofexile.com/trade/search/'+league+'/'+search['id']
 else:link='https://www.pathofexile.com/trade/search/'+league+'?q='+urllib.parse.quote(json.dumps(item['query'],separators=(',',':')))
 results.append({'id':item['id'],'label':item['label'],'tradeStatus':trade.get('status'),'tradeUrl':link,'query':item['query'],'listings':records,'reference':refs,'referenceStatus':source.get('status','not_applicable'),'referenceUrl':source.get('url'),'referenceRetrievedUtc':source.get('retrievedUtc'),'coverage':item['coverage']})
report={'league':league,'checkedUtc':now,'mode':'offline' if args.offline else 'network/cache','statIdsSource':manifest.get('statIdsSource','Not supplied'),'officialStatus':probe['status'],'results':results,'pendingNonPurchases':manifest.get('pendingNonPurchases',[])}
(root/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
md=['# '+manifest.get('title','升級查價清單'),'',f'聯盟：{league}；查詢UTC：{now}。官方交易狀態：{probe["status"]}。','市場參考價不等於已核對即買價。未核對賣家詞綴前，所有採購維持未完成。','', '|待辦|市場參考價（c）|限制／狀態|交易搜尋|','|---|---:|---|---|']
for row in results:
 values=[str(x['chaosValue']) for x in row['reference'] if x.get('chaosValue') is not None];ref=' / '.join(values) or '未取得'
 md.append(f'|[ ] {row["label"]}|{ref}|{row["coverage"]}；官方 {row["tradeStatus"]}|[開啟搜尋]({row["tradeUrl"]})|')
md+=['','## 尚非購物項目']+['- [ ] '+x for x in report['pendingNonPurchases']]
(root/'shopping-list.md').write_text('\n'.join(md)+'\n')
print(json.dumps({'league':league,'officialStatus':probe['status'],'items':len(results),'withReferences':sum(bool(x['reference']) for x in results),'report':str(root/'shopping-list.md')},ensure_ascii=False))
