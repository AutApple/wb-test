export interface WBTestConfiguration {
    intervalMin: number,
    sheetIds: string[],
    tabName: string
}

// singleton config
export const appConfiguration: WBTestConfiguration = {
    intervalMin: 60, // Tarrif data update interval in minutes
    sheetIds: [ // Google spreadsheet ids
        '1sytYVJrki8-yt3AjoGLxKvbvmrdvFt1lHrqBPe7NNOE'
    ],
    tabName: 'stocks_coefs'
};