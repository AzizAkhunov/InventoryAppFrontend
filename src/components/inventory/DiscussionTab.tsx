import { useEffect, useState, useRef } from "react"
import { api } from "@/api/apiClient"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

import * as signalR from "@microsoft/signalr"

type Comment = {
  id: string
  content: string
  authorName: string
  createdAt: string
}

type Props = {
  inventoryId: string
}

export default function DiscussionTab({ inventoryId }: Props) {

  const { user } = useAuth()

  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText] = useState("")

  const scrollRef = useRef<HTMLDivElement>(null)
  const connectionRef = useRef<signalR.HubConnection | null>(null)
useEffect(() => {
  let connection: signalR.HubConnection

  async function init() {

    await loadComments()

    connection = new signalR.HubConnectionBuilder()
      .withUrl("https://inventoryapp-cisl.onrender.com/hubs/discussion")
      .withAutomaticReconnect()
      .build()

    connection.on("ReceiveMessage", (message: Comment) => {

  setComments(prev => {

    if (prev.some(c => c.id === message.id)) {
      return prev
    }

    return [...prev, message]

  })

})
    connectionRef.current = connection

    await connection.start()

    await connection.invoke("JoinInventory", inventoryId)

  }

  init()

  return () => {

    if (connection) {
      connection.stop()
    }

  }

}, [inventoryId])


  useEffect(() => {

    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    })

  }, [comments])


  async function loadComments() {

    const res = await api.get(`/discussion/${inventoryId}`)
    setComments(res.data)

  }


  async function sendComment() {

    if (!text.trim()) return

    const res = await api.post(
  `/discussion/${inventoryId}`,
  JSON.stringify(text),
  {
    headers: {
      "Content-Type": "application/json"
    }
  }
)

setText("")

  }


  return (

    <div className="w-[800px] h-[500px] border rounded-xl flex flex-col bg-white">

      {/* HEADER */}

      <div className="border-b px-4 py-3 font-semibold">
        Discussion
      </div>


      {/* MESSAGES */}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 flex flex-col gap-4"
      >

{comments.map(c => {

  const isMe = user?.userName === c.authorName

  return (

    <div
      key={c.id}
      className={`flex flex-col ${isMe ? "items-end" : "items-start"} gap-1`}
    >

      {/* USERNAME */}

      <span className="text-xs font-semibold text-gray-700">
        {c.authorName}
      </span>

      {/* MESSAGE ROW */}

      <div className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : ""}`}>

        {/* AVATAR */}

        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
          ${isMe ? "bg-blue-600 text-white" : "bg-gray-300 text-black"}`}
        >
          {(c.authorName ?? "U").charAt(0).toUpperCase()}
        </div>

        {/* MESSAGE */}

        <div
          className={`px-4 py-2 rounded-2xl text-sm max-w-[400px]
          ${isMe
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-black"
          }`}
        >

          {c.content}

          <div className="text-[10px] opacity-60 mt-1 text-right">
            {new Date(c.createdAt).toLocaleTimeString()}
          </div>

        </div>

      </div>

    </div>

  )

})}

      </div>


      {/* INPUT */}

      <div className="border-t p-3 flex gap-2">

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              sendComment()
            }
          }}
          placeholder="Write a message..."
          className="flex-1 border rounded-lg px-3 py-2 text-sm"
        />

        <Button onClick={sendComment}>
          Send
        </Button>

      </div>

    </div>

  )

}