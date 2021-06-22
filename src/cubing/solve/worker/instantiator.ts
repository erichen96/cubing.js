import { wrap } from "comlink";
import type { WorkerInsideAPI } from "./vendor/api/inside";
import type { URL as NodeURL } from "url";

const useNodeWorkarounds = typeof globalThis.Worker === "undefined";

export async function instantiateRelativeURLWorker(): Promise<void> {
  return new Promise(async (resolve, reject) => {
    setTimeout(() => {
      // console.log("timeout");
      reject();
    }, 1000);
    // console.log("instantiateRelativeURLWorker");
    let terminate: () => void;
    if (useNodeWorkarounds) {
      const constructor = (await import("worker_threads")).Worker;
      const rawWorker = new constructor(
        new URL("./worker-stub.js", import.meta.url) as NodeURL,
      );
      terminate = rawWorker.terminate.bind(rawWorker);
      // @ts-ignore
      // const adapter = (await import("comlink/dist/esm/node-adapter.mjs"))
      //   .default;
      rawWorker.postMessage("to worker");
      rawWorker.on("message", (message) => {
        // console.log("message", message);
        if (message === "from worker") {
          terminate();
          // console.log("resolve");
          resolve();
        }
      });
    } else {
      const worker = new Worker(new URL("./worker-stub.js", import.meta.url), {
        type: "classic",
      });
      terminate = worker.terminate.bind(worker);
      worker.postMessage("to worker");
      worker.onmessage = (message) => {
        if (message.data === "from worker") {
          terminate();
          // console.log("resolve");
          resolve();
        }
      };
    }
  });
}

export async function relativeURLWorkerTest(): Promise<void> {
  try {
    await instantiateRelativeURLWorker();
    console.info("Successful relative URL worker instantiation.");
  } catch (e) {
    console.warn(
      "WARNING: Could not instantiate a relative URL worker. This means that your app may have issues with `cubing/solve` in the future.",
    );
  }
}

export async function instantiateWorker(): Promise<{
  wrappedWorker: WorkerInsideAPI;
  terminate: () => void;
}> {
  await relativeURLWorkerTest();
  // console.log("testing success");
  // console.log("instantiateWorker");
  // const { workerSource } = await import("./worker-inside-generated-string");

  // if (!import.meta.url) {
  //   // We will need to rely on `new Worker(new URL(workerEntryPath, import.meta.url))` in the future.
  //   console.warn(
  //     "WARNING: `cubing/solve` is not being used in a module environment. Future versions of `cubing.js` might require a module environment for `cubing/solve`.",
  //   );
  // }

  // TODO: trampoline??
  let terminate: () => void;
  let worker: Worker;
  if (useNodeWorkarounds) {
    const constructor = (await import("worker_threads")).Worker;
    const rawWorker = new constructor(
      new URL(
        "./worker-inside-generated-string.cjs",
        import.meta.url,
      ) as NodeURL,
    );
    terminate = rawWorker.terminate.bind(rawWorker);
    // @ts-ignore
    const adapter = (await import("comlink/dist/esm/node-adapter.mjs")).default;
    worker = adapter(rawWorker);
  } else {
    worker = new Worker(
      new URL("./worker-inside-generated-string.cjs", import.meta.url),
      {
        type: "classic",
      },
    );
    terminate = worker.terminate.bind(worker);
  }
  const returno = { wrappedWorker: wrap(worker) as WorkerInsideAPI, terminate };
  // console.log("returno", returno);
  return returno;
}
