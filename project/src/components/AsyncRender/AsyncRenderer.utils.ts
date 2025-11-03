import { AsyncState, FailedHttpResponse, HttpResponse, SuccessHttpResponse } from "./AsyncRenderer.types"

export const successResponse = <T>(data: T, status: number): SuccessHttpResponse<T> => 
    ({ kind: 'success', data: data, status: status })

export const failedResponse = (status: number, error: string): FailedHttpResponse => 
    ({ kind: 'failed', status: status, error: error })

export const pending = <T>(_async: () => Promise<HttpResponse<T>>): AsyncState<T> => 
    ({ kind: 'pending', async: _async })

export const idle = <T>(): AsyncState<T> => ({ kind: 'idle' })

export const fulfilled = <T>(_response: SuccessHttpResponse<T>): AsyncState<T> => 
    ({ kind: 'fulfilled', response: _response })

export const rejected = <T>(_error: FailedHttpResponse): AsyncState<T> => 
    ({ kind: 'rejected', error: _error })
