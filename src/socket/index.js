const SocketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { getDateOfTimezone } = require("../../lib/cyphers");
const allowedOrigins = require("../../hobbyland.config")

let io;
const initSocket = async (server) => {
    io = SocketIO(server, {
        cors: { origin: allowedOrigins }
    });

    io.use((socket, next) => {
        console.log("A candidate just appeared with id: " + socket.id)
        const authError = () => { console.log("Socket handshake authentication error"); next(new Error('Authentication error')); }
        if (!socket?.handshake?.query?.token) return authError();
        jwt.verify(socket.handshake.query.token, process.env.AUTH_SECRET, (err, decoded) => {
            if (err) return authError();
            socket.user = decoded;
            next();
        });
    });

    io.on('connection', async (socket) => {
        const { user } = socket;

        await User.findByIdAndUpdate(user.id, {
            socket: {
                id: socket.id,
                active: true,
                last_active: null
            }
        })
        socket.join(user.id);
        io.emit('online', { id: user.id });
        console.log("A user with id: " + user.id + " connected!")

        socket.on('disconnect', async () => {
            await User.findByIdAndUpdate(user.id, {
                socket: {
                    active: false,
                    last_active: getDateOfTimezone(user.timezone)
                }
            }, { new: true, lean: true });
            console.log("A user with id: " + user.id + " disconnected!")
            io.emit('offline', { id: user.id });
        });
    });

    console.log('socket system online');
};

module.exports = { initSocket, io };
