import cv2
import sys
import os
sys.path.append(os.path.dirname(__file__) + '/library')

from b64 import base64_image_to_matrix
from b64 import matrix_to_base64_image
from b64 import base64_image_to_data_URL
from b64 import split_data_url
from readimg import readimg
from saveimg import saveimg

if __name__ == '__main__':
  img = readimg(sys.argv[1])
  new_img_id = sys.argv[2]
  data_url = img[2]
  prefix, img_ext, infix, img_base64 = split_data_url(data_url)
  img_gray = base64_image_to_matrix(img_base64, cv2.IMREAD_GRAYSCALE)
  edges = cv2.Canny(img_gray, 50, 70)
  img_canny_base64 = matrix_to_base64_image('.' + img_ext, edges)
  new_data_url = base64_image_to_data_URL(prefix, img_ext, infix, img_canny_base64)
  saveimg(new_img_id, new_data_url, img[0], __file__)