import Image from "next/image";
import { new_user } from "@/assets";
import styles from "./page.module.css";

const ServerMessage = ({ content }) => {
  return (
    <p className={styles.serverMessageWrapper}>
      <span className={styles.serverMessageContent}>
        <Image
          src={new_user}
          className={styles.serverMessageIcon}
          alt="new user"
        />
        {content}
      </span>
    </p>
  );
};

export default ServerMessage;
