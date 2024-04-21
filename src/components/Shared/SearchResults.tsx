import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostList from "./GridPostList";

type SearchResultProps ={
  isSearching : boolean;
  searchedPosts : Models.Document[];
}
const SearchResults = ({isSearching,searchedPosts} : SearchResultProps) => {
  if(isSearching) return <Loader/>
  if( searchedPosts && searchedPosts.documents.length > 0) return <GridPostList  posts={searchedPosts.documents}/>
  return (
    <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  )
}

export default SearchResults