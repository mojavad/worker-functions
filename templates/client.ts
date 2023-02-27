import type { WorkerTypeFns } from "./type-gen";
import { fetch as crossFetch } from "cross-fetch";
import * as devalue from "devalue";
const ourFetch = async (
  fetchImpl: typeof crossFetch,
  endpoint: string,
  functionName: string,
  ...params: any
) => {
  const resp = await fetchImpl(
    `${endpoint}/${encodeURIComponent(functionName)}`,
    {
      body: devalue.stringify(params, {
        Error: (e) => e instanceof Error && e.message
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  if (resp.ok) {
    if (resp.headers.has("X-Worker-Functions-Error")) {
      const errorHeader = devalue.parse(
        resp.headers.get("X-Worker-Functions-Error"),
        {
          Error: (m) => new Error(m)
        }
      );
      if (errorHeader) {
        throw errorHeader;
      }
    }
    const data = await resp.text();
    return devalue.parse(data, {
      Error: (m) => new Error(m)
    });
  }
  throw new Error("Failed to fetch");
};

export function WorkerClient(
  endpoint: string,
  options: { fetch?: typeof crossFetch } = {
    fetch: crossFetch
  }
) {
  return new Proxy(
    {},
    {
      get: (_, fn) => {
        // @ts-ignore
        return (...params) =>
          ourFetch(
            options.fetch ?? crossFetch,
            endpoint,
            fn as string,
            ...params
          );
      }
    }
  ) as WorkerTypeFns;
}
