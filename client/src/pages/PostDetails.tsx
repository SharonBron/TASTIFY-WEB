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

  const [comments, setComments] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PER_PAGE);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');
  const [likes, setLikes] = useState(post?.likes ?? 0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      if (!post?._id) return;
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/comments/post/${post._id}`);
        setComments(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch comments:', err);
      }
    };

    fetchComments();
  }, [post?._id]);

  const handleAddComment = async () => {
    if (!newComment.trim() || !post?._id) {
      console.warn('⚠️ Cannot send empty comment or missing postId');
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/comments`,
        {
          postId: post._id,
          text: newComment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setComments(prev => [res.data, ...prev]);
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
      setComments(prev => prev.filter(c => c._id !== id));
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
      const res = await axios.put(`${process.env.REACT_APP_API_URL}/comments/${editingCommentId}`, {
        text: editedText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setComments(prev => prev.map(c => c._id === editingCommentId ? res.data : c));
      setEditingCommentId(null);
      setEditedText('');
    } catch (err) {
      console.error('❌ Failed to edit comment:', err);
    }
  };

  const toggleLike = () => {
    setLikes((prev: number) => liked ? prev - 1 : prev + 1);
    setLiked(!liked);
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
            <Avatar src={post.userImage} />
            <Typography variant="h6">{post.username}</Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            {post.restaurantImage && (
              <img src={post.restaurantImage} alt="Post" style={{ maxWidth: '100%', borderRadius: 8 }} />
            )}
            <Typography sx={{ mt: 2 }}>{post.content}</Typography>
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

        {comments.slice(0, visibleCount).map(comment => (
          <Box key={comment._id} sx={{ mb: 2, p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar src={comment.userId?.profileImage} />
              <Typography variant="subtitle2">{comment.userId?.username}</Typography>
            </Box>

            {editingCommentId === comment._id ? (
              <>
                <TextField
                  fullWidth
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  sx={{ mt: 1, mb: 1 }}
                />
                <Button onClick={handleSaveEdit} size="small">Save</Button>
              </>
            ) : (
              <Typography variant="body2" sx={{ mt: 1 }}>{comment.text}</Typography>
            )}

            {comment.userId?._id === userId && editingCommentId !== comment._id && (
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <IconButton size="small" onClick={() => handleEditComment(comment._id, comment.text)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeleteComment(comment._id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        ))}

        {visibleCount < comments.length && (
          <Button onClick={() => setVisibleCount(prev => prev + COMMENTS_PER_PAGE)} variant="text" sx={{ mb: 2 }}>
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
