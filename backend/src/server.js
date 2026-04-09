import app from './app.js';
import connectToDB from "./config/db.js";

const PORT=process.env.PORT || 3000;

async function startServer(){
    try{
        await connectToDB();
        app.listen(PORT,()=>{
            console.log(`Server is running on port ${PORT}. 
                link: http://localhost:${PORT}`);
        });
    }catch(er){
        console.error('Error starting server: ', er.message);
        process.exit(1);
    }
}
startServer();