import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";
import { INewPost, INewUser, IUpdatePost } from "@/types";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount)
      throw Error(
        "Account creation failed: No response received from Appwrite."
      );

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}
//Accepts user as a parameter and destructures some of the values.
export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);

    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}
export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
  }
}
export async function createPost(post: INewPost) {
  try {
    //Upload image to storage
    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) throw Error;
    //Get fileUrl
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      deleteFile(uploadedFile.$id);
      throw Error;
    }
    //Convert tags in an array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];
    //New post
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );
    if (!newPost) {
      deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}
export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );
    return fileUrl;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteFile(fileid: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileid);
    return { status: "OK" };
  } catch (error) {
    console.log(error);
  }
}
export async function getRecentPosts() {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );
  if (!posts) throw Error;
  return posts;
}
export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatepost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );
    if (!updatepost) throw Error;
    return updatepost;
  } catch (error) {
    console.log(error);
  }
}
export async function savePost(postId: string, userId: string) {
  try {
    const updatepost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        post: postId,
        users: userId,
      }
    );
    if (!updatepost) throw Error;
    return updatepost;
  } catch (error) {
    console.log(error);
  }
}
export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );
    if (!statusCode) throw Error;
    return { status: "OK" };
  } catch (error) {
    console.log(savedRecordId);
    console.log(error);
  }
}
export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    return post;
  } catch (error) {
    console.log(error);
  }
}
export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;
  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };
    if (hasFileToUpdate) {
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw Error;
      //Get fileUrl
    const fileUrl = getFilePreview(uploadedFile.$id);
    if (!fileUrl) {
      deleteFile(uploadedFile.$id);
      throw Error;
    }
    image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }
    
    //Upload image to storage

    
    //Convert tags in an array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];
    //New post
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    );
    if (!updatedPost) {
      deleteFile(post.imageId);
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
}
export async function deletePost(postId:string,imageId:string) {
    if(!postId || !imageId) throw Error;
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )
        return {status:"Post Deleted"}
    } catch (error) {
        console.log(error)
    }
    
}
export async function getInfinitePosts({pageParams}:{pageParams:number}) {
    const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(6)];
    if(pageParams){
      queries.push(Query.cursorAfter(pageParams.toString()));
    }
    try {
      const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        queries,
      )
      if(!posts){
        throw Error
      }
      return posts;
    } catch (error) {
      console.log(error);
    }
}
export async function searchPosts(searchTerm:string ) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search('caption', searchTerm)],
    );
    if (!posts) {
      throw Error;
    }
    return posts;
  } catch (error) {
    console.log(error);
  }
}