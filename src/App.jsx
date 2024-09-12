import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams, useNavigate } from "react-router-dom";
import "./App.css";

const App = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    setPosts(savedPosts);
  }, []);

  const savePosts = (posts) => {
    localStorage.setItem("posts", JSON.stringify(posts));
    setPosts(posts);
  };

  const addPost = (newPost) => {
    const updatedPosts = [newPost, ...posts];
    savePosts(updatedPosts);
  };

  const addComment = (postId, comment) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, comments: [...post.comments, comment] } : post
    );
    savePosts(updatedPosts);
  };

  const deletePost = (postId) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    savePosts(updatedPosts);
  };

  const PostList = () => {
    const [sortOrder, setSortOrder] = useState("desc");

    const sortedPosts = [...posts].sort((a, b) => {
      return sortOrder === "desc" ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date);
    });

    return (
      <div>
        <h1>Přehled příspěvků</h1>
        <button onClick={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}>
          Řadit podle data: {sortOrder === "desc" ? "Nejnovější" : "Nejstarší"}
        </button>
        <ul>
          {sortedPosts.map((post) => (
            <li key={post.id} className="post-item">
              <Link to={`/post/${post.id}`}>
                <h3>{post.title}</h3>
                <p>Autor: {post.author} | Datum: {new Date(post.date).toLocaleString()}</p>
              </Link>
              <button className="delete-button" onClick={() => deletePost(post.id)}>Smazat</button>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
      e.preventDefault();
      const newPost = {
        id: Date.now(),
        title,
        author,
        content,
        date: new Date(),
        comments: [],
      };
      addPost(newPost);
      navigate("/");
    };

    return (
      <div>
        <h1>Vytvořit nový příspěvek</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Jméno autora:</label>
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required />
          </div>
          <div>
            <label>Titulek:</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label>Obsah:</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
          </div>
          <button type="submit">Přidat příspěvek</button>
        </form>
      </div>
    );
  };

  const PostDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const post = posts.find((p) => p.id === parseInt(id));
    const [commentText, setCommentText] = useState("");

    const handleCommentSubmit = (e) => {
      e.preventDefault();
      if (commentText.trim()) {
        addComment(post.id, { text: commentText, date: new Date() });
        setCommentText("");
      }
    };

    const handleDelete = () => {
      deletePost(post.id);
      navigate("/");
    };

    if (!post) {
      return <div>Příspěvek nebyl nalezen</div>;
    }

    return (
      <div>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
        <p>
          <strong>Autor:</strong> {post.author} | <strong>Datum:</strong> {new Date(post.date).toLocaleString()}
        </p>

        <h2>Komentáře</h2>
        {post.comments.length === 0 ? (
          <p>Žádné komentáře</p>
        ) : (
          <ul>
            {post.comments.map((comment, index) => (
              <li key={index}>
                {comment.text} - {new Date(comment.date).toLocaleString()}
              </li>
            ))}
          </ul>
        )}

        <form onSubmit={handleCommentSubmit}>
          <div>
            <label>Komentář:</label>
            <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)}></textarea>
          </div>
          <button type="submit">Přidat komentář</button>
        </form>

        <button className="delete-button" onClick={handleDelete}>Smazat příspěvek</button>
      </div>
    );
  };

  return (
    <Router>
      <div className="app-container">
        <nav>
          <Link to="/">Přehled příspěvků</Link> | <Link to="/create">Vytvořit příspěvek</Link>
        </nav>

        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
