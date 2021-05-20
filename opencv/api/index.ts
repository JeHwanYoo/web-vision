import express from 'express'
import { exec } from 'child_process'
import { resolve } from 'path'
import { config } from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { Image } from '~/store/images'
import sha256 from 'crypto-js/sha256'
import randomstring from 'randomstring'

config()

const app = express()

app.use(
  express.json({
    limit: process.env.LIMIT_BODY_SIZE, // default: 10mb
  }),
)

/**
 * save an image middleware (using cache)
 */
async function saveImage(req: express.Request, res: express.Response) {
  try {
    const prisma = new PrismaClient()
    const image: Image = req.body.image
    const cache = await prisma.image.findUnique({
      where: { hash: sha256(image.dataURL).toString() },
    })

    if (!cache) {
      // create a new image data
      await prisma.image.create({
        data: {
          id: image.id,
          dataURL: image.dataURL,
          hash: sha256(image.dataURL).toString(),
        },
      })

      prisma.$disconnect()

      res.send({ cached: false, image })
    } else {
      prisma.$disconnect()

      // send cached image data
      res.send({
        cached: true,
        image: {
          id: cache.id,
          dataURL: cache.dataURL,
        },
      })
    }
  } catch (error) {
    console.log(error)
    errorHandling(res, 400, 'Bad Request', error, 500)
  }
}

/**
 * processing image middleware
 */
async function processing(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  try {
    const prisma = new PrismaClient()
    const image: Image = req.body.image
    const pythonFileName: string = req.body.pythonFileName
    if (image && pythonFileName) {
      const output: string[] = []

      const cached = await prisma.image.findFirst({
        select: { id: true, dataURL: true, parent_id: true, script_by: true },
        where: { parent_id: image.id, script_by: pythonFileName },
      })

      if (cached) {
        req.cached = true
        req.image = cached
        next()
      } else {
        const r = exec(
          `python3 ${resolve(__dirname, '..', pythonFileName)} ${image.id}`,
        )
        let failed = false
        if (r.stdout && r.stderr) {
          r.stdout.on('data', chunk => {
            output.push(chunk)
          })
          r.stdout.on('error', error => {
            output.push(error.toString())
            failed = true
          })
          r.stderr.on('data', chunk => {
            output.push(chunk)
            failed = true
          })
          r.stderr.on('error', error => {
            output.push(error.toString())
            failed = true
          })
          r.stdout.on('end', () => {
            if (failed) {
              prisma.$disconnect()
              errorHandling(res, 400, 'Bad Request', output.join(''))
            } else {
              prisma.$disconnect()
              req.cached = false
              req.image = {
                id: randomstring.generate() + Date.now().toString(),
                dataURL: output.join(''),
                parent_id: image.id,
                script_by: pythonFileName,
              }
              next()
            }
          })
        } else {
          prisma.$disconnect()
          errorHandling(res, 400, 'Bad Request', 'exec failed')
        }
      }
    } else {
      prisma.$disconnect()
      errorHandling(
        res,
        400,
        'Bad Request',
        'dataURL or pythonFileName is missing',
        400,
      )
    }
  } catch (error) {
    errorHandling(res, 400, 'Bad Request', error, 500)
  }
}

/**
 * sending output middleware
 */
async function sendOutput(req: express.Request, res: express.Response) {
  try {
    if (!req.cached) {
      const prisma = new PrismaClient()
      // create a new image data
      await prisma.image.create({
        data: {
          id: req.image.id,
          dataURL: req.image.dataURL,
          hash: sha256(req.image.dataURL).toString(),
          parent_id: req.image.parent_id,
          script_by: req.image.script_by,
        },
      })
      prisma.$disconnect()
    }

    res.send(req.image)
  } catch (error) {
    // The conversion result is the same.
    if (error.code === 'P2002') {
      const prisma = new PrismaClient()

      const cached = await prisma.image.findUnique({
        select: { id: true, dataURL: true, parent_id: true, script_by: true },
        where: { hash: sha256(req.image.dataURL).toString() },
      })

      prisma.$disconnect()

      res.send(cached)
    } else {
      errorHandling(res, 400, 'Bad Request', error, 500)
    }
  }
}

/**
 * checking cache image
 */
app.post('/image', saveImage)

/**
 * processing api
 */
app.post('/processing', processing, sendOutput)

/**
 *
 * @param res express.Response
 * @param pcode error code for production
 * @param pmessage error message for production
 * @param dmessage error message for development
 * @param dcode error code for development (default = 500)
 */
function errorHandling(
  res: express.Response,
  pcode: number,
  pmessage: string,
  dmessage: any,
  derror: number = 500,
) {
  if (process.env.NODE_ENV === 'production') {
    res.status(pcode)
    res.send(pmessage)
  } else {
    res.status(derror)
    res.send(dmessage)
  }
}

export default {
  path: '/api',
  handler: app,
}
