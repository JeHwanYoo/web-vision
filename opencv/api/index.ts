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
    limit: process.env.LIMIT_BODY_SIZE,
  }),
)

app.post('/conversion/gray', (req, res) => {
  const dataURL = req.body.dataURL
  if (dataURL) {
    const output: string[] = []
    const tmpPath = resolve(__dirname, '.tmp')
    const tmpFileName = randomstring.generate()
    const tmpFilePath = resolve(tmpPath, tmpFileName)

    writeFile(tmpFilePath, dataURL, () => {
      const r = exec(
        `python3 ${resolve(__dirname, '..', 'to_gray.py')} ${tmpFilePath}`,
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
            // unlink(tmpFilePath, () => {})
          } else {
            res.json(output)
            // unlink(tmpFilePath, () => {})
          }
        })
      } else {
        res.sendStatus(400)
      }
    })
  } else {
    res.sendStatus(400)
  }
})

function errorHandling(
  res: express.Response,
  pcode: number,
  pmessage: string,
  dmessage: any,
) {
  if (process.env.NODE_ENV === 'production') {
    res.status(pcode)
    res.send(pmessage)
  } else {
    res.status(500)
    res.send(dmessage)
  }
}

export default {
  path: '/api',
  handler: app,
}
