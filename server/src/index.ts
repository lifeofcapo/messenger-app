import express, { Request, Response, Application, NextFunction } from "express";
import cors from "cors";
import { ICreatePayment, YooCheckout } from "@a2seven/yoo-checkout";
import http from "http";
import { Server, Socket } from "socket.io";

const PORT: number = Number(process.env.PORT) || 3001;
const SHOP_ID: string = process.env.SHOP_ID || "";
const SHOP_SECRET_KEY: string = process.env.SHOP_SECRET_KEY || "";

if (!SHOP_ID || !SHOP_SECRET_KEY) {
  throw new Error("Missing YooKassa shop credentials in environment variables");
}

interface PaymentDatabase {
  [key: string]: any;
}

interface SocketMessage {
  user?: string;
  message?: string;
}

const app: Application = express();
const server = http.createServer(app);
const database: PaymentDatabase = {};
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const YouKassa = new YooCheckout({
  shopId: SHOP_ID,
  secretKey: SHOP_SECRET_KEY,
});

app.use(
  cors({
    credentials: true,
  })
);
app.use(express.json());

io.on("connection", (socket: Socket) => {
  console.log("User connected:", socket.id);
  socket.on("send_message", (msg: SocketMessage) => {
    const messageWithTimestamp = {
      ...msg,
      timestamp: new Date(),
    };
    socket.broadcast.emit("receive_message", messageWithTimestamp);
  });

  socket.on("user_typing", (data: { user: string; isTyping: boolean }) => {
    socket.broadcast.emit("user_typing", data);
  });

  socket.on("new_user", (data: { user: string }) => {
    socket.broadcast.emit("new_user", data.user);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.post("/api/payment", async (req: Request, res: Response) => {
  const createPayload: ICreatePayment = {
    amount: {
      value: req.body.value,
      currency: "RUB",
    },
    payment_method_data: {
      type: "bank_card",
    },
    capture: true,
    confirmation: {
      type: "redirect",
      return_url: req.body.confirmation_url,
    },
    metadata: {
      orderId: req.body.orderId,
      userId: req.body.userId,
    },
  };

  try {
    const payment = await YouKassa.createPayment(
      createPayload,
      Date.now().toString() // Don't use this in production - use proper idempotency keys
    );

    database[payment.id] = payment;
    res.json({ payment });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Payment processing failed" });
  }
});

app.post("/api/payment/notifications", async (req: Request, res: Response) => {
  console.log(req.body);
  if (req.body.id) {
    database[req.body.id] = req.body;
  }
  res.json({ status: "OK" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
