export type GetTradesQueryArgs = {
    baseCurrency: string,
    quoteCurrency: string,
    since: string,
    till: string,
    window: number
}

export type OHLC = {
    time: number,
    low: number,
    high: number,
    open: number,
    close: number,
    volume: number
}

export type GetSymbolsQueryArgs = {
    smartContractAddress: string,
    smartContractEvent: string,
    argument: string,
    desc: string,
    limit: number
}