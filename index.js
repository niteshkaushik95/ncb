var express = require('express');
var soc=require('socket.io');
var serverUserList=[];//serverUserList have names and id of client 
var userData; // used an object to store data to be entered in serverUserList

findIndex= function(data){ //function to check whether a username already exist in serverUserList
    for(i=0;i<serverUserList.length;i++){
        if(serverUserList[i].name==data){
            return i;
        }  
    }
    return -1;// executed when name does not exist
    
}

// for app setup
app=express();
var server=app.listen(1234,function(req,res){
    console.log('the game is onn');
})
app.use(express.static('public'));

var io=soc(server);

// event code triggered when client connection happens.
io.on('connection',function(socket){

    //here socket object is used to access socket related funtionality of each client.
    console.log ("client connected :" +socket.id);
    // event code triggered when client disconnection happens
    socket.on('disconnect',function(data){
        console.log ("client "+socket.userName+" disconnected  - id:" +socket.id);
        if(socket.userName){
            temp= findIndex(socket.userName);
            console.log("index ="+ temp);
            if(temp>=0){
                serverUserList.splice(temp,1);
            }
            
            console.log('list after disconnection');
            serverUserList.forEach(element => {
            console.log("name = "+element.name);
            console.log("name = "+element.sid);
            });
            io.sockets.emit('updateUserList',serverUserList);
        }
        else{
            console.log("username was not given");
        }
        
    });
    //custom event handler : triggered when new user joins.
    socket.on('newUser',function(data){

        console.log('user data object is : '+ userData +'\n');
        if(findIndex(data.handle)>=0){
            console.log("user already exist");
            io.to(socket.id).emit('userAlreadyExist',data.handle);
        }
        else{
            userData={
                name:data.handle,
                sid:socket.id
            }
            socket.userName=data.handle;
            serverUserList.push(userData);
            io.sockets.emit('updateUserList',serverUserList);
            
        }
        
    });

    //custom event handler : triggered when client sends chat event.
    socket.on('chat',function(data){
        io.sockets.emit('chat',data);
    });
    //custom event handler : triggered when client sends typing event.
    socket.on('typing',function(data){
        socket.broadcast.emit('typing',data);
    });
    socket.on('pchat',function(data){
        
        console.log("pchat event recieved on server");
        console.log(data.destination);
        console.log(data.destinationid);
        console.log(data.message);
        destinationid=data.destinationid;
        data.sourceid=socket.id;
        
        //socket.broadcast.to(destinationid).emit('pchat', data);
        io.to(destinationid).emit('pchat', data);
        //socket.broadcast.to(socket.id).emit('pchat', data);
        io.to(socket.id).emit('pchat', data);
       
        

    });

});


