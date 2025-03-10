export default async function handler(req: any, res: any) {
  if (req.method === "POST") {
    const { method } = req.body;

    switch (method) {
      case "eth_accounts":
        return res.json(["0xYourWalletAddress"]);

      default:
        return res.status(400).json({ error: "Unsupported method" });
    }
  }

  res.status(405).json({ error: "Method not allowed" });
}

/*
export async function POST(request, { params }) {
  const id = params.id;

  return Response.json({ status: "ok" });
}
*/
