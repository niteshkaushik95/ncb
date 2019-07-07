
// making  front end socket connection
var soc = io.connect('http://localhost:1234');
//jquery code to load modal on pageload
$(document).ready(function(){
    $('#myModal').modal({
        backdrop: 'static',
        keyboard: false
    })
    $("#myModal").modal('show');
    $(document).on("click", "a.remove" , function() {
        $(this).parent().parent().remove();
    });
    
});


//fuction to get id 

var getid=function(id){
    return document.getElementById(id);
}
//code for DOM modification
var handle=getid('handle');
var message=getid('message');
var sbtn=getid('send');
var userList=getid('userList');
var output=getid('output');
var feedback=getid('feedback');
var namebtn=getid('namebtn');
var userList=getid('userList');
var userOnline=getid('userOnline');
var acc=getid('accordion');
var modalTitle=getid('modalTitle');
var welcomeMessage=getid('welcomeMessage');
var chatWindowHeight=getid('chat-window');

pChatBox=function(name,sid){
    console.log("inside pchat function");
    var pMessage=getid('message'+name);
    data={
        source:handle.value,
        destination:name,
        destinationid:sid,
        message:pMessage.value
    }
    console.log("message :"+pMessage.value);
    console.log("destination name "+name);
    console.log('destination id'+sid);
    soc.emit('pchat',data);
    pMessage.value="";
}
chatbox= function(name,id){
    var temp=getid('outer'+name);
    if(temp){
        // if  private chat  box already exist do nothing
    }
    else{
        // create new chat box
        acc.innerHTML +='<div class="card" id="'+'outer'+name+'"><div class="card-header"> <a class="card-link" data-toggle="collapse" href="#'+name+'" onclick=badgereset("'+name+'");> '+name+' </a><span class="badge badge-success" id="badge'+name+'"></span><a id="righty1" href="javascript:void(0);" class="remove"><i class="material-icons">close</i></a></div><div id="'+name+'" class="collapse " data-parent="#accordion" style="padding: 0px !important;margin: 0px !important ;"><div class="card-body" style="padding: 0px !important;margin: 0px !important ;"><div id= "mario-chat" style="padding: 0px !important;margin: 0px !important ;"><div id ="chat-window'+name+'" class="chat-window" style="height:100px !important ;"><div id="output'+name+'"></div><div id="feedback'+name+'"></div></div> <input id="message'+name+'" type= "text" placeholder="enter text"/> <button id="send'+name+'" onclick=pChatBox("'+name+'","'+id+'")>Send</button></div></div></div>';
    }
  }
badgereset=function(name){
    console.log('badge'+name);
    var bNumber=getid('badge'+name);
    bNumber.innerHTML='';
  }


// event to tell new user has joined.
namebtn.addEventListener('click',function(){
    soc.emit('newUser', {
        handle: handle.value
    });
    welcomeMessage.innerHTML= "Welcome " + handle.value+"   ";
});

//event to send data on click of send button
sbtn.addEventListener('click',function(){
    data={
        name:handle.value,
        message:message.value
    }
    soc.emit('chat',data);
    message.value="";
});
// event to tell that a user is typing 

message.addEventListener('keypress',function(){
    data={
        name:handle.value,
    }
    soc.emit('typing',data);
})

// event listeners:
// code to handle messages recieved from server

soc.on('chat',function(data){
    feedback.innerHTML="";
    if(data.name==handle.value){
        output.innerHTML+= "<div style='text-align: right; padding-right:20px;margin-top:3px;'><span class='rightBubble'>"+ data.message+"</span></div> ";
    }
    else{
        output.innerHTML+="<div style='padding-left: 20px;margin-top:3px;'><span class='leftBubble'><b>"+data.name+" : </b>"+ data.message+"</span></div> ";
    
    }
    
    chatWindowHeight.scrollTop += output.scrollHeight;
});
soc.on('typing',function(data){
    feedback.innerHTML="<p> <i> "+data.name+" is typing ..."+"</i></p>"
    chatWindowHeight.scrollTop += feedback.scrollHeight;
});
soc.on('updateUserList',function(data){
    userList.innerHTML="";
    userOnline.innerHTML=data.length + " Online Users";
    for(var i=0;i<data.length;i++){
        if(data[i].name == handle.value){
            //acc.innerHTML +='<div id="'+'outer'+handle+data[i].name+'"><div class="card"><div class="card-header">'+data[i].name+' </div><div id="'+handle+data[i].name+'" class="collapse " data-parent="#accordion" style="padding: 0px !important;margin: 0px !important ;"><div class="card-body" style="padding: 0px !important;margin: 0px !important ;"><div id= "mario-chat" style="padding: 0px !important;margin: 0px !important ;"><div id ="chat-window" style="height:100px !important ;"><div id="output'+handle+data[i].name+'"></div><div id="feedback'+handle+data[i].name+'"></div></div> <input id="message'+handle+data[i].name+'" type= "text" placeholder="enter text"/> <button id="send'+handle+data[i].name+'" onclick=pchatbox("'+handle+data[i].name+'")>Send</button></div></div></div></div>';
            userList.innerHTML+="<p> "+data[i].name+'</p>';
        }
        else{
            console.log('destination id is: '+data[i].sid);
            //acc.innerHTML +='<div class="card"><div class="card-header">'+data[i].name+'<span class="badge badge-success" id="badge'+data[i].name+'"></span> <a class="card-link" data-toggle="collapse" href="#'+data[i].name+'"> <i class="material-icons">chat_bubble_outline</i> </a></div><div id="'+data[i].name+'" class="collapse " data-parent="#accordion" style="padding: 0px !important;margin: 0px !important ;"><div class="card-body" style="padding: 0px !important;margin: 0px !important ;"><div id= "mario-chat" style="padding: 0px !important;margin: 0px !important ;"><div id ="chat-window" style="height:100px !important ;"><div id="output'+data[i].name+'"></div><div id="feedback'+data[i].name+'"></div></div> <input id="message'+data[i].name+'" type= "text" placeholder="enter text"/> <button id="send'+data[i].name+'" onclick=pChatBox("'+data[i].name+'","'+data[i].sid+'")>Send</button></div></div></div>';
            userList.innerHTML+="<p> "+data[i].name+'<a id="righty" onclick=chatbox("'+data[i].name+'","'+data[i].sid+'") value="Submit"><i class="material-icons">chat_bubble_outline</i></a> </p>';
        
        }
       // userList.innerHTML+="<p> "+data[i]+'<a id="righty" onclick=chatbox("'+data[i]+'") value="Submit"><i class="material-icons">chat_bubble_outline</i></a> </p>';
       
 
    }
});
soc.on('userAlreadyExist',function(data){
    console.log('userAlreadyExist');
   
    location.reload();
    
});
soc.on('pchat',function(data){
    console.log("pchat event recieved : value of data destination is"+ data.destination ); 
    if (handle.value==data.source){
        var out =getid('output'+data.destination);
        console.log('out ki value :'+'output'+data.destination);
        //out.innerHTML+="<br><span style='padding-left: 10px;padding-right:10px;margin-top:10px;margin-right:20px;background-color: lightblue;border-radius: 10px 0px 10px 10px ;float:right;clear:right'> "+ data.message+"</span> ";
        out.innerHTML+= "<div style='text-align: right; padding-right:20px;margin-top:3px;'><span class='rightBubble'>"+ data.message+"</span></div> ";
        var tempchat=getid('chat-window'+data.destination);
        tempchat.scrollTop += out.scrollHeight;
    }
    else{
        var out =getid('output'+data.source);
        
        if(out){
            // if chat box does exist do nothing
        }
        else{
            
            // if chat box does not exist creat it
            chatbox(data.source,data.sourceid);
            
        }
        var out =getid('output'+data.source);
        
        console.log('out ki value :'+'output'+data.source);
        //out.innerHTML+="<br><span style='padding-left: 10px;padding-right:10px;margin-top:10px;margin-left:20px;background-color: lightblue;border-radius: 0px 10px 10px 10px ;float:left;clear:left'>"+ data.message+"</span>";
        out.innerHTML+= "<div style='padding-left: 20px; margin-top:3px'><span class='leftBubble'>"+ data.message+"</span></div> ";
        var tempchat=getid('chat-window'+data.source);
        tempchat.scrollTop += out.scrollHeight;
        temp =document.getElementById(data.source).className;
        console.log( "value of:"+temp);
        var badgeNumber=getid('badge'+data.source);
        if(temp!='collapse show'){
            
            if(badgeNumber.innerHTML!=''){
                badgeNumber.innerHTML++;
            }
            else{
                badgeNumber.innerHTML=1;
            }

        }
        
        

    }



});