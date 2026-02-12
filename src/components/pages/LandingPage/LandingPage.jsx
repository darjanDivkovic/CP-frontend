import { useEffect, useState } from 'react';
import TextInput from '../../shared/TextInput';
import PrimaryButton from '../../shared/PrimaryButton';
import { checkRoomStatus, createRoom, joinRoom, obtainRoomToken } from './actions';
import { useNavigate } from 'react-router-dom';
import { set } from 'lodash';

const STAGES = {
  INITIAL: 'INITIAL',
  DECIDING: 'DECIDING',
  CREATING: 'CREATING',
  JOINING: 'JOINING',
}

const SUBHEADERS = {
  [STAGES.INITIAL]: 'Quickest way to collaborate in real time with anybody, anywhere.',
  [STAGES.DECIDING]: 'Do you want to create a new room or join an existing one?',
  [STAGES.CREATING]: 'Creating a new room for you...',
  [STAGES.JOINING]: 'Joining the room...'
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [stage, setStage] = useState(STAGES.INITIAL);
  const [name, setName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [roomPassword, setRoomPassword] = useState('');

  useEffect(() => {
    const storedName = localStorage.getItem('username');
    if (storedName) {
      setName(storedName);
      setStage(STAGES.DECIDING);
    }
  }, []);

  const handleCreateRoom = async () => {
    try {
      const response = await createRoom(roomName, roomPassword);

      const roomId = response.data.id;

      navigate(`/room/${roomId}`);
      
    } catch (err) {
      alert(err.message);
    }
  }
    
  const handleJoinRoom = async () => {
       try {
        const result = await checkRoomStatus(roomName);

        if(result.data.exists) {
          navigate(`/room/${roomName}`); 
        }
      } catch (err) {
        alert('Failed to join the room');
      }
  }

  const handleProvideUsername = () => {
    localStorage.setItem('username', name.trim());
    setStage(STAGES.DECIDING)
  }

  return (
    <div className="text-center flex flex-col items-center h-screen">
      <h1 className="text-5xl font-bold mb-4 mt-[30vh]">CoPulse</h1>
      <p className="opacity-40 text-sm mb-12">{SUBHEADERS[stage]}</p>

      {
        stage === STAGES.INITIAL && (
          <>
            <TextInput
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="How should we call you?"
              label="Name"
            />
            <PrimaryButton
              disabled={!name.trim()}
              onClick={() => handleProvideUsername()}
            >
              Start Collaborating
            </PrimaryButton>
          </>
        )
      }

      {
        stage === STAGES.DECIDING && (
          <div className="flex gap-4">  
            <PrimaryButton
              disabled={!name.trim()}
              onClick={() => setStage(STAGES.JOINING)}>
                Joining
            </PrimaryButton>

            <PrimaryButton
              disabled={!name.trim()}
              onClick={() => setStage(STAGES.CREATING)}>
                Creating
            </PrimaryButton>          
          </div>
        )
      }

      {
        stage === STAGES.CREATING && (
         <>
            <TextInput
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="How should we call the room?"
              label="Room Name"
            />
            <TextInput
              value={roomPassword}
              type='password'
              onChange={(e) => setRoomPassword(e.target.value)}
              placeholder="Set a password for the room"
              label="Room Password"
            />

            <PrimaryButton
              disabled={!roomName.trim() || !roomPassword.trim()}
              onClick={async () => handleCreateRoom()}  > 
                Create Room
            </PrimaryButton>
         </>
        )
      }

       {
        stage === STAGES.JOINING && (
         <>
            <TextInput
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="what's the id of the room you want to join?"
              label="Room Name"
            />

            <PrimaryButton
              disabled={!roomName.trim()}
              onClick={async () => handleJoinRoom() }
            >
              Join Room
            </PrimaryButton>
         </>
        )
      }
      
    </div>
  );
}