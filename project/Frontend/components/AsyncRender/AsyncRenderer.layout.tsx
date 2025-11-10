import { useEffect } from "react";
import { AsyncState, HttpResponse } from "./AsyncRenderer.types";
import { fulfilled, pending, rejected } from "./AsyncRenderer.utils";


export interface AsyncRendererProps<T> {
    asyncState: AsyncState<T>
    async: () => Promise<HttpResponse<T>>
    onFulfilled: (data: T) => React.ReactNode
    onLoading: (asyncState: AsyncState<T>) => void
    onLoaded: (response: AsyncState<T>) => void
    onError: (error: AsyncState<T>) => void
    retry: (asyncState: AsyncState<T>) => void
}

export function AsyncRenderer<T>(props: AsyncRendererProps<T>) {
    const { asyncState, onFulfilled, retry, onLoaded, onError, onLoading, async } = props;

    useEffect(() => {
        if (asyncState.kind === 'idle')
            onLoading(pending(async))
    }, [asyncState.kind]);

    useEffect(() => {
        if (asyncState.kind === 'pending')
            setTimeout(() => { // Timeout to simulate loading with slow network
                async()
                    .then(response =>
                        response.kind === 'success' ?
                            onLoaded(fulfilled(response)) :
                            onError(rejected(response))
                    )
            }, 3000)
    }, [asyncState.kind])

    return <>
        {asyncState.kind === 'idle' && <div>Idle...</div>}
        {asyncState.kind === 'pending' && <span className="loader"></span>}
        {
            asyncState.kind === 'rejected' &&
            <div className="error">
                <span>Error: {asyncState.error.error} (status: {asyncState.error.status})</span>
                <button onClick={() => retry(pending(async))}>
                    Retry
                </button>
            </div>
        }
        {asyncState.kind === 'fulfilled' && onFulfilled(asyncState.response.data)}
    </>
}