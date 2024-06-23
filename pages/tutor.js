import Image from "next/image";
import { Inter } from "next/font/google";
import Router from "next/router";
import { useState, useEffect } from "react";
import ScrollContainer from "../components/ScrollContainer";
import TypingAnimation from "../components/TypingAnimation";
import Markdown from "react-markdown";

import { useVoice, VoiceReadyState } from "@humeai/voice-react";
import Microphone from "../components/Microphone";
import Expressions from "@/components/Expressions";

const inter = Inter({ subsets: ["latin"] });

export default function Tutor() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [quizMode, setQuizMode] = useState(false);
  const [recentEmotions, setRecentEmotions] = useState([]);
  const [recording, setRecording] = useState(false);

  const {
    connect,
    disconnect,
    readyState,
    messages: audioMessages,
  } = useVoice();

  useEffect(() => {
    console.log(recording)
    if (audioMessages.length > 0) {
      setMessage(
        audioMessages
          .filter((m) => m.type === "user_message")
          .map((m) => m.message.content)
          .join(" ")
      );
    }
  }, [audioMessages, recording]);

  const handleSubmit = () => {
    setLoading(true);
    if (!message) {
      return;
    }
    setMessages([...messages, { message, type: "user", emotion: [] }]);
    sendMessage({ message, emotion: [] }).then((data) => {
      if (data.quiz) {
        if (quizMode) exitQuizMode();
        else enterQuizMode();
      }
      if (data.message) {
        setMessages([
          ...messages,
          { message, type: "user", emotion: [] },
          { message: data.message, type: "model" },
        ]);
      }
      setLoading(false);
    });
    setMessage("");
  };

  const sendMessage = async (message) => {
    console.log(message);
    const response = await fetch("/api/hello", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: message,
            history: messages,
            quiz: quizMode,
        }),
    });
    const data = await response.json();
    return data;
  };

  const handleMic = async () => {
    if (
      readyState === VoiceReadyState.CONNECTED ||
      readyState === VoiceReadyState.OPEN
    ) {
      disconnect();
        setRecording(false);
      // add up top 3 emotions from each message
      if (!message) return;
      let emotions = {};
      for (let m of audioMessages.filter((m) => m.type === "user_message")) {
        for (let e of Object.keys(m.models.prosody.scores)) {
          if (emotions[e]) {
            emotions[e] += m.models.prosody.scores[e];
          } else {
            emotions[e] = m.models.prosody.scores[e];
          }
        }
      }
      // get top 3 emotions
      let top3keys = Object.keys(emotions)
        .sort((a, b) => emotions[b] - emotions[a])
        .slice(0, 5);

      // add percentages
      let top3 = top3keys.map((e) => {
        return [e, emotions[e]];
      });

      let sum = top3.reduce((acc, cur) => acc + cur[1], 0);
      top3 = top3.map((e) => [e[0], e[1] / sum]);

      setRecentEmotions(top3);

      // send message
      setMessages([...messages, { message, type: "user", emotion: top3 }]);
      sendMessage({ message, emotion: top3 }).then((data) => {
        if (data.quiz) {
          if (quizMode) exitQuizMode();
          else enterQuizMode();
        }
        if (data.message) {
          setMessages([
            ...messages,
            { message, type: "user", emotion: top3 },
            { message: data.message, type: "model" },
          ]);
        }
        setLoading(false);
      });
      setMessage("");
    } else {
      connect().then(() => {
        setRecording(true)
      });
    }
  };

  const enterQuizMode = async () => {
    setQuizMode(true);
    setLoading(true);
    setMessages([
      ...messages,
      { message: "Entering quiz mode...", type: "model" },
    ]);
    const response = await fetch("/api/hello", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message: "",
            history: messages,
            quiz: true,
        }),
    });
    const data = await response.json();
    if (data.message) {
      setMessages([
        ...messages,
        { message: "Entering quiz mode...", type: "model" },
        { message: data.message, type: "model" },
      ]);
    }
    setLoading(false);
  };

  const exitQuizMode = async () => {
    setQuizMode(false);
    setMessages([
      ...messages,
      { message: "Exiting quiz mode.", type: "model" },
    ]);
  };

  return (
    <main
      className={`flex h-screen flex-col items-center justify-between ${inter.className}`}
    >
      {/* container in the middle vertically + horizontally */}
      <div className="flex flex-col items-center justify-center h-screen w-screen">
        <div className="w-full h-full grid grid-cols-4">
          <div className="col-span-3 flex flex-col items-center justify-center">
            <div className="absolute top-0 left-0 w-3/4 p-8 flex flex-col items-center">
            <h1
              className="mb-4 text-transparent text-4xl bg-clip-text bg-gradient-to-br from-sky-200 to-blue-600"
              onClick={() => Router.push("/")}
            >
              Accel
            </h1>
            <div className="mb-2 text-sm font-medium text-gray-300">
              Quiz Mode
            </div>
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                value=""
                className="sr-only peer"
                onChange={(e) => {
                  if (e.target.checked) {
                    enterQuizMode();
                  } else {
                    exitQuizMode();
                  }
                }}
                // if quizMode is true, set the checkbox to checked
                checked={quizMode}
              />
              <div className="relative w-11 h-6 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all border-gray-600 peer-checked:bg-gradient-to-br from-sky-200 to-blue-600"></div>
            </label>
            </div>
            <div className="absolute bottom-0 left-0 w-3/4 p-8 h-5/6 pb-28">
              <ScrollContainer>
                {messages.map((m, i) => {
                  if (m.type == "model") {
                    return (
                      <div
                        className={
                          "flex mb-4 cursor-pointer mx-4" +
                          (i == 0 ? " mt-4" : "")
                        }
                        key={i}
                      >
                        <div className="flex max-w-full bg-white rounded-lg py-2 px-4 gap-3">
                          <div className="text-gray-700">
                            <Markdown className="divrose">{m.message}</Markdown>
                          </div>
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
                        <div className="max-w-half bg-transparent border-white border text-white rounded-lg py-2 px-4 gap-3">
                          <div className="w-full text-wrap break-words">
                            {m.message}
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}
                {loading && (
                  <div className="flex mb-4 cursor-pointer mx-4">
                    <div className="flex max-w-full bg-white rounded-lg px-4 py-4 gap-3">
                      <TypingAnimation />
                    </div>
                  </div>
                )}
              </ScrollContainer>
            </div>
            <footer className="fixed p-0 absolute bottom-0 h-20 flex items-center p-8 w-3/4 rounded-br-lg">
              <div className="flex items-center p-4 items-center w-full">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full p-2 rounded-md border border-white bg-transparent text-white"
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSubmit();
                    }
                  }}
                />
                <button
                  className={
                    "bg-transparent border-white border text-white text-md px-4 py-2 ml-2 rounded-lg hover:bg-white hover:text-black duration-500" +
                    (recording
                      ? " bg-red-600 border-red-600 hover:bg-red-700 hover:border-red-700 hover:text-white"
                      : "")
                  }
                  onClick={handleMic}
                >
                  <Microphone />
                </button>
              </div>
            </footer>
          </div>
          <div className="col-span-1 p-8">
            Mood Report:
            {recentEmotions.length > 0 ? (
              <Expressions top3={recentEmotions} />
            ) : (
              <div className="text-xs p-3 w-full border-t border-border flex flex-col md:flex-row gap-3 mt-2">
                <div className="w-full overflow-hidden">
                  <div className="flex items-center justify-between gap-1 font-mono pb-1">
                    <div className="text-md">
                      No emotions detected. Use the microphone for a more
                      empathetic experience!
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="absolute p-8 bottom-0 right-0 w-1/4">
            <Image src="/tutor-mascot.png" alt="Tutor Mascot" width={360} height={360} className=""/>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
