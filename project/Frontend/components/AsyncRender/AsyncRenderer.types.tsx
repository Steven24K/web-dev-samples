export interface SuccessHttpResponse<T> {
    kind: 'success';
    status: number;
    data: T;
}

export interface FailedHttpResponse {
    kind: 'failed';
    status: number;
    error: string;
}

export type HttpResponse<T> = SuccessHttpResponse<T> | FailedHttpResponse

export type AsyncState<T> = {
    kind: 'idle'
} | {
    kind: 'pending'
    async: () => Promise<HttpResponse<T>>
} | {
    kind: 'fulfilled'
    response: SuccessHttpResponse<T>
} | {
    kind: 'rejected'
    error: FailedHttpResponse
}