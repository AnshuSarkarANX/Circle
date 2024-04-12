//To simplify data fetching and mutation & to get benefits such as caching, infinite scroll,etc.
import{
    useQuery, //for fetching the data
    useMutation, //for modifying the data
    useQueryClient, 
    useInfiniteQuery,

} from '@tanstack/react-query'
import { createUserAccount, signInAccount } from '../appwrite/api'
import { INewUser } from '@/types'

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
