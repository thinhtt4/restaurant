import { io, Socket } from "socket.io-client";

export const socket: Socket = io("http://localhost:8099", {
    transports: ["websocket"],
});

socket.on("connect", () => {
    console.log("Socket connected, id:", socket.id);
});

socket.on("connect_error", (err) => {
    console.error("Socket connect error:", err);
});

socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
});