


export interface FirstState {
    initialized: boolean;
    fetching: boolean;
    result: any;
}

export interface CombinedState {
    first:FirstState
}