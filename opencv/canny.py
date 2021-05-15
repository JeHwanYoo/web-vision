import cv2
import sys
from os.path import splitext
from library.b64 import Base64ImageToMatrix
from library.b64 import MatrixToBase64Image
from library.b64 import Base64ImageToDataURL

if __name__ == '__main__':
  with open(sys.argv[1]) as f:
    data_url = f.read()
    img_ext_part, others = data_url.split(';')
    deco1, img_ext = img_ext_part.split('/')
    deco2, img_base64 = others.split(',')
    img_gray = Base64ImageToMatrix(img_base64, cv2.IMREAD_GRAYSCALE)
    edges = cv2.Canny(img_gray, 50, 70)
    img_gray_base64 = MatrixToBase64Image('.' + img_ext, edges)
    print(Base64ImageToDataURL(deco1, deco2, img_ext, img_gray_base64.decode('utf-8')))