import type { WorkerTypeFns } from './type-gen';
const ourFetch = async (
  endpoint: string,
  functionName: string,
  ...params: any
) => {
  const resp = await fetch(`${endpoint}/${encodeURIComponent(functionName)}`, {
    body: JSON.stringify(params),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (resp.ok) return resp.json();
};

export function WorkerClient(endpoint: string) {
  return new Proxy(
    {},
    {
      get: (_, fn) => {
        // @ts-ignore
        return (...params) => ourFetch(endpoint, fn, ...params);
      }
    }
  ) as WorkerTypeFns;
}
