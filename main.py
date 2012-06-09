#!/usr/bin/env python
#
# Copyright 2007 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#
import webapp2
import os
from google.appengine.ext.webapp import util
from google.appengine.ext.webapp import template
from google.appengine.api import urlfetch

class MainHandler(webapp2.RequestHandler):
    def get(self):
        template_values = {}
        path = os.path.join(os.path.dirname(__file__), 'index.html')
        self.response.headers['Content-Type'] = 'text/html; charset=UTF-8'
        self.response.out.write(template.render(path, template_values))
class imgPreload(webapp2.RequestHandler):
    def get(self):
        list1=["e/b.jpg","w/n001.ogg","e/c001a.jpg","e/c001b.jpg","e/c001.jpg","e/c002.jpg","e/c003.jpg","e/c004.jpg","e/b.jpg","se/rain_1.wav","e/sora_ame03.jpg","e/c02.bmp","bgm/n04.mp3","e/sora_ame01.jpg","w/n002.ogg","e/byoin_heya_yu2.jpg","se/rain_1.wav","e/sora_ame03.jpg","e/sora_ame01.jpg","e/chara_k01.jpg","w/n003.ogg","w/n004.ogg","e/chara_k01.jpg","w/n005.ogg","se/rain_1.wav","e/w.jpg","e/sora_ame03.jpg","w/n006.ogg","w/n007.ogg","e/chara_0012.jpg","w/n008.ogg","e/chara_0013b.jpg","e/c005.jpg","e/c0052.jpg","e/w.jpg","e/kfc01.jpg","e/kfc01.jpg","e/kfc01c.jpg","e/kfc01d.jpg","e/w.jpg","se/z42r.wav","e/w.jpg","e/sora01.jpg","e/c00.jpg","e/sora01.jpg","e/b.jpg","se/faan1_b.wav","e/sora_yoru01.jpg","e/b.jpg","e/byoin_rouka.jpg","e/b.jpg","e/sora07.jpg","e/c03.jpg","tui2/e01.mp3","e/sora07.jpg","e/c033.jpg","e/b.jpg","e/amazora02.jpg","e/w.jpg","e/w.jpg","e/c032.jpg","e/byoin_rouka.jpg","e/b.jpg","e/byoin7_rouka.jpg","e/b.jpg","e/w.jpg","e/nar01.jpg","w/n009.ogg","e/nar01.jpg","e/nar01c.jpg","e/nar01d.jpg","e/w.jpg"]
        start = int(self.request.get('int'))+1
        count=0
        list2=[]
        for xx in list1:
            count = count + 1
            if count>=start and count<=start+5:
			    list2.append(xx)
        self.response.out.write(",".join(list2))
class getscript(webapp2.RequestHandler):
    def get(self):
        result = urlfetch.fetch('http://icemaple.info/gal/n1.txt')
        if result.status_code == 200:  
            doc = result.content
            self.response.out.write(doc)
        #f=open('ns/n1.txt','r')
        #self.response.out.write(f.read())
        #f.close()


app = webapp2.WSGIApplication([('/', MainHandler),('/imgPreload', imgPreload),('/getscript', getscript)],
                              debug=True)
