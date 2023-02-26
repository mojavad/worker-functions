import * as devalue from "devalue";

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
      input = devalue.parse(await request.text(), {
        Error: (m) => new Error(m)
      }) as unknown[];
    } catch {}
    let data: any = null;
    let error: any = null;
    try {
      data = await functions[functionName].bind(env)(...input);
    } catch (e) {
      error = e;
    }
    return new Response(
      devalue.stringify(data, {
        Error: (e) => e instanceof Error && e.message
      }),
      {
        headers: {
          "X-Worker-Functions-Error": devalue.stringify(error, {
            Error: (e) => e instanceof Error && e.message
          }),
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Method": "POST"
        }
      }
    );
  }
};
