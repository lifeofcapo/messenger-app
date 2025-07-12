"use client";
import { useEffect, useState, useRef } from "react";
import { Chat, Inputs, SignUp } from "@/components";
import { io, Socket } from "socket.io-client";
import styles from "@/components/page.module.css";

type ChatMessage = {
  user: string;
  message: string;
  timestamp: Date;
};

type SystemMessage = {
  content: string;
  type: "server";
};

type ChatEntry = ChatMessage | SystemMessage;

export default function Home() {
  const [chat, setChat] = useState<ChatEntry[]>([]);
  const [typing, setTyping] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");

  const user = useRef<string | null>(null);
  const socketRef = useRef<Socket>();

  useEffect(() => {
    // Инициализация сокета только один раз
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3001");
    }

    const socket = socketRef.current;

    const handleReceiveMessage = (msg: ChatMessage) => {
      if (!user.current) return;
      setChat((prev) => [...prev, msg]);
    };

    const handleUserTyping = (data: { user: string; isTyping: boolean }) => {
      if (!user.current) return;
      setTyping((prev) => {
        if (data.isTyping) {
          return prev.includes(data.user) ? prev : [...prev, data.user];
        } else {
          return prev.filter((u) => u !== data.user);
        }
      });
    };

    const handleNewUser = (newUser: string) => {
      if (!user.current) return;
      setChat((prev) => [
        ...prev,
        { content: `${newUser} joined`, type: "server" },
      ]);
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("user_typing", handleUserTyping);
    socket.on("new_user", handleNewUser);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("user_typing", handleUserTyping);
      socket.off("new_user", handleNewUser);
      socket.disconnect();
    };
  }, []);

  return (
    <main className={styles.container}>
      {user.current ? (
        <>
          <Chat user={user.current} chat={chat} typing={typing} />
          <Inputs
            setChat={setChat}
            user={user.current}
            socket={socketRef.current}
          />
        </>
      ) : (
        <SignUp
          user={user}
          socket={socketRef.current}
          input={input}
          setInput={setInput}
        />
      )}
    </main>
  );
}
