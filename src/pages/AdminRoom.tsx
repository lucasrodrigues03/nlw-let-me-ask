import { FormEvent, useState  } from "react"
import { push, ref, set, child, onValue, remove, update  } from "firebase/database"
import { useNavigate, useParams } from "react-router-dom"
import logoImg from "../assets/images/logo.svg"
import deleteImg from "../assets/images/delete.svg"
import checkImg from "../assets/images/check.svg"
import answerImg from "../assets/images/answer.svg"
import Img from "../assets/images/answer.svg"
import { Button } from "../components/Button"
import { RoomCode } from "../components/RoomCode"
import { Question } from "../components/Question"
import { useAuth } from "../hooks/useAuth"
import { useRoom } from "../hooks/useRoom"
import { database } from "../services/firebase"
import "../styles/room.scss"

type RoomParams = {
  id: string 
}

type NavigateEndParams = {
  push: boolean
}

export function AdminRoom() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const params = useParams<RoomParams>()
  const roomId = params.id

  const { title, questions } = useRoom(roomId)

  async function handleEndRoom() {
   const reference = await ref(database,`rooms/${roomId}`)
     await update(reference,{
      endedAt: new Date(),
    })
   

    navigate("/")

  }

  async function handleDeleteQuestion(questionId: string) {
    if (window.confirm("Tem certeza que você deseja excuir esta pergunta?")) {
      const removeRef = await ref(database,`rooms/${roomId}/questions/${questionId}`)
      await remove(removeRef)
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    const checkQuestion = await ref(database,`rooms/${roomId}/questions/${questionId}`)
    await update(checkQuestion,{
      isAnswered: true,

    })
  }
  async function handleHighlightQuestion(questionId: string) {
      const highlightQuestion = await ref(database,`rooms/${roomId}/questions/${questionId}`)
    await update(highlightQuestion,{
      isHighlighted: true,
      
    })
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={String(params.id)}/>
            <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
          </div>
        </div>
      </header>

      <main className="content">
        <div className="room-title">
          <h1>Sala: {title} </h1>    
          { questions.length > 0 &&  <span>{questions.length} pergunta(s)</span>}
        </div>
        <div className="question-list">
          {questions.map(question => {
            
            return (
              <Question
              key={question.id}
              content={question.content}
              author={question.author}
              isAnswered={question.isAnswered}
              isHighlighted={question.isHighlighted}
              >
                 {!question.isAnswered && (
                  <>
                  <button
                    type="button" 
                    onClick={() => handleCheckQuestionAsAnswered(question.id)}
                  >
                    <img src={checkImg} alt="Marcar pergunta como respondida" />
                    </button> 
                    <button
                    type="button" 
                    onClick={() => handleHighlightQuestion(question.id)}
                  >
                    <img src={answerImg} alt="Dar destaque à pergunta" />
                    </button> 
                  </>
                 )}
                <button
                  type="button" 
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                  </button> 
              </Question>
            )
          })}
        </div>
      </main>
    </div>
  );
}



