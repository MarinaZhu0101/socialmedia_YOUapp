import React, { useEffect, useState} from 'react';
import {useParams, useNavigate} from "react-router-dom";
import axios from 'axios';
import "../App.css";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SendIcon from '@mui/icons-material/Send';
import EmojiPicker from 'emoji-picker-react';

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

function Post() {
  let {id} = useParams();
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState([]);
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false); 
  const [likesCount, setLikesCount] = useState(0); 
  const [errorMessage, setErrorMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [commentContent, setCommentContent] = useState("");  

  useEffect(()=> {
    const accessToken = sessionStorage.getItem("accessToken");
    const authHeader = accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
      
    axios.get(`https://you-app-backend.vercel.app/posts/byId/${id}`, {
      headers: authHeader
    })
    .then(res => {
      setPost(res.data);
      setIsLiked(res.data.isLikedByCurrentUser); 
      setLikesCount(res.data.likesCount); 
      console.log("Data received from backend:", res.data);
    })
    .catch(err => console.log(err));

    axios.get(`https://you-app-backend.vercel.app/comments/${id}`)
    .then(res => {
      setComment(Array.isArray(res.data) ? res.data : []);
    })
    .catch(err => console.log(err));

  },[id]);

const handleEmojiClick = (emojiData, event) => {
  console.log(emojiData); 
  setCommentContent(prevContent => prevContent + emojiData.emoji);
  setShowEmojiPicker(false);
};

const toggleEmojiPicker = () => setShowEmojiPicker(!showEmojiPicker); 

const handleCommentChange = (e) => {
  setCommentContent(e.target.value); 
};

const handleCommentSubmit = (e) => {
  e.preventDefault(); 

  const accessToken = sessionStorage.getItem("accessToken");
  if (!accessToken) {
    navigate("/login");
    return;
  }

  const commentContent = new FormData(e.currentTarget).get('comment').trim();
  if (commentContent === "") {
    setErrorMessage("Please enter your comment!!!"); 
    return;
  } else {
    setErrorMessage(''); 
  }

  axios.post(`https://you-app-backend.vercel.app/comments/${id}`, { comment: commentContent }, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
    },
  })
  .then(res => {
    axios.get(`https://you-app-backend.vercel.app/comments/${id}`)
    .then(res => {
      setComment(Array.isArray(res.data) ? res.data : []);
      setCommentContent(''); 
    })
    .catch(err => console.log(err));
  })
  .catch(err => console.log(err));
};


  if (!post) {
    return <div>Loading...</div>;
  }


  const likeAPost = (postId, currentlyLiked) =>{
      
    const accessToken = sessionStorage.getItem("accessToken"); 
      if (!accessToken) {
        alert('You must be logged in to like a post.');
        navigate("/login");
        return;
      }

      axios.post('https://you-app-backend.vercel.app/likes',{ 
        postId: postId,
        action: currentlyLiked ? 'unlike' : 'like'
      }, {
        headers: {
          'Authorization': `Bearer ${accessToken}`, 
        }
      })
      .then(res => {
        setIsLiked(res.data.isLikedByCurrentUser);
        setLikesCount(res.data.likesCount); 
      })
      .catch(err => console.log(err));
    };


  return (
    <div className='posts-page'>

        <div className="single-post">

            <div className="user">
              <div className='postname'>{post.user_name}</div>
              <div className='postdate'>{formatDate(post.post_date)}</div>
            </div>

            <div className="poster">
              <img src={post.image_url} alt="" />                  
            </div>

            <div className="footer">
            {
              isLiked 
                ? <FavoriteIcon className="favoriteIcon" onClick={() => likeAPost(post.post_id, isLiked)} style={{ cursor: 'pointer' }} /> 
                : <FavoriteBorderIcon className="favoriteIcon" onClick={() => likeAPost(post.post_id, isLiked )} style={{ cursor: 'pointer' }} />
            }
            {likesCount}
            </div>

            <div className="comment-section">
              <form className='addcontent' onSubmit={handleCommentSubmit}>
                <div className='input-container'>
                  <input className="comment-input" name="comment" type="text" placeholder="Comment..." value={commentContent} onChange={handleCommentChange}></input>
                  <button type="button" className="emoji-button" onClick={toggleEmojiPicker}><span className="emoji-icon">😊</span></button>
                  {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} searchDisabled={false} lazyLoadEmojis={false}/>}
                  <button className="comment-submit" type='submit'><SendIcon className='sendicon'></SendIcon></button>
                </div>
                {errorMessage && <div className="error-message">{errorMessage}</div>} 
              </form>

              <div className='commentList'>
                {comment.map( c =>(
                    <div key={c.comment_id} className="comment-item">
                      <div className="user">{c.user_name}</div>
                      <div className='comment-content'>
                        <div className="content">{c.comment_content}</div>
                        <div className="date">{formatDate(c.comment_date)}</div>
                      </div>
                    </div>
                  ))}
              </div>           
            </div>
        </div>      
    </div>

  )
}

export default Post;
