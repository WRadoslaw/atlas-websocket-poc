import express from 'express'
import { createServer } from 'node:http'
import {Server} from "socket.io";
import {PROCESSOR_SECRET, SOCKET_PORT} from './config'

const logger = (args: string) => {
    console.log('Websocket server:: ', args)
}

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer)
io.on('connection', () => {
    logger('Someone connected')
})

httpServer.listen(SOCKET_PORT)

logger('Websocket sever running')

const canUserJoinRoom = (roomId: string) => true
io.on('connection', socket => {
    logger('New user connection')
    socket.on('join-room', (args: { roomId: string}) => {
        if(!canUserJoinRoom(args.roomId)) {
            socket.send('Access denied')
            return
        }
        logger(`Room ${args.roomId} join by user`)
        socket.join(args.roomId)
    })

    socket.on('leave-room', (args: { roomId: string}) => {
        socket.leave(args.roomId)
    })
})

// PROCESSOR IO

const processorIo = io.of('/processor')

processorIo.use((socket, next) => {
    logger('Processor check auth')
    const authToken = socket.handshake.auth.token

    if(authToken !== PROCESSOR_SECRET) {
        next(new Error('Invalid credentials'))
    }

    if(processorIo.sockets.size > 0 ) {
        next(new Error('only single processor connection is allowed'))
    }

    logger('Processor auth check success')
    next()
})

type Video = {
    id: string
    likesCount: number
    description: string
    title: string
}

type VideoUpdatedPayload = {
    videoId: string
    partialData: Partial<Video>
}

processorIo.on('connection', (socket) => {
    socket.on('video-updated', (args: VideoUpdatedPayload) => {
        logger(`Video updated event received for room video-${args.videoId}`)
        io.to( `video-${args.videoId}`).emit('video-updated', {
            ...args.partialData
        })
    })
})



