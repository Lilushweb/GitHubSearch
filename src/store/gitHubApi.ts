import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Repository, SearchResponse } from './type'

const githubApi = createApi({
    reducerPath: 'githubApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://api.github.com/graphql',
        prepareHeaders: (headers) => {
            headers.set('Authorization', `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`)
            return headers
        },
    }),
    endpoints: (builder) => ({
        searchRepositories: builder.query<{
            repositoryCount: number
            repositories: Repository[]
            hasNextPage: boolean
            endCursor: string | null
        }, { submittedTerm: string; first: number; after: string | null | undefined }>({
            query: ({ submittedTerm, first, after }) => ({
                url: '',
                method: 'POST',
                body: {
                    query: `
                        query {
                            search(query: "${submittedTerm}", type: REPOSITORY, first: ${first}, after: "${after || ''}") {
                                edges {
                                    node {
                                        ... on Repository {
                                            name
                                            primaryLanguage {
                                                name
                                            }
                                            languages(first: 5) {  
                                                edges {
                                                    node {
                                                        name
                                                    }
                                                }
                                            }
                                            stargazerCount
                                            forkCount
                                            updatedAt
                                            description
                                            licenseInfo {
                                            key
                                            name 
                                            }
                                        }
                                    }
                                }
                                pageInfo {
                                    hasNextPage
                                    endCursor
                                }
                                repositoryCount
                            }
                        }
                    `,
                },
            }),
            transformResponse: (response: SearchResponse) => {
                if (response.data && response.data.search) {
                    return {
                        repositories: response.data.search.edges.map(edge => ({
                            ...edge.node,
                            languages: edge.node.languages?.edges.map(lang => lang.node.name) || [], // Извлечение языков
                        })),
                        hasNextPage: response.data.search.pageInfo.hasNextPage,
                        endCursor: response.data.search.pageInfo.endCursor,
                        repositoryCount: response.data.search.repositoryCount || 0,
                    }
                }
                return {
                    repositories: [],
                    hasNextPage: false,
                    endCursor: null,
                    repositoryCount: 0,
                }
            },
        }),
    }),
})

export const { useSearchRepositoriesQuery } = githubApi
export default githubApi