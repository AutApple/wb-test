export abstract class BaseJob {
	constructor() {}
	public abstract execute(): Promise<void>;
}
