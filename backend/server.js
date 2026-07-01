import app from './app.js'
import dotenv from 'dotenv'
import {connectMongoDatabase} from './config/db.js'
dotenv.config({path :'backend/config/config.env'})
connectMongoDatabase();

process.on('uncaughtException' , (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Server is shutting down due to uncaught exception error(s)`);
    process.exit(1);   
})
const port = process.env.PORT || 3000

app.listen(process.env.PORT,() =>{
    console.log(`Server is running on Port ${process.env.PORT}`)
})
// console.log(myName);

process.on('unhandledRejection' , (err) => {
    console.log(`Error : ${err.message}`)
    console.log(`Server is shutting down , due to unhandled Promise rejection`);
    server.close(()=>{
        process.exit(1);
    })
})