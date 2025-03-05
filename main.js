//Example usage in the command prompt
//node server.js
//Parameters

const port=880;//Specify a port our web server
const express = require('express');//load express with the use of requireJS

const app=express();

app.use(express.static(__dirname + '/')); // Serving static files 
app.listen(port, function(){//Listener for specified port
    console.log("server running at: http://localhost:"+ port)

});

 