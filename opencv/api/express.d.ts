declare namespace Express {
  export interface Request {
    cached: boolean
    image: {
      id: string
      dataURL: string
      parent_id: string | null
      script_by: string | null
    }
  }
}
