import express, {Request, Response, NextFunction} from "express";
import cors from "cors";
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


app.post("/sign-up", (req: Request, res: Response) => {

  // Läs in användares email och lösenord

  // Kryptera lösenordeet innan det sparas i DB

})


app.post("/sign-in", (req: Request, res: Response) => {

  // Hämta användare i databasen utifrån email

  // Kolla om det inkommande lösenordet är samma som användaren i databasen 

      // Skapas en JWT - JSON Web Token

      // Skicka token till klienten

})

// Middleware 
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

  // Kolla om token är valid

}


app.get("/dashboard", authMiddleware, (req: Request, res: Response) => {

})



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});



