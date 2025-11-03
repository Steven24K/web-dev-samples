import { RandomUserApiResponse } from "../types/RandomUser"
import { RandomUserCard } from "./RandomUserCard"

export const RandomUserGrid: React.FC<{ data: RandomUserApiResponse }> = ({ data }) => {
    return <div className="user-grid">
        {data.results.map((user, index) => <RandomUserCard key={index} user={user} />)}
    </div>
}