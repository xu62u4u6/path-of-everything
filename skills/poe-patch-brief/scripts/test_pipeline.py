#!/usr/bin/env python3
"""Regression for observed source contamination and reference integrity failures."""
import hashlib,json,pathlib,subprocess,sys,tempfile,unittest
HERE=pathlib.Path(__file__).parent
class PipelineTests(unittest.TestCase):
 def setUp(self):self.tmp=tempfile.TemporaryDirectory();self.root=pathlib.Path(self.tmp.name)
 def tearDown(self):self.tmp.cleanup()
 def extract(self,html):
  h=self.root/'official.html';h.write_text(html);p=self.root/'source.json'
  r=subprocess.run([sys.executable,str(HERE/'extract.py'),str(h),'--version','3.28','--url','https://www.pathofexile.com/forum/view-thread/example','--out',str(p)],capture_output=True,text=True)
  return r,json.loads(p.read_text()) if p.exists() else None
 def test_nested_sources_and_revision_boundary(self):
  r,s=self.extract('<title>Content Update 3.28.0</title><div class="newsPost"><div class="content"><div class="lbox-container" id="skill"><div class="box-content"><h3>Skill Gem Changes</h3><ul><li>Brand rework<ul><li>Cooldown .75 to 1 second.</li></ul></li><li>Current final value.</li></ul><span><strong>Updates for 2026-03-02</strong></span><div class="spoiler"><strong>Removed Patch Notes:</strong><ul><li>Old value that was withdrawn.</li></ul></div></div></div></div></div><div class="comment"><li>Comment must not enter source.</li></div>')
  self.assertEqual(r.returncode,0,r.stderr);self.assertEqual(len(s['nodes']),3);self.assertEqual(s['nodes'][0]['text'],'Brand rework');self.assertEqual(s['nodes'][1]['parents'],['s01-001']);self.assertEqual(s['revision_log'][0]['text'],'Old value that was withdrawn.');self.assertNotIn('withdrawn',str(s['nodes']));self.assertNotIn('Comment',str(s['nodes']))
 def test_missing_post_fails_closed(self):
  r,s=self.extract('<title>3.28</title><div class="content"><li>Comment</li></div>');self.assertNotEqual(r.returncode,0);self.assertIsNone(s)
 def test_wrong_version_fails_closed(self):
  r,s=self.extract('<title>3.29</title><div class="newsPost"><div class="content"></div></div>');self.assertNotEqual(r.returncode,0)
 def test_verify_rejects_lost_or_invented_source(self):
  s={'version':'3.28','sha256':'snapshot','sections':[{'id':'s01'}],'nodes':[{'id':'s01-001','section':'s01','text':'A real change'}]}
  d={'version':'3.28','source_sha256':'snapshot','sections':{'s01':'技能'},'directions':[],'entries':[{'id':'e001','name':'技能','section':'s01','verdict':'up','importance':'normal','changes':[{'text':'有意義改動','source_ids':['s01-999']}]}]}
  (self.root/'source.json').write_text(json.dumps(s));(self.root/'analysis.json').write_text(json.dumps(d))
  r=subprocess.run([sys.executable,str(HERE/'verify.py'),str(self.root/'source.json'),str(self.root/'analysis.json')],capture_output=True,text=True);self.assertNotEqual(r.returncode,0);self.assertIn('Unreviewed source',r.stdout);self.assertIn('unknown source',r.stdout)
 def test_verify_rejects_stale_snapshot(self):
  s={'version':'3.28','sha256':'new','sections':[],'nodes':[]};d={'version':'3.28','source_sha256':'old','sections':{},'directions':[],'entries':[]}
  (self.root/'source.json').write_text(json.dumps(s));(self.root/'analysis.json').write_text(json.dumps(d))
  r=subprocess.run([sys.executable,str(HERE/'verify.py'),str(self.root/'source.json'),str(self.root/'analysis.json')],capture_output=True,text=True);self.assertNotEqual(r.returncode,0);self.assertIn('snapshot',r.stdout)
if __name__=='__main__':unittest.main()
