type WorkerTypeFns = {
  [Fn in keyof WorkerType]: (
    ...p: Parameters<WorkerType[Fn]>
  ) => Promise<Awaited<ReturnType<WorkerType[Fn]>>>;
};
export type { WorkerTypeFns };
