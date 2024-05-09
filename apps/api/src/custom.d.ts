// req.user
type User = {
    id: number
    isPromotor: Boolean
}
declare namespace Express {
    export interface Request {
        user?: User
    }
}