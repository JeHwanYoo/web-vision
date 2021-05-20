# web-vison

It is an open source project to provide opencv function on the web.

## installation

git clone https://github.com/JeHwanYoo/web-vision.git

## Build Setup

![built with nuxt](https://ko.nuxtjs.org/logos/built-with-nuxt.svg)

This project was created using Nuxt.

```bash
# install dependencies
$ npm install

# migrate prisma (SQLite)
$ npx prisma migrate

# using prisma studio (SQLite)
$ npx prisma studio

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org) and [Prisma docs](https://www.prisma.io/docs/)

## Setting .env

Create a [.env file](https://www.npmjs.com/package/dotenv) on top of your project.

```
LIMIT_BODY_SIZE = 10mb
```

|   enviroment    |         type          |                                                                                                                                                                     comment |
| :-------------: | :-------------------: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| LIMIT_BODY_SIZE | Memory Representation | After encoding the image as base64, you need to allow enough body size to be sent to the server. If the image size is larger than the allowed size, a 413 error will occur. |

## Using opencv-python

This project requires [opencv-python](https://pypi.org/project/opencv-python/).

So, python and opencv-python must be properly installed on the server and it will use the server's resources.

If you are hosting online, consider the cost issue.

## Schema of OpenCV command

In 'opencv' directory, you can expand opencv function. Basically, I haven't implemented many features yet. More features will be added in future versions, and you can add your own.

If necessary, it would be a good idea to make the directory a Git submodule.

In 'opencv/api/client.ts' file, defines the interface of the opencv function to be executed on the client.

## About image caching

The same results are reused using caching.

The list is incremented only if the results are different.

Sometimes using a different pipeline can produce the same result. Because the results are the same.

## Main Development Progress

- [x] Basic Image Processing (0.1.x)
- [ ] Composite of Two or More Images (0.2.x)
- [ ] Histogram (0.3.x)
- [ ] Filtering (0.4.x)
- [ ] Finding Edges, Corner Points, ETC... (0.5.x)
- [ ] Video, Gif Extension Support (0.6.x)
- [ ] Webcam Support (0.7.x)

The plan can change at any time.

## Preview
![Preview](https://raw.githubusercontent.com/JeHwanYoo/web-vision/main/screenshot.PNG)

## Version History

See [CHANGELOG.md](https://github.com/JeHwanYoo/web-vision/blob/main/CHANGELOG.md)
