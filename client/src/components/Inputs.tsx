import { useRef, useState } from "react";
import Image from "next/image";
import { send, upload } from "@/assets";
import styles from "./page.module.css";
import type { Message, InputsProps } from "@/app/shared/types/interface";

const Inputs = ({ user, socket, setChat }: InputsProps) => {
  const [input, setInput] = useState("");
  const uploadInput = useRef<HTMLInputElement>(null);

  const sendMessage = () => {
    if (input.trim()) {
      const msg: Message = {
        content: input,
        type: "text",
        user,
      };
      socket.emit("send_message", msg);
      socket.emit("user_typing", { user: user.name, typing: false });
      setChat((prev) => [...prev, msg]);
      setInput("");
    } else {
      uploadInput.current?.click();
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const img = URL.createObjectURL(file);
      const msg: Message = {
        content: img,
        type: "image",
        user,
      };
      setChat((prev) => [...prev, msg]);
      socket.emit("send_message", msg);
    }
  };

  const userTyping = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    socket.emit("user_typing", {
      user: user.name,
      typing: e.target.value ? true : false,
    });
  };

  return (
    <div className={styles.chatInputWrapper}>
      <input
        className={styles.chatInput}
        type="text"
        placeholder="Enter your message"
        value={input}
        onChange={userTyping}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <input
        className="hidden"
        type="file"
        ref={uploadInput}
        onChange={handleImageUpload}
      />
      <button className={styles.sendButton} onClick={sendMessage}>
        <Image
          src={input ? send : upload}
          className={styles.sendIcon}
          alt="send"
          height={20}
          width={20}
        />
      </button>
    </div>
  );
};

export default Inputs;
