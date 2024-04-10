import { io } from 'socket.io-client'
import {PROCESSOR_SECRET, SOCKET_PORT} from "./config";

const logger = (args: string) => {
    console.log('Processor mock:: ', args, '\n')
}

const socket = io(`http://localhost:${SOCKET_PORT}/processor`, {
    auth: {
        token: PROCESSOR_SECRET
    },
})

logger('Emitting video updated event')
socket.emit('video-updated', {
    videoId: '1',
    partialData: {
        title: 'Updated title'
    }
})
