import React, { useState } from 'react';
import {
  Card, CardHeader, CardMedia, CardContent, CardActions,
  Avatar, IconButton, Typography, Rating, Tooltip
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { useNavigate } from 'react-router-dom';

export type ReviewCardProps = {
  id: string;
  username: string;
  userImage: string;
  restaurantImage?: string;
  restaurantName: string;
  restaurantLocation: string;
  content: string;
  rating: number;
  likes: number;
  commentsCount: number;
  onLike?: () => void; 
};

const ReviewCard: React.FC<ReviewCardProps> = ({
  id,
  username,
  userImage,
  restaurantImage,
  restaurantName,
  restaurantLocation,
  content,
  rating,
  likes,
  commentsCount,
  onLike,
  
}) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(likes || 0);
  const navigate = useNavigate();

  const handleLike = () => {
    setLikesCount(prev => liked ? prev - 1 : prev + 1);
    setLiked(!liked);
  };

  const handleCommentsClick = () => {
    navigate('/post', {
      state: {
        post: {
          _id: id,
          username,
          userImage,
          restaurantImage,
          restaurantName,
          restaurantLocation,
          content,
          rating,
          likes,
          commentsCount
        },
      },
    });
  };

  return (
    <Card sx={{ maxWidth: 600, margin: '2rem auto' }}>
      <CardHeader
        avatar={<Avatar src={userImage ?? ''} />}
        title={username}
        subheader={`${restaurantName} • ${restaurantLocation}`}
      />

      {restaurantImage && (
        <CardMedia
          component="img"
          height="200"
          image={restaurantImage}
          alt="Restaurant"
          onError={() => console.error('❌ Failed to load restaurant image:', restaurantImage)}
        />
      )}

      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {content}
        </Typography>
        <Rating value={rating} precision={0.5} readOnly sx={{ mt: 1 }} />
      </CardContent>

      <CardActions disableSpacing sx={{ px: 2 }}>
        <Tooltip title="Likes">
        <IconButton onClick={onLike ?? handleLike} color={liked ? 'error' : 'default'}>
  <FavoriteIcon />
</IconButton>
        </Tooltip>
        <Typography variant="body2" sx={{ mr: 2 }}>
          {likesCount}
        </Typography>

        <Tooltip title="Comments">
          <IconButton onClick={handleCommentsClick}>
            <ChatBubbleOutlineIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="body2">
          {commentsCount}
        </Typography>
      </CardActions>
    </Card>
  );
};

export default ReviewCard;
