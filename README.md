# web-vison

It is an open source project to provide opencv function on the web.

## Build Setup

This project was created using Nuxt.

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## setting .env

Create a [.env file](https://www.npmjs.com/package/dotenv) on top of your project.

```
LIMIT_BODY_SIZE = 10mb
```

|   enviroment    |         type          |                                                                                                                                                                     comment |
| :-------------: | :-------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| LIMIT_BODY_SIZE | Memory Representation | After encoding the image as base64, you need to allow enough body size to be sent to the server. If the image size is larger than the allowed size, a 413 error will occur. |

## using opencv-python

This project requires [opencv-python](https://pypi.org/project/opencv-python/).

So, python and opencv-python must be properly installed on the server and it will use the server's resources.

If you are hosting online, consider the cost issue.

## Main Development Progress

- [*] Basic Image Processing (0.1.x)
- [ ] Multiple File Support (0.2.x)
- [ ] Histogram (0.3.x)
- [ ] Filtering (0.4.x)
- [ ] Finding Edges, Corner Points, ETC... (0.5.x)
- [ ] Video, Gif Extension Support (0.6.x)
- [ ] Webcam Support (0.7.x)

The plan can change at any time.
