import express from 'express'
import { exec } from 'child_process'
import { resolve } from 'path'
import { config } from 'dotenv'
import { writeFile, unlink } from 'fs'
import randomstring from 'randomstring'

config()

const app = express()

app.use(
  express.json({
    limit: process.env.LIMIT_BODY_SIZE, // default: 10mb
  }),
)

/**
 * processing image middleware
 */
function processing(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) {
  const dataURL = req.body.dataURL
  const pythonFileName = req.body.pythonFileName
  if (dataURL && pythonFileName) {
    const output: string[] = []
    const tmpPath = resolve(__dirname, '.tmp')
    const tmpFileName = randomstring.generate()
    const tmpFilePath = resolve(tmpPath, tmpFileName)

    writeFile(tmpFilePath, dataURL, () => {
      const r = exec(
        `python3 ${resolve(__dirname, '..', pythonFileName)} ${tmpFilePath}`,
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
            errorHandling(res, 400, 'Bad Request', output)
            unlink(tmpFilePath, () => {})
          } else {
            req.output = output
            next()
            unlink(tmpFilePath, () => {})
          }
        })
      } else {
        errorHandling(res, 400, 'Bad Request', 'exec failed')
      }
    })
  } else {
    errorHandling(
      res,
      400,
      'Bad Request',
      'dataURL or pythonFileName is missing',
      400,
    )
  }
}

/**
 * sending output middleware
 */
function sendOutput(req: express.Request, res: express.Response) {
  res.send(req.output)
}

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
