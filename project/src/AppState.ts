export interface AppState {
    page: PageType
}

export type PageType = "home" |
    "about" |
    "contact" |
    "article" |
    "sample-page" |
    "tic-tac-toe" |
    "tic-tac-toe-ai"

export const defaultAppState = (): AppState => ({
    page: 'home'
})