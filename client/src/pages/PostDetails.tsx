import React, { useEffect, useState } from 'react';
import {
  Box, Container, Typography, Avatar, TextField, Button, Divider,
  IconButton, Paper
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';
import Rating from '@mui/material/Rating';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const COMMENTS_PER_PAGE = 3;

const PostDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state?.post;
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('accessToken');

  const fullUserImage = post?.userImage?.startsWith('/uploads')
    ? `${process.env.REACT_APP_SERVER_URL}${post.userImage}`
    : post?.userImage;

  const [comments, setComments] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PER_PAGE);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');
  const [likes, setLikes] = useState<number>(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchPostDetails = async () => {
      if (!post?._id) return;
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/posts/${post._id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLikes(res.data.likesCount);
        setLiked(res.data.likedByMe);
      } catch (err) {
        console.error('❌ Failed to fetch post details:', err);
      }
    };

    const fetchComments = async () => {
      if (!post?._id) return;
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/comments/post/${post._id}`);
        setComments(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch comments:', err);
      }
    };

    fetchPostDetails();
    fetchComments();
  }, [post?._id, token]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !post?._id) return;

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/comments`,
        { postId: post._id, text: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const createdComment = {
        ...res.data,
        userId: {
          _id: userId,
          username: localStorage.getItem('username') || 'You',
          profileImage: localStorage.getItem('profileImage') || '',
        },
      };

      setComments((prev) => [createdComment, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error('❌ Failed to post comment:', err);
      alert('Failed to post comment');
    }
  };

  const handleDeleteComment = async (id: string) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.error('❌ Failed to delete comment:', err);
    }
  };

  const handleEditComment = (id: string, text: string) => {
    setEditingCommentId(id);
    setEditedText(text);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/comments/${editingCommentId}`,
        { text: editedText },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setComments((prev) =>
        prev.map((c) => (c._id === editingCommentId ? { ...c, text: editedText } : c))
      );

      setEditingCommentId(null);
      setEditedText('');
    } catch (err) {
      console.error('❌ Failed to edit comment:', err);
    }
  };

  const toggleLike = async () => {
    if (!post?._id) return;

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/posts/${post._id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setLikes(res.data.totalLikes);
      setLiked(res.data.liked);
    } catch (err) {
      console.error('❌ Failed to toggle like:', err);
      alert('Failed to like the post');
    }
  };

  if (!post) {
    return (
      <Container>
        <Typography variant="h6" mt={4}>Post not found</Typography>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </Container>
    );
  }

  return (
    <>
      <Navbar />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, mr: 2 }}>
        <IconButton onClick={() => navigate('/home')}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Container sx={{ mt: 2 }}>
        <Paper sx={{ p: 3, borderRadius: 2, mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={fullUserImage ?? ''} />
            <Typography variant="h6">{post.username}</Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            {post.restaurantImage && (
              <img src={post.restaurantImage} alt="Post" style={{ maxWidth: '100%', borderRadius: 8 }} />
            )}
            <Typography sx={{ mt: 2 }}>{post.content}</Typography>

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1">
                <strong>Restaurant:</strong> {post.restaurantName || 'N/A'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                <Typography variant="subtitle2">Rating:</Typography>
                <Rating value={post.rating || 0} precision={0.5} readOnly />
              </Box>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton onClick={toggleLike}>
            <FavoriteIcon color={liked ? 'error' : 'disabled'} />
          </IconButton>
          <Typography variant="body2">{likes}</Typography>

          <ChatBubbleOutlineIcon fontSize="small" />
          <Typography variant="body2">{comments.length}</Typography>
        </Box>

        <Typography variant="h6" gutterBottom>Comments</Typography>
        <Divider sx={{ mb: 2 }} />

        {comments.slice(0, visibleCount).map((comment) => {
          const commenterImage = comment.userId?.profileImage?.startsWith('/uploads')
            ? `${process.env.REACT_APP_SERVER_URL}${comment.userId.profileImage}`
            : comment.userId?.profileImage || '';

          return (
            <Box key={comment._id} sx={{ mb: 2, p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar src={commenterImage} />
                <Typography variant="subtitle2">{comment.userId?.username}</Typography>
              </Box>
              <Box sx={{ mt: 1 }}>
                {editingCommentId === comment._id ? (
                  <>
                    <TextField
                      fullWidth
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      sx={{ mb: 1 }}
                    />
                    <Button onClick={handleSaveEdit} size="small">Save</Button>
                  </>
                ) : (
                  <>
                    <Typography variant="body2">{comment.text}</Typography>
                    {comment.userId?._id === userId && (
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <IconButton size="small" onClick={() => handleEditComment(comment._id, comment.text)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDeleteComment(comment._id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            </Box>
          );
        })}

        {visibleCount < comments.length && (
          <Button onClick={() => setVisibleCount((prev) => prev + COMMENTS_PER_PAGE)} variant="text" sx={{ mb: 2 }}>
            Load more comments
          </Button>
        )}

        <TextField
          fullWidth
          label="Add a comment..."
          variant="outlined"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          multiline
          rows={2}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleAddComment}>Post Comment</Button>
      </Container>

      <Footer />
    </>
  );
};

export default PostDetails;