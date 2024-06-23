// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { message, history, quiz } = req.body;

    const response = await fetch("http://127.0.0.1:5000/response2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        history: history,
        quiz: quiz,
      }),
    });
    const data = await response.json();
    res.status(200).json(data);

    // await new Promise((resolve) => setTimeout(resolve, 2000));

    // if (quiz) {
    //   if (message) {
    //     if (history.length %= 2) {
    //       return res.status(200).json({
    //         message: "Correct",
    //         highlight: 1
    //       });
    //     } else {
    //       return res.status(200).json({
    //         message: "Incorrect",
    //         highlight: 2
    //       });
    //     }
    //   }
    //   else {
    //     return res.status(200).json({
    //       message: "Your question",
    //       highlight: 0
    //     });
    //   }
    // } else {
    //   return res.status(200).json({
    //     message: "Your message",
    //     highlight: 0
    //   });
    // }
  }
}
