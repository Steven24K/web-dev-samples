// https://randomuser.me/api/?results=100

import React from "react"
import { RandomUser } from "../types/RandomUser"

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

type HttpResponse<T> = {
    kind: 'success'
    data: T;
    status: number;
} | {
    kind: 'failed'
    status: number
    error: string
}

type AsyncState<T> = {
    kind: 'idle'
} | {
    kind: 'pending'
    async: () => Promise<HttpResponse<T>> // TODO: Put extra http data in return
} | {
    kind: 'fullfilled' | 'rejected'
    data: HttpResponse<T>
}

function pendingState<T>(_async: () => Promise<HttpResponse<T>>): AsyncState<T> {
    return ({ kind: 'pending', async: _async })
}

function getRandomArbitrary(min: number, max: number): number {
    return Math.random() * (max - min) + min;
}

const fetchUsers = async (amount: number): Promise<HttpResponse<RandomUser>> => {
    const random = getRandomArbitrary(0, 10)
    if (random < 5) return ({ kind: 'failed', status: 500, error: 'Random error occurred' })

    const response = await fetch(`https://randomuser.me/api/?results=${amount}`)
    const data = await response.json() as RandomUser
    if (!response.ok) return ({ kind: 'failed', status: response.status, error: 'Error' })
    return ({ kind: 'success', data: data, status: response.status })
}


interface HomeState {
    users: AsyncState<RandomUser>
}

export const Home = () => {

    const [state, setState] = React.useState<HomeState>({
        users: { kind: 'idle' }
    });

    if (state.users.kind === 'idle') {
        setTimeout(() => {
            setState(s => ({
                ...s,
                users: pendingState(() => fetchUsers(10))
            }))
        }, 10000)
    }

    if (state.users.kind === 'pending') {
        state.users.async().then(response => {
            setState(s => ({
                ...s,
                users: {
                    kind: 'fullfilled',
                    data: response
                }
            }))
        }
        )
    }


    return <div>
        <h1>Welcome to the Home page</h1>
        <p>Simplicity since 1986</p>
        <h3>Did you know?</h3>
        <p>HTML stands for HyperText Markup Language.</p>

        <h2>Top 10 users</h2>
        {state.users.kind == 'fullfilled' && <ol>
            {state.users.data.kind == 'success' && state.users.data.data.results.map(user => <li key={user.login.uuid}>
                {user.name.first} {user.name.last} - {user.email}
            </li>)}

            {state.users.data.kind == 'failed' && <div>Error: {state.users.data.error}</div>}
        </ol>}

        {
            state.users.kind == 'pending' && <div>Loading users...</div>
        }

        {
            state.users.kind == 'rejected' && <div>Error loading users: {state.users.data.kind == 'failed' && state.users.data.error}</div>
        }
    </div>
}