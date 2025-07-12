import styles from "./page.module.css";
import { Socket } from "socket.io-client";

interface User {
  name: string;
  id: string;
}

interface SignUpProps {
  user: User;
  socket: Socket;
  input: string;
  setInput: (value: string) => void;
}

const SignUp = ({ user, socket, input, setInput }: SignUpProps) => {
  const addUser = () => {
    if (!input.trim()) return;

    const newUser = {
      name: input.trim(),
      id: socket.id || Date.now().toString(), // Fallback ID if socket.id is undefined
    };

    user = newUser;
    socket.emit("new_user", { user: newUser.name });
    setInput("");
  };

  return (
    <div className={styles.signupWrapper}>
      <div className={styles.signupCard}>
        <h1 className={styles.headingMain}>Chat App</h1>
        <h2 className={styles.headingSub}>Enter your name to join</h2>

        <input
          type="text"
          className={styles.signupInput}
          placeholder="..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addUser()}
        />
        <button
          className={styles.joinButton}
          disabled={!input}
          style={{ backgroundColor: input ? "#38bdf8" : "#94a3b8" }}
          onClick={addUser}
        >
          Join Chat
        </button>
      </div>
    </div>
  );
};

export default SignUp;
