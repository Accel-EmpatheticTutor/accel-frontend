import "@/styles/globals.css";
import { fetchAccessToken } from "@humeai/voice";
import { VoiceProvider } from "@humeai/voice-react";

export default function App({ Component, pageProps }) {
  const apiKey = process.env.NEXT_PUBLIC_HUME_API_KEY;
  return (
    <VoiceProvider auth={{ type: 'apiKey', value: apiKey }}
      onMessage={(message) => console.log(message)}
    >
      <Component {...pageProps} />
    </VoiceProvider>
  );
}
