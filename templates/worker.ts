export default {
  async fetch(
    request: Request,
    env: unknown,
    ctx: ExecutionContext
  ): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response("", {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Method": "POST",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }
    if (request.method !== "POST") {
      return new Response("", {
        status: 405,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Method": "POST",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }
    const url = new URL(request.url);
    const functionName = decodeURIComponent(url.pathname.split("/")[1]);
    let input: any[] = [];
    try {
      input = (await request.json()) as unknown[];
    } catch {}
    return Response.json(await functions[functionName].bind(env)(...input), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Method": "POST"
      }
    });
  }
};
