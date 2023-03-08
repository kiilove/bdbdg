import useFirestoreSearch from "./useFirestoreSearch";
import { db } from "../firebaseConfig";

const ReactPosts = () => {
  const conditions = [where("category", "==", "React")];
  const data = useFirestoreSearch("posts", conditions, "createdAt", "desc", 5);

  return (
    <div>
      {data.map((post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ReactPosts;
