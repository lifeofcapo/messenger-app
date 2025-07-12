import styles from "./page.module.css";

const Typing = ({ user }) => {
  return (
    <div className={styles.typingWrapper}>
      <span className={styles.logo}>{user.charAt(0).toUpperCase()}</span>
      <div className={styles.typingLoader}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Typing;
