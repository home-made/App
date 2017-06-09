import SocketIO from "socket.io-client";
import NavBar from "../Containers/NavBar"
var socket = new SocketIO("http://localhost:3000");

socket.connect();
socket.on("init", splash => {
    console.log(splash);
});

export default socket