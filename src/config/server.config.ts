export interface WBTestConfiguration {
    intervalMin: number, 
}

// singleton config
export const serverConfiguration: WBTestConfiguration = {
    intervalMin: 60 // Tarrif data update interval in minutes 
};