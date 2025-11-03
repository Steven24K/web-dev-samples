import { Suspense, use } from "react"
import { fetchUsers2 } from "../api"
import { RandomUserApiResponse } from "../types/RandomUser"
import { RandomUserGrid } from "../components/RandomUserGrid"


export const UsersPage = () => <div>
    <h1>Users Page</h1>
    <p>List of users will be displayed here.</p>

    <Suspense
        fallback={<span className="loader"></span>}>
        <UserList data={fetchUsers2(30)} />
    </Suspense>
</div>

interface UserListProps {
    data: Promise<RandomUserApiResponse>
}

export const UserList = (props: UserListProps) => {
    const users = use(props.data)
    return <div>
        <h2>User List Component</h2>
        <RandomUserGrid data={users} />
    </div>
}