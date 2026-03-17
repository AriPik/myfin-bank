const http = require("http")
const { Server } = require("socket.io")

const app = require("./app")

const server = http.createServer(app)

const io = new Server(server)

io.on("connection", (socket) => {
    console.log("User connected")

    socket.on("chat message", (msg) => {
        io.emit("chat message", msg)
    })

    socket.on("disconnect", () => {
        console.log("User disconnected")
    })
})

const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})