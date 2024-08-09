
interface Language {
    name: string
}

export interface Repository {
    name: string
    primaryLanguage: Language | null
    languages: string[] | null
    stargazerCount: number
    forkCount: number
    updatedAt: string
    description: string | null
    licenseInfo: {
        key: string
        name: string
    } | null
}

export interface PageInfo {
    hasNextPage: boolean
    endCursor: string | null
    repositoryCount: number
}

export interface SearchResponse {
    data: {
        search: {
            repositoryCount: number
            edges: Array<{
                node: Repository
            }>
            pageInfo: PageInfo

        }
    }
}