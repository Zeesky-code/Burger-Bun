const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

require('dotenv').config()


const app = express();

const PORT = 9090 

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json());
app.use(cors());


app.get('/', (req,res)=>{
    res.status(200).json({
        status: "true",
        message: "Welcome to Hive"
    })
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})