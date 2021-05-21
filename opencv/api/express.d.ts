declare namespace Express {
  export interface Request {
    cached: boolean
    itself?: boolean
    image?: {
      id: string
      dataURL: string
      parent_id: string | null
    } | null
    newImgID: string
  }
}
