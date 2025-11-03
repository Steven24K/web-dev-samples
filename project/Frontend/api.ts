import { HttpResponse } from "./components/AsyncRender/AsyncRenderer.types"
import { failedResponse, successResponse } from "./components/AsyncRender/AsyncRenderer.utils"
import { RandomUserApiResponse } from "./types/RandomUser"
import { getRandomArbitrary } from "./utils"

// https://randomuser.me/api/?results=100

export const fetchUsers = async (amount: number): Promise<HttpResponse<RandomUserApiResponse>> => {
    const random = getRandomArbitrary(0, 10)
    if (random < 3) return failedResponse(500, 'API randomly failed')

    const response = await fetch(`https://randomuser.me/api/?results=${amount}`)
    const data = await response.json() as RandomUserApiResponse
    if (!response.ok) return failedResponse(response.status, response.statusText)
    return successResponse(data, response.status)
}

export const fetchUsers2 = (amount: number): Promise<RandomUserApiResponse> =>
    fetch(`https://randomuser.me/api/?results=${amount}`)
        .then(response => {
            const random = getRandomArbitrary(0, 10)
            if (true) return Promise.reject('API randomly failed')
            if (!response.ok) return Promise.reject(response.statusText)
            return response.json() as Promise<RandomUserApiResponse>
        })
        .then(data => data)
        .catch(error => Promise.reject(error))