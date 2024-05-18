// req.user
type User = {
    id: number
    name: string
    email: string
    type: string
    userId?: number
}
declare namespace Express {
    export interface Request {
        user?: User
    }
}