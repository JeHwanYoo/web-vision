import base64
import cv2
import numpy as np

# Base64 Image to OpenCV Matrix
def Base64ImageToMatrix(img_base64, flags):
  img_bytes = base64.b64decode(img_base64)
  img_buf = np.frombuffer(img_bytes, np.uint8)
  img_mat = cv2.imdecode(img_buf, flags)
  return img_mat

# OpenCV Matrix to Base64 Image
def MatrixToBase64Image(ext, img_mat):
  retval, img_buf = cv2.imencode(ext, img_mat)
  img_string = base64.b64encode(img_buf)
  return img_string

# Base64 Image to DataURL
def Base64ImageToDataURL(deco1, deco2, img_ext, img_base64):
  return deco1 + '/' + img_ext + ';' + deco2 + ',' + img_base64