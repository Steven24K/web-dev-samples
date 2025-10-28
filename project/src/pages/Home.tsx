// https://randomuser.me/api/?results=100

import React from "react"
import { RandomUser, RandomUserApiResponse } from "../types/RandomUser"

// Async rendering state machine example 

/**
 * TODO: 
 * 1. Make async function that fetches data from the above API
 * 2. Return type is a Promise<User[]> or actually paginated response
 * 3. Create a User type that matches the API response
 * 4. Fetch data based on condition, useEffect is not needed for this
 * 5. We need an extra datatype to tell if the state of the promise is idle, loading, error or success
 * 6. Make components that render either the result, a loading spinner or error message
 * 7. Additionally, make a automatic retry mechanism that retries fetching data 3 times with exponential backoff
 * 
 * 8. Compare the custom solution with the <Suspense> and use() Hook from React
 */

interface SuccessHttpResponse<T> {
    kind: 'success';
    status: number;
    data: T;
}

interface FailedHttpResponse {
    kind: 'failed';
    status: number;
    error: string;
}

type HttpResponse<T> = SuccessHttpResponse<T> | FailedHttpResponse

function successResponse<T>(data: T, status: number): SuccessHttpResponse<T> {
    return ({ kind: 'success', data: data, status: status })
}

function failedResponse(status: number, error: string): FailedHttpResponse {
    return ({ kind: 'failed', status: status, error: error })
}

type AsyncState<T> = {
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

function pending<T>(_async: () => Promise<HttpResponse<T>>): AsyncState<T> {
    return ({ kind: 'pending', async: _async })
}

function idle<T>(): AsyncState<T> {
    return ({ kind: 'idle' })
}

function fulfilled<T>(_response: SuccessHttpResponse<T>): AsyncState<T> {
    return ({ kind: 'fulfilled', response: _response })
}

function rejected<T>(_error: FailedHttpResponse): AsyncState<T> {
    return ({ kind: 'rejected', error: _error })
}

function getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

const fetchUsers = async (amount: number): Promise<HttpResponse<RandomUserApiResponse>> => {
    const random = getRandomArbitrary(0, 10)
    if (random < 3) return failedResponse(500, 'API randomly failed')

    const response = await fetch(`https://randomuser.me/api/?results=${amount}`)
    const data = await response.json() as RandomUserApiResponse
    if (!response.ok) return failedResponse(response.status, response.statusText)
    return successResponse(data, response.status)
}


interface HomeState {
    users: AsyncState<RandomUserApiResponse>
}

export const Home = () => {

    // Set async state to idle, means we don't do anything yet
    const [state, setState] = React.useState<HomeState>({ users: idle() });

    // When it is idle, we can set a pending promise, it is set ready to be executed later
    if (state.users.kind === 'idle')
        setState(s => ({ ...s, users: pending(() => fetchUsers(10)) }))

    // Simulate delay before executing the promise, 
    setTimeout(() => {
        if (state.users.kind === 'pending')
            state.users.async()
                .then(response => setState(s => ({ ...s, users: response.kind === 'success' ? fulfilled(response) : rejected(response) })))
    }, 3000)


    return <div>
        <h1>Welcome to the Home page</h1>
        <p>Simplicity since 1986</p>
        <h3>Did you know?</h3>
        <p>HTML stands for HyperText Markup Language.</p>

        <h2>Top 10 users</h2>

        <AsyncRenderer<RandomUserApiResponse>
            asyncState={state.users}
            onFulfilled={data => <RandomUserGrid data={data} />}
            retry={() => setState(s => ({ ...s, users: pending(() => fetchUsers(10)) }))}
        />
    </div>
}

export const RandomUserGrid: React.FC<{ data: RandomUserApiResponse }> = ({ data }) => {
    return <div className="user-grid">
        {data.results.map((user, index) => <RandomUserCard key={index} user={user} />)}
    </div>
}

export const RandomUserCard: React.FC<{ user: RandomUser }> = ({ user }) => {
    return <div className="user-card">
        <img src={user.picture.large} alt={`${user.name.first} ${user.name.last}`} />
        <h3>{user.name.first} {user.name.last}</h3>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone}</p>
        <p>Cell: {user.cell}</p>
        <p>Location: {user.location.city}, {user.location.country}</p>
        <p>Address: {user.location.street.number} {user.location.street.name}</p>
        <p>Birthday: {new Date(user.dob.date).toLocaleDateString()}</p>
        <p>Age: {user.dob.age}</p>
        <p>Gender: {user.gender}</p>
        <a href={`https://www.google.com/maps?q=${user.location.coordinates.latitude},${user.location.coordinates.longitude}`} target="_blank" rel="noopener noreferrer">View on Google Maps</a>
    </div>
}


interface AsyncRendererProps<T> {
    asyncState: AsyncState<T>
    onFulfilled: (data: T) => React.ReactNode
    retry?: () => void
}

function AsyncRenderer<T>(props: AsyncRendererProps<T>) {
    const { asyncState, onFulfilled, retry } = props;
    return <>
        {asyncState.kind === 'idle' && <div>Idle...</div>}
        {asyncState.kind === 'pending' && <span className="loader"></span>}
        {asyncState.kind === 'rejected' && <div className="error">Error: {asyncState.error.error} (status: {asyncState.error.status}) <button onClick={retry}>Retry</button></div>}
        {asyncState.kind === 'fulfilled' && onFulfilled(asyncState.response.data)}
    </>
}