import { useGetRecentPosts } from "@/lib/react-query/queriesAndMutations";
import { lazy, Suspense } from "react";
import { Loader } from "lucide-react";
import { Models } from "appwrite";
const PostCard = lazy(()=> import( "@/components/Shared/PostCard"))
const Home = () => {
const { data: posts, isPending:isPending } = useGetRecentPosts();
  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>

          <ul className="flex flex-col flex-1 gap-9 w-full">
            {isPending ? (
              <div className="post-card">
                <div className="flex-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={"/assets/icons/profile_placeholder.svg"}
                      alt="creator"
                      className="rounded-full w-12 lg:h-12"
                    ></img>
                    <div className="flex flex-col">
                      <p className="base-medium lg:body-bold text-light-1">
                        {"loading"}
                      </p>
                      <div className="flex flex-start gap-1 text-light-3 ">
                        <p className="subtle-semibold lg:small-regular">time</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="small-medium lg:base-medium py-5">
                  <p>caption</p>
                  <ul className="flex gap-1 mt-2"></ul>
                </div>
                <img
                  src={"/assets/images/AnimationY.gif"}
                  className="post-card_img"
                  alt="post_image"
                />
              </div>
            ) : (
              posts?.documents.map((post: Models.Document) => (
                <Suspense
                  fallback={
                    <div className="post-card">
                      <div className="flex-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={"/assets/icons/profile_placeholder.svg"}
                            alt="creator"
                            className="rounded-full w-12 lg:h-12"
                          ></img>
                          <div className="flex flex-col">
                            <p className="base-medium lg:body-bold text-light-1">
                              {"loading"}
                            </p>
                            <div className="flex flex-start gap-1 text-light-3 ">
                              <p className="subtle-semibold lg:small-regular">
                                time
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="small-medium lg:base-medium py-5">
                        <p>caption</p>
                        <ul className="flex gap-1 mt-2"></ul>
                      </div>
                      <img
                        src={"/assets/images/AnimationY.gif"}
                        className="post-card_img"
                        alt="post_image"
                      />
                    </div>
                  }
                >
                  <PostCard post={post} key={post.$id} />
                </Suspense>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Home;