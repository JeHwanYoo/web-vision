import base64
import cv2
import numpy as np

# Base64 Image to OpenCV Matrix
def base64_image_to_matrix(img_base64, flags):
  img_bytes = base64.b64decode(img_base64)
  img_buf = np.frombuffer(img_bytes, np.uint8)
  img_mat = cv2.imdecode(img_buf, flags)
  return img_mat

# OpenCV Matrix to Base64 Image
def matrix_to_base64_image(ext, img_mat):
  retval, img_buf = cv2.imencode(ext, img_mat)
  img_string = base64.b64encode(img_buf)
  return img_string.decode('utf-8')

# Base64 Image to DataURL
def base64_image_to_data_URL(prefix, img_ext, infix, img_base64):
  return prefix + '/' + img_ext + ';' + infix + ',' + img_base64

# Split dataURL
def split_data_url(data_url):
  a, b = data_url.split(';')
  prefix, img_ext = a.split('/')
  infix, img_base64 = b.split(',')
  return prefix, img_ext, infix, img_base64
