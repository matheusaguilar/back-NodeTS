class SocketService{

    constructor(){
        this.io = null;
        /**
         * Define Events
         */
        this.CHAT_MESSAGE_EVENT = 'chat_message';
    }

    getConnection(io){
        if (!this.io){
            this.io = io;

            io.on('connection', (socket) => {
                //add the client in an unique room based in his userId
                if (!!socket.handshake.query.userId){
                    socket.join(socket.handshake.query.userId);
                }
            });
        }
    }

    emitEvent(event, userId, data){
        if (!!this.io){
            this.io.to(userId).emit(event, data);
        }
    }

}

module.exports = new SocketService();