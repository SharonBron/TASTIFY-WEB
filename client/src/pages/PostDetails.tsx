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
  Paper
} from '@mui/material';

type Comment = {
  user: string;
  text: string;
};

const PostDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const post = location.state?.post;

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim() === '') return;
    setComments([...comments, { user: 'Current User', text: newComment }]);
    setNewComment('');
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
    <Container sx={{ mt: 4 }}>
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

      <Typography variant="h6" gutterBottom>Comments</Typography>
      <Divider sx={{ mb: 2 }} />

      {comments.map((comment, index) => (
        <Box key={index} sx={{ mb: 2, p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
          <Typography variant="subtitle2">{comment.user}</Typography>
          <Typography variant="body2">{comment.text}</Typography>
        </Box>
      ))}

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
  );
};

export default PostDetails;
