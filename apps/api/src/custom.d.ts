// req.user
type User = {
    id: number
    name: string
    email: string
    type: string
}
declare namespace Express {
    export interface Request {
        user?: User
    }
}