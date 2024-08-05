
const express = require('express')

const searchRouter = require('./routes/search.routers')
const postRouter = require('./routes/post.routes')
const dbRouter = require('./routes/db.router')
const PORT = 14370
const app = express()

app.use(express.text())
app.use('/api', postRouter) 


app.use(express.json())
app.use('/api2', postRouter) 
app.use('/search', searchRouter)
app.use('/record', postRouter) 
app.use('/db', dbRouter)
app.listen(PORT, () => console.log('Server started and listen on port:', 8083))

