import { Message, ServerMessage, Typing } from "./messages";
import { useEffect, useRef } from "react";
import styles from "./page.module.css";

const Chat = ({ chat, user, typing }) => {
  const scroller = useRef(null);

  useEffect(() => {
    if (!scroller.current) return;

    scroller.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [chat]);

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatBox}>
        {chat.map((message, index) => {
          message = { ...message, own: message.user?.id === user.id };
          return message.type === "server" ? (
            <ServerMessage key={index} {...message} />
          ) : (
            <Message key={index} {...message} />
          );
        })}
        {typing[0] && <Typing user={typing[0]} />}
        <div ref={scroller} className={styles.chatScroller} />
      </div>
    </div>
  );
};

export default Chat;
