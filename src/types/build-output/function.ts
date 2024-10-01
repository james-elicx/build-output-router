export type ExecutionContext = {
	waitUntil: (promise: Promise<unknown>) => void;
};

export type EdgeFunction = {
	default: (request: Request, context: ExecutionContext) => Response | Promise<Response>;
};
