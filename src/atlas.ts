import { io } from 'socket.io-client'
import {SOCKET_PORT} from "./config";

const logger = (args: string) => {
    console.log('Atlas mock:: ', args, '\n')
}

// Atlas started
const socket = io(`http://localhost:${SOCKET_PORT}`)

// User enters the video page with given ID, in the case `1`
logger('Joining room for video ID 1')
socket.emit('join-room', {
    roomId: 'video-1'
})

// Some manager will listen in the background for an update
// and either update cache on given video ID with partial entity data
// or refetch the data through GraphQL
socket.on('video-updated', payload => {
    logger(`Receive video-updated event with payload, ${JSON.stringify(payload)}`)


    // This will be emitted when user leaves the page to avoid
    logger('Exiting the room due to page change')
    socket.emit('leave-room', 'video-1')
})


