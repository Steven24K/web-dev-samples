export interface AppState {
    page: PageType
}

export type PageType = "home" |
    "about" |
    "contact" |
    "article" |
    "sample-page" |
    "tic-tac-toe" |
    "tic-tac-toe-ai" | 
    "users-page" | 
    "random-student-group"

export const defaultAppState = (): AppState => ({
    page: 'home'
})