import React, { useState } from 'react';
import {
  Card, CardHeader, CardMedia, CardContent, CardActions,
  Avatar, IconButton, Typography, Rating, Tooltip
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useNavigate } from 'react-router-dom';

type ReviewCardProps = {
  username: string;
  userImage: string;
  restaurantImage: string;
  content: string;
  rating: number;
};

const ReviewCard: React.FC<ReviewCardProps> = ({
  username,
  userImage,
  restaurantImage,
  content,
  rating,
}) => {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();

  const handleCommentsClick = () => {
    navigate('/post', {
      state: {
        post: { username, userImage, restaurantImage, content, rating },
      },
    });
  };

  return (
    <Card sx={{ maxWidth: 600, margin: '2rem auto' }}>
      <CardHeader
        avatar={<Avatar src={userImage} />}
        title={username}
        subheader={`Rating: ${rating} stars`}
      />
      <CardMedia
        component="img"
        height="200"
        image={restaurantImage}
        alt="Restaurant"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
        <Rating value={rating} precision={0.5} readOnly sx={{ mt: 1 }} />
      </CardContent>
      <CardActions disableSpacing>
        <Tooltip title="Like">
          <IconButton onClick={() => setLiked(!liked)} color={liked ? 'error' : 'default'}>
            <FavoriteIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Comments">
          <IconButton onClick={handleCommentsClick}>
            <ChatBubbleOutlineIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default ReviewCard;
