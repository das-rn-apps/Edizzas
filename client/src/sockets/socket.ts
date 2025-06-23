import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // change to env in production
export default socket;
