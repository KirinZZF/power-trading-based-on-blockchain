import io from 'socket.io-client'
const userSocket = io('192.168.137.37:5000')
export default userSocket