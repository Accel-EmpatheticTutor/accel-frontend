import Image from "next/image";
import { Inter } from "next/font/google";
import Router from "next/router";
import { useState } from "react";
import ScrollContainer from "../components/ScrollContainer";
import TypingAnimation from "../components/TypingAnimation";
import Markdown from "react-markdown";

const inter = Inter({ subsets: ["latin"] });

export default function Tutor() {
  const [bot, setBot] = useState({});
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    setLoading(true);
    if (!message) {
      return;
    }
    setMessages([...messages, { message, type: "user" }]);
    sendMessage(message).then((botMessage) => {
      setMessages([
        ...messages,
        { message, type: "user" },
        { message: botMessage, type: "model" },
      ]);
      setLoading(false);
    });
    setMessage("");
  };

  const sendMessage = async (message) => {
    await new Promise((r) => setTimeout(r, 1000));
    const data = {
      message: "Hello!",
    };
    return data.message;
  };

  return (
    <main
      className={`flex h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      {/* container in the middle vertically + horizontally */}
      <div className="flex flex-col items-center justify-center space-y-8 h-screen w-screen">
        <div class="pt-16 h-full bg-gray-100 pb-20 w-3/4">
          <ScrollContainer>
            {messages.map((m, i) => {
              if (m.type == "model") {
                return (
                  <div
                    className={
                      "flex mb-4 cursor-pointer mx-4" + (i == 0 ? " mt-4" : "")
                    }
                    key={i}
                  >
                    <div className="flex max-w-full bg-white rounded-lg py-4 px-5 gap-3">
                      <p className="text-gray-700">
                        <Markdown className="prose">{m.message}</Markdown>
                      </p>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div
                    className={
                      "flex mb-4 justify-end cursor-pointer mx-4" +
                      (i == 0 ? " mt-4" : "")
                    }
                    key={i}
                  >
                    <div className="flex max-w-96 bg-red-500 text-white rounded-lg p-3 gap-3 text-wrap break-words">
                      <p className="w-full">{m.message}</p>
                    </div>
                  </div>
                );
              }
            })}
            {loading && (
              <div className="flex mb-4 cursor-pointer mx-4">
                <div className="flex max-w-96 bg-white rounded-lg px-4 py-4 gap-3">
                  <TypingAnimation />
                </div>
              </div>
            )}
          </ScrollContainer>
        </div>

        <footer className="fixed bg-white p-0 w-full absolute bottom-0 h-20 flex items-center w-3/4 rounded-br-lg">
          <div className="flex items-center p-4 items-center w-full">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full p-2 rounded-md border border-gray-200 focus:outline-none focus:border-red-500"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md ml-2"
              onClick={handleSubmit}
            >
              Send
            </button>
          </div>
        </footer>
      </div>
    </main>
  );
}
