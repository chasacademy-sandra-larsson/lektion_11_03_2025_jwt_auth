import  {Request, Response, NextFunction} from "express";
import jwt, { JwtPayload } from "jsonwebtoken" // Skapa en krypterad token

 interface ProtectedRequest extends Request {
    user?: JwtPayload;
  }

// Middleware 
export const authMiddleware = (req: ProtectedRequest, res: Response, next: NextFunction) => {

    // Hämta från request-headern         
    // Bearer sdfhsdkjfjldsfjlkds
    const bearerToken = req.headers.authorization?.split(" ")[1]
  
    // Har vi fått en bearerToken?
    if(!bearerToken) {
      res.status(401).json({ message: "Unauthorized, no token"})
      return;
    }
  
    if(!process.env.JWT_SECRET) {
      res.status(500).json({ message: "JWT SECTRET is not defined"})
      return;
    }
  
    // Kolla om token är valid med jwt.verify()
    try {
      const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET as string) as JwtPayload
      req.user = decoded;
      console.log("Req user", req.user);
      next();
  
    } catch(error) {
      console.log(error);
      res.status(401).json({ message: "Unauthorized, invalid token"})
    }
  
  
  }