// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { message, history, quiz } = req.body;

    const response = await fetch("http://127.0.0.1:5000/response", {
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
  }
}
