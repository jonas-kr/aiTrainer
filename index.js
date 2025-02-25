const express = require("express")
const app = express()
const cors = require("cors")
const port = 3000
const aiRoute = require("./routes/aiRoute")


app.use(cors())
app.use(express.json())

app.use("/api/ai", aiRoute)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})