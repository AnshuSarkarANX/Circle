import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";
import { formatRelativeTime } from "@/lib/utils";
import { useInView } from "react-intersection-observer";

type PostCardProps = {
  post: Models.Document;
};
const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.7,
  });

  return (
    <div className="post-card" ref={ref}>
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              src={
                post?.creator?.imageUrl ||
                "/assets/icons/profile_placeholder.svg"
              }
              alt="creator"
              className="rounded-full w-12 lg:h-12"
            ></img>
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creator.name || "loading"}
            </p>
            <div className="flex flex-start gap-1 text-light-3 ">
              <p className="subtle-semibold lg:small-regular">
                {formatRelativeTime(post.$createdAt)}
              </p>
              {post.location == "" || post.location == " " ? (
                " "
              ) : (
                <>
                  <p> - </p>
                  <p className="subtle-semibold lg:small-regular">
                    {post.location}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <Link
          to={`/update-post/${post.$id}`}
          className={`${user.id !== post.creator.$id && "hidden"}`}
        >
          <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
        </Link>
      </div>
      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string) => (
              <li key={tag} className="text-light-3">
                {tag == "" || tag == " "
                  ? " "
                  : tag[0] !== "#"
                  ? "#" + tag
                  : tag}
              </li>
            ))}
          </ul>
        </div>
        {inView ? (
          <img
            src={post.imageUrl || "/assets/images/giphy.webp"}
            className="post-card_img"
            alt="post_image"
          />
        ) : (
          <img
            src={"/assets/images/AnimationY.gif"}
            className="post-card_img"
            alt="post_image"
          />
        )}
      </Link>
      <PostStats post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;
