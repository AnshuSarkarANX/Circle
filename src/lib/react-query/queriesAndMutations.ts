//To simplify data fetching and mutation & to get benefits such as caching, infinite scroll,etc.
import{
    useQuery, //for fetching the data
    useMutation, //for modifying the data
    useQueryClient,
    useInfiniteQuery, 

} from '@tanstack/react-query'
import { createPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePosts, getPostById, getRecentPosts, likePost, savePost, searchPosts, signInAccount, signOutAccount, updatePost } from '../appwrite/api'
import { INewPost, INewUser, IUpdatePost } from '@/types'
import { QUERY_KEYS } from './queryKeys'
import { any } from 'zod'

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
export const useGetRecentPosts = () =>{
    return useQuery({
        queryKey : [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn:getRecentPosts,
    })
}
export const useLikePosts =()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:({postId, likesArray}:{ postId:string, likesArray:string[] })=>likePost(postId,likesArray),
        onSuccess:(data)=>{
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_CURRENT_USER]
            })
            
        }
    })
}
export const useSavePosts =()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:({postId, userId}:{ postId:string, userId:string })=>savePost(postId,userId),
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_CURRENT_USER]
            })
            
        }
    })
}
export const useDeleteSavedPosts =()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:({savedRecordId}:{savedRecordId:string})=>deleteSavedPost(savedRecordId),
        onSuccess:()=>{
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey:[QUERY_KEYS.GET_CURRENT_USER]
            })
            
        }
    })
}
export const useGetCurrentUser = () =>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_CURRENT_USER],
        queryFn:getCurrentUser
    })

}
export const useGetPostById = (postId:string)=>{
    return useQuery({
        queryKey:[QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn:()=>getPostById(postId),
        enabled:!!postId,
    })
}
export const useUpdatePost = () => {
const queryClient = useQueryClient();
return useMutation({
    mutationFn:(post:IUpdatePost) => updatePost(post),
    onSuccess:(data)=>{
        queryClient.invalidateQueries({
            queryKey:[QUERY_KEYS.GET_POST_BY_ID, data?.$id]
        })
    }
})
}
export const useDeletePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) =>
      deletePost(postId,imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
    },
  });
};
export const useGetInfinitePosts = () =>{
    return useInfiniteQuery({
      queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      queryFn: getInfinitePosts as any,
      initialPageParam:any,
      getNextPageParam: (lastPage:any) => {
        if (lastPage && lastPage.documents.length === 0) {
          return null;
        }
        const lastId = lastPage?.documents[lastPage?.documents.length - 1].$id;
        return lastId;
      },
    });
}

export const useSearchPosts = (searchTerm:string) =>{
    return useQuery({
        queryKey:[QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn:()=> searchPosts(searchTerm),
        enabled : !!searchTerm
    })
}