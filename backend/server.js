import app from './app.js'
import dotenv from 'dotenv'
import {connectMongoDatabase} from './config/db.js'
dotenv.config({path :'backend/config/config.env'})

connectMongoDatabase();
const port = process.env.PORT || 3000

app.listen(process.env.PORT,() =>{
    console.log(`Server is running on Port ${process.env.port}`)
})
