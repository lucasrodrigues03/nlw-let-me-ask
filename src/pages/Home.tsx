import illustrationImg from "../assets/images/illustration.svg"
import logoImg from "../assets/images/logo.svg"
import googleIconImg from "../assets/images/google-icon.svg"
import  { useNavigate}  from "react-router-dom";
import { useAuth } from "../hooks/useAuth"
import { Button } from "../components/Button";
import "../styles/auth.scss"
import { signInWithPopup, GoogleAuthProvider, getAuth } from "firebase/auth";
import { FormEvent, useState } from "react";
import { database } from "../services/firebase";
import { ref, get } from "firebase/database"

export function Home() {

  const navigate = useNavigate()
  const { user, signInWithGoogle } = useAuth()
  const [roomCode, setRoomId] = useState("")

  async function handleCreateRoom() {
    if(!user) {
      await signInWithGoogle()
    }
  
    navigate("/rooms/new")
} 

async function handleJoinRoom(event: FormEvent) {
  event.preventDefault()
    if(roomCode.trim() === "") {
      return
    }

    const roomRef = await ref(database,`rooms/${roomCode}`)
    const reference = await get(roomRef)

    if (!reference.exists()) {
      alert("Room does not exists.")
      return
    }

    if (reference.val().endedAt) {
      alert("Room already closed.")
    }



  navigate(`/rooms/${roomCode}`)
} 

return (
 <div id="page-auth">
   <aside>
     <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
     <strong>Crie salas de Q&amp;A ao-vivo</strong>
     <p>Tire duvidas da sua audiência em tempo real</p>
   </aside>
   <main>
     <div className="main-content">
       <img src={logoImg} alt="Letmeask" />
       <button onClick= {handleCreateRoom} className="create-room">
         <img src={googleIconImg} alt="Logo do Google"/>
         Crie sua sala com o Google
       </button>
       <div className="separator">ou entre em uma sala</div>
       <form onSubmit={handleJoinRoom}>
         <input 
         type="text"
         onChange={event => setRoomId(event.target.value) }
         placeholder="Digite o código da sala"
         />
         <Button type="submit">
           Entrar na sala
         </Button>
       </form>
     </div>
   </main>
 </div>
   )
  }






