import api from "../../../api";

const obtainRoomToken = async (roomId, password) => {
    const response = await api.post(`/room-auth/token`, { roomId, password });
    return response;
}

const checkRoomStatus = async (roomId) => {
    const response = await api.post(`/rooms/status`, { id: roomId});
    return response;
}

const createRoom = async (roomName, roomPassword) => {
    const response = await api.post('/rooms', { name: roomName, password: roomPassword });
    return response;
}

const joinRoom = async (roomId) => {
    const response = await api.post(`/rooms/join`, { id: roomId });
    return response;
}

export {
obtainRoomToken,
createRoom,
joinRoom,
checkRoomStatus
}