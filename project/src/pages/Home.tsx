import React from "react"
import { RandomUserApiResponse } from "../types/RandomUser"
import { AsyncState } from "../components/AsyncRender/AsyncRenderer.types";
import { idle } from "../components/AsyncRender/AsyncRenderer.utils";
import { AsyncRenderer } from "../components/AsyncRender/AsyncRenderer.layout";
import { RandomUserGrid } from "../components/RandomUserGrid";
import { fetchUsers } from "../api";

interface HomeState {
    users: AsyncState<RandomUserApiResponse>
}

export const Home = () => {
    // Set async state to idle, means we don't do anything yet
    const [state, setState] = React.useState<HomeState>({ users: idle() });

    const updateUsers = (users: AsyncState<RandomUserApiResponse>) => (homeState: HomeState): HomeState =>
        ({ ...homeState, users: users })

    const setUserState = (users: AsyncState<RandomUserApiResponse>) =>
        setState(updateUsers(users))

    return <div>
        <h1>Welcome to the Home page</h1>
        <p>Simplicity since 1986</p>
        <h3>Did you know?</h3>
        <p>HTML stands for HyperText Markup Language.</p>
        
        <h2>Top 10 users</h2>

        <AsyncRenderer<RandomUserApiResponse>
            asyncState={state.users}
            async={() => fetchUsers(10)}
            onFulfilled={data => <RandomUserGrid data={data} />}
            retry={setUserState}
            onError={setUserState}
            onLoaded={setUserState}
            onLoading={setUserState}
        />
    </div>
}





