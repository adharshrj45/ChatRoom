const ws=require('ws');

const server=new ws.Server({port:3400})

let rooms={}

const broadcast=(roomno,message)=>{

    const room=rooms[roomno]
    console.log(message.message)

    for(let users in room ){
        let socket=room[users].socket; 
        socket.send(JSON.stringify(message))
    }
}

server.on('connection',(socket)=>{
    console.log("connected to ws")
    let username;
    let roomno;
    socket.on('message',(message)=>{
        console.log(JSON.parse(message))
        
        const data=JSON.parse(message);  

        switch(data.type){
            case 'join':
                username=data.name;
                roomno=data.room;
                rooms[roomno]=[...rooms[roomno]||[],{username,socket}]
                broadcast(roomno,{type:'notify',message:`${username} joined the Chat Room`});
                break;
            case 'message':
                broadcast(roomno,{type:'message',username,message:data.message})
                break;
            case 'leave':
                broadcast(roomno,{type:'notify',message:`${username} left the Chat Room`});

        }
    })

    socket.on('close',()=>{
        console.log("disconnected")
    })
})

console.log("server is running at http://localhost:3400")

