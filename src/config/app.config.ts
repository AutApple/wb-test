export interface WBTestConfiguration {
	intervalMin: number;
	parallelChunkSizeLimit: number;
	sheetIds: string[];
	tabName: string;
}

// singleton application configuration
export const appConfiguration: WBTestConfiguration = {
	intervalMin: 60, // Tarrif data update interval in minutes
	parallelChunkSizeLimit: 10, // How many sheet updates to do in parallel (this limit exists to prevent HTTP 429)
	sheetIds: [
		// Google spreadsheet ids
		'1sytYVJrki8-yt3AjoGLxKvbvmrdvFt1lHrqBPe7NNOE',
	],
	tabName: 'stocks_coefs', // Name of a google tab
};
