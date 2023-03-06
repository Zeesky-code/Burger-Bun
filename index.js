const express = require('express')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')

require('dotenv').config()


const app = express();

const PORT = 9090 || process.env.PORT

app.use(bodyParser.urlencoded({extended:false}))
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));


// app.get('/', (req,res)=>{
//     res.status(200).json({
//         status: "true",
//         message: "Welcome to Hive"
//     })
// })


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})