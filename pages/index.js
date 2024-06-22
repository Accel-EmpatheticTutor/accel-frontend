import Image from "next/image";
import { Inter } from "next/font/google";
import Router from "next/router";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main
      className={`flex h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      {/* container in the middle vertically + horizontally */}
      <div className="flex flex-col items-center justify-center space-y-8 h-screen w-screen">
        <div className="w-3/4 relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700/10 after:dark:from-sky-900 after:dark:via-[#0141ff]/40 before:lg:h-[360px]">
          {/* two columns, one 2/3 and one 1/3 */}
          <div className="w-full grid grid-cols-8 items-center justify-center">
            <div className="flex flex-col items-center justify-center col-span-5">
              <h1 className="text-8xl font-bold text-center">
                Welcome to <br />
                <span className="text-transparent text-9xl bg-clip-text bg-gradient-to-br from-sky-200 to-blue-600">
                  Accel
                </span>
              </h1>
              <p className="text-2xl text-center mt-4">
                Your empathetic physics tutor
              </p>
              <button
                className="bg-transparent border-white border-2 text-white text-lg px-4 py-2 mt-8 rounded-xl hover:bg-white hover:text-black duration-500"
                onClick={() => {
                  Router.push("/tutor");
                }}
              >
                Get Started
              </button>
            </div>
            <div className="col-span-3">
              <Image
                src="/home-mascot.png"
                alt="Home Mascot"
                width={360}
                height={360}
                className="max-w-3/4"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
