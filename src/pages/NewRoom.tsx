import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import illustrationImg from "../assets/images/illustration.svg"
import logoImg from "../assets/images/logo.svg"
import googleIconImg from "../assets/images/google-icon.svg"
import { Button } from "../components/Button";
import firebase, { database } from "../services/firebase";
import "../styles/auth.scss"
import { useAuth } from "../hooks/useAuth";
import { ref, set, push, } from "firebase/database";

export function NewRoom() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [newRoom, setNewRoom] = useState("")

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault();

    if(newRoom.trim() === "") {
      return
    }
try {
  const reference = ref(database, "rooms")
  const result = await push(reference,{
    title: newRoom,
    authorId: user?.id,
  })

navigate(`/rooms/${result.key}`)

} catch (error) {
  console.log("deu erro", error)
  
}
  
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
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input 
            type="text"
            placeholder="Nome da sala"
            onChange={event => setNewRoom(event.target.value)}
            value={newRoom}
            />
            <Button type="submit">
             Criar sala
            </Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}