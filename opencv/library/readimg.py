import sqlite3
import os
import sys
from pathlib import Path

sys.path.append(os.path.dirname(__file__) + '/library')

def readimg(img_id):
  db_path = Path(os.path.dirname(__file__) + '/../../store/database/images.db')

  con = sqlite3.connect(db_path)

  cur = con.cursor()
  cur.execute('SELECT * FROM Image WHERE id = ?', [img_id])
  row = cur.fetchone()

  con.close()

  return row
