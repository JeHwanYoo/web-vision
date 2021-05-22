import sqlite3
import os
import sys
from pathlib import Path
from hashlib import sha256

sys.path.append(os.path.dirname(__file__) + '/library')

def saveimg(id, dataURL, parent_id, script_by):
  db_path = Path(os.path.dirname(__file__) + '/../../store/database/images.db')
  script_by = os.path.basename(script_by)
  hash = sha256(dataURL.encode('utf-8')).hexdigest()

  con = sqlite3.connect(db_path)

  cur = con.cursor()
  cur.execute('SELECT id, hash FROM Image WHERE hash = ?', [hash])
  img = cur.fetchone()

  if img == None:
    cur.execute('INSERT INTO Image (id, dataURL, hash, parent_id, script_by) VALUES (?, ?, ?, ?, ?)', [id, dataURL, hash, parent_id, script_by])
    con.commit()
  else:
    print(img[0])

  con.close()

