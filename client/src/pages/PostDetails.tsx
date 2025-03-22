import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Avatar,
  TextField,
  Button,
  Divider,
  IconButton,
  Paper,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

type Comment = {
  id: number;
  user: string;
  text: string;
};

const COMMENTS_PER_PAGE = 3;

const PostDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state?.post;

  const currentUser = 'Yael Reifman';

  const [comments, setComments] = useState<Comment[]>([]);
  const [visibleCount, setVisibleCount] = useState(COMMENTS_PER_PAGE);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedText, setEditedText] = useState('');
  const [likes, setLikes] = useState(post?.likes ?? 0);
  const [liked, setLiked] = useState(false);

  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    const newCommentObj: Comment = {
      id: Date.now(),
      user: currentUser,
      text: newComment,
    };
    setComments([...comments, newCommentObj]);
    setNewComment('');
  };

  const handleDeleteComment = (id: number) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  const handleEditComment = (id: number, text: string) => {
    setEditingCommentId(id);
    setEditedText(text);
  };

  const handleSaveEdit = () => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === editingCommentId ? { ...comment, text: editedText } : comment
      )
    );
    setEditingCommentId(null);
    setEditedText('');
  };

  const toggleLike = () => {
    setLikes((prev: number) => (liked ? prev - 1 : prev + 1));
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton onClick={toggleLike}>
              <FavoriteIcon color={liked ? 'error' : 'disabled'} />
            </IconButton>
            <Typography variant="body2">{likes}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ChatBubbleOutlineIcon fontSize="small" />
            <Typography variant="body2">{comments.length}</Typography>
          </Box>
        </Box>

        <Typography variant="h6" gutterBottom>Comments</Typography>
        <Divider sx={{ mb: 2 }} />

        {comments.slice(0, visibleCount).map((comment) => (
          <Box key={comment.id} sx={{ mb: 2, p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
            <Typography variant="subtitle2">{comment.user}</Typography>
            {editingCommentId === comment.id ? (
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

            {comment.user === currentUser && editingCommentId !== comment.id && (
              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                <IconButton size="small" onClick={() => handleEditComment(comment.id, comment.text)}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeleteComment(comment.id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>
        ))}

        {/* Load more button */}
        {visibleCount < comments.length && (
          <Button
            onClick={() => setVisibleCount((prev) => prev + COMMENTS_PER_PAGE)}
            variant="text"
            sx={{ mb: 2 }}
          >
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
