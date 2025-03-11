import express, {Request, Response, NextFunction} from "express";
import cors from "cors";
import bcrypt from "bcrypt"
import jwt, { JwtPayload } from "jsonwebtoken"
import { PrismaClient, User } from '@prisma/client'
import dotenv from "dotenv"

const prisma = new PrismaClient()

const app = express();

const SALT_ROUNDS = 10;

dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());

const createJWT = (user: User): string => {
     return jwt.sign(
      {id: user.id, email: user.email},
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
     ) 
}


app.post("/sign-up", async (req: Request, res: Response) => {

  // Läs in användares email och lösenord
  const { email, password } = req.body;

  const userExists = await prisma.user.findUnique({
    where: { 
      email: email
     }
  })

  if(userExists) {
    res.status(409).json({ message: "User already exists"})
    return;
  }

  // Kryptera lösenordet innan det sparas i DB
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)
   
  // Spara användaren till databasen
  const user = await prisma.user.create({
    data: {
      email: email,
      password: hashedPassword
    }
  })

  res.status(201).json({message: `User created ${user.id} ${user.email}`})

})


app.post("/sign-in", async (req: Request, res: Response) => {

  // Hämta användare i databasen utifrån email
  const {email, password} = req.body;

  const user = await prisma.user.findUnique({
      where: {
        email: email
      }
  })

  // Om anvädnaren inte finns i databasen
  if(!user) {
    res.status(404).json({ message: "Username does not exist"})
    return;
  }

  // Kolla om det inkommande lösenordet är samma som användaren i databasen 
  const isPasswordValid = await bcrypt.compare(password, user.password)

  if(!isPasswordValid) {
    res.status(401).json({ message: "Invalid credentials"});
    return;
  }

  // Skapa en JWT - JSON Web Token
  const token = createJWT(user);
  console.log(token);

  res.status(200).json({ token});


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



