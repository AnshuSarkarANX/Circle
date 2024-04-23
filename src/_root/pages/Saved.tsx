import GridPostList from "@/components/Shared/GridPostList";
import Loader from "@/components/Shared/Loader";
import {useGetCurrentUser} from "@/lib/react-query/queriesAndMutations";
import { Models } from "appwrite";

const Saved = () => {
  const{data:currentUser} = useGetCurrentUser();
  const savePosts = currentUser?.save
    .map((savePost: Models.Document) => ({
      ...savePost.post,
      creator: {
        imageUrl: currentUser.imageUrl,
      },
    }))
    .reverse();
  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Saved Posts</h2>
        {!currentUser ? (
          <Loader />
        ) : (savePosts.length === 0) ? (
          <p>No saved posts</p>
        ) : (
          
          <GridPostList posts={savePosts} showStats={false} showUser={false}/>
        )}
      </div>
    </div>
  );
};

export default Saved;
