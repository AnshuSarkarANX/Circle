//To simplify data fetching and mutation & to get benefits such as caching, infinite scroll,etc.
import{
    useQuery, //for fetching the data
    useMutation, //for modifying the data
    useQueryClient, 
    useInfiniteQuery,

} from '@tanstack/react-query'
import { createPost, createUserAccount, signInAccount, signOutAccount } from '../appwrite/api'
import { INewPost, INewUser } from '@/types'
import { QUERY_KEYS } from './queryKeys'

//The arrow function returns a call to use mutation.
export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: {
            email: string; 
            password: string;}) => signInAccount(user)
    })
}
export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount
    })
}
export const useCreatePost = ()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(post:INewPost) => createPost(post),
        onSuccess: () =>{
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}
