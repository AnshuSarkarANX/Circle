import PostStats from "@/components/Shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useGetPostById } from "@/lib/react-query/queriesAndMutations";
import { formatRelativeTime } from "@/lib/utils";
import { CalendarDays, CircleSlashIcon, Loader } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || "");
  const {user} =useUserContext();
  const handleDeletePost =()=>{};
  return (
    <div className="post_details-container">
      {isPending ? (
        <Loader />
      ) : (
        <div className="post_details-card">
          <img src={post?.imageUrl} alt="post" className="post_details-img" />
          <div className="post_details-info">
            <div className=" flex-between w-full">
              <Link
                to={`/profile/${post?.creator.$id}`}
                className=" flex items-center gap-3"
              >
                <img
                  src={
                    post?.creator?.imageUrl ||
                    "/assets/icons/profile_placeholder.svg"
                  }
                  alt="creator"
                  className="rounded-full w-9 lg:h-14 lg:w-14"
                ></img>

                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1">
                    {post?.creator.name}
                  </p>
                  <div className="flex flex-center gap-2 text-light-3 ">
                    <p className="subtle-semibold lg:small-regular">
                      {formatRelativeTime(post?.$createdAt)}
                    </p>
                    -
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>
              <div
                className={`flex-center gap-4 ${
                  user.id !== post?.creator.$id && "hidden"
                }`}
              >
                <Link to={`/update-post/${post?.$id}`}>
                  <img
                    src="/assets/icons/edit.svg"
                    className="w-8 h-8 lg:w-10 lg:h-10"
                  />
                </Link>
                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className="ghost_detailsdelete_btn"
                >
                  <img
                    src="/assets/icons/delete.svg"
                    alt="delete"
                    className="w-8 h-8 lg:w-10 lg:h-10"
                  />
                </Button>
              </div>
            </div>
            <hr className="border w-full border-dark-4/80" />
            <div className=" flex flex-col flex-1 w-full small-medium lg:base-regular ">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags?.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full">
              <PostStats post={post} userId={user.id}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
