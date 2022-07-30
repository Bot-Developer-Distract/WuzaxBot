const mongoose = require("mongoose")
require("dotenv").config()

mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: true }).then(() => {
    console.log("[Database] Connected !")
}).catch(() => {
    console.log("[Database] Not Connected !")
})