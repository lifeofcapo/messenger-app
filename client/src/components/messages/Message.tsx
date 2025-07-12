import styles from "./page.module.css";
import clsx from "clsx";

const Message = ({ content, type, own, user }) => {
  return (
    <p className={`${styles.message} ${own ? styles.justifyEnd : ""}`}>
      {!own && (
        <span
          className={clsx(
            styles.logo,
            type === "text" ? styles.logoText : styles.logoImage
          )}
        >
          {user.name.charAt(0).toUpperCase()}
        </span>
      )}
      <span
        className={clsx(
          styles.messageContent,
          type === "text" ? styles.textContent : styles.imageContent,
          own ? styles.ownMessage : styles.otherMessage
        )}
      >
        {type === "text" ? (
          content
        ) : (
          <img src={content} className={styles.image} alt="image" />
        )}
      </span>
    </p>
  );
};

export default Message;
