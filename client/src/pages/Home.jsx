import React, { useState, useEffect} from "react";
import axios from 'axios';
import "../App.css";
import { useNavigate } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddCommentIcon from '@mui/icons-material/AddComment';


function Home() {
    const [data, setData] = useState([]);
    let navigate = useNavigate();


    useEffect(() => {
      const fetchPosts = async () => {
          try {
              const accessToken = sessionStorage.getItem("accessToken");
              const config = accessToken ? { headers: { 'Authorization': `Bearer ${accessToken}` } } : {};
              const response = await axios.get('https://you-app-tau.vercel.app/posts', config);
              
              const postsData = response.data.map(post => ({
                  ...post,
                  isLikedByCurrentUser: Boolean(post.isLikedByCurrentUser)
              }));
              setData(postsData);
              // console.log("Data received from backend:", postsData);
          } catch (err) {
              console.log(err);
          }
      };

      fetchPosts();
  }, []);

    const likeAPost = (postId, currentlyLiked) =>{    
      const accessToken = sessionStorage.getItem("accessToken"); 
        if (!accessToken) {
          alert('You must be logged in to like a post.');
          navigate("/login");
          return;
        }

        axios.post('https://you-app-tau.vercel.app/likes',{ 
          postId: postId,
          action: currentlyLiked ? 'unlike' : 'like'
        }, {
          headers: {
            'Authorization': `Bearer ${accessToken}`, 
          }
        })
        .then(res => {
          console.log(res.data.message);
          
          const newData = data.map(item => {
              if (item.post_id === postId) {
                return { ...item, isLikedByCurrentUser: res.data.isLikedByCurrentUser, likesCount: res.data.likes.length, likes:res.data.likes };
              }
              return item;
          });
          setData(newData);
        })
        .catch(err => console.log(err));
    };

    const navigateToComments = (postId) => {
      const accessToken = sessionStorage.getItem("accessToken");
      if (!accessToken) {
        alert('You must be logged in to comment.');
        navigate("/login");
        return;
      }
      navigate(`/post/${postId}`);
    };

    return(
        <div className="posts-page">
            {data.map((d, i)=>(
              <div 
                className="post" 
                key={i} 
              >
                <div className="user">{d.user_name}</div>
                <div className="poster" 
                  onClick={() => {
                  navigate(`/post/${d.post_id}`);
                }}>
                  <img src={d.image_url} alt="" />                  
                </div>
                <div className="footer">
                  <AddCommentIcon className="commentIcon" onClick={() => navigateToComments(d.post_id)}></AddCommentIcon>

                  {d.isLikedByCurrentUser
                    ? <FavoriteIcon className="favoriteIcon" onClick={() => likeAPost(d.post_id, d.isLikedByCurrentUser)} /> 
                    : <FavoriteBorderIcon className="favoriteIcon" onClick={() => likeAPost(d.post_id, d.isLikedByCurrentUser)} />}
                  {d.likesCount}
                  
                </div>
              </div>
            ))}        
        </div>  
          
    )
}

export default Home
