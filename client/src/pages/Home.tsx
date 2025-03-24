import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReviewCard from '../components/ReviewCard';
import AddReviewModal from '../components/AddReviewModal';
import {
  Box,
  Container,
  Paper,
  Typography,
  IconButton,
  Button,
  Rating,
  Avatar,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from 'axios';
import { usePosts } from '../context/PostsContext';

const POSTS_PER_PAGE = 5;

const Home: React.FC = () => {
  const { posts, setPosts } = usePosts();
  const [openModal, setOpenModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [searchTerm, setSearchTerm] = useState('');
  const [minRating, setMinRating] = useState<number | null>(null);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const postsWithExtras = await Promise.all(
          res.data.posts.map(async (post: any) => {
            const [commentsRes, postDetails] = await Promise.all([
              axios.get(`${process.env.REACT_APP_API_URL}/comments/post/${post._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
              axios.get(`${process.env.REACT_APP_API_URL}/posts/${post._id}`, {
                headers: { Authorization: `Bearer ${token}` },
              }),
            ]);

            return {
              ...post,
              commentsCount: commentsRes.data.length,
              likedByMe: postDetails.data.likedByMe,
              likes: postDetails.data.likesCount,
              userId: postDetails.data.post.userId, // כולל username + profileImage
            };
          })
        );

        setPosts(postsWithExtras);
      } catch (err) {
        console.error('❌ Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, [setPosts, currentUserId]);

  const handlePostReview = async (data: {
    content: string;
    rating: number;
    imageUrl?: string;
    restaurantName: string;
  }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('text', data.content);
      formData.append('rating', String(data.rating));
      formData.append('restaurantName', data.restaurantName);

      if (data.imageUrl?.startsWith('blob:')) {
        const blob = await fetch(data.imageUrl).then(res => res.blob());
        formData.append('image', blob, 'image.jpg');
      }

      const createRes = await axios.post(
        `${process.env.REACT_APP_API_URL}/posts`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const newPostId = createRes.data._id;

      const fullPostRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/posts/${newPostId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const enrichedPost = {
        ...fullPostRes.data.post,
        likes: fullPostRes.data.likesCount,
        likedByMe: fullPostRes.data.likedByMe,
        commentsCount: fullPostRes.data.commentsCount,
      };

      setPosts(prev => [enrichedPost, ...prev]);
      setOpenModal(false);
    } catch (err) {
      console.error('❌ Error creating post:', err);
      alert('Failed to create post');
    }
  };

  const handleLike = async (postId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.put(
        `${process.env.REACT_APP_API_URL}/posts/${postId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts(prev =>
        prev.map(post =>
          post._id === postId
            ? {
                ...post,
                likes: res.data.totalLikes,
                likedByMe: res.data.liked,
              }
            : post
        )
      );
    } catch (err) {
      console.error('❌ Failed to toggle like:', err);
      alert('Failed to toggle like. Please try again.');
    }
  };

  const filteredReviews = posts.filter(review => {
    const matchesSearch = review.restaurantName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = minRating !== null ? review.rating === minRating : true;
    return matchesSearch && matchesRating;
  });

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    <div style={{ minHeight: '100vh' }}>
      <Container sx={{ mt: 4}}>
    {/* כפתור הוספת ביקורת - קטן, ממורכז, בצבע שונה */}
<Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
  <Paper
    onClick={() => setOpenModal(true)}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      px: 2,
      py: 1,
      cursor: 'pointer',
      borderRadius: 50,
      backgroundColor: '#e0f7fa', // תכלת רך
      color: 'primary.main',
      boxShadow: 1,
      transition: '0.2s',
      '&:hover': {
        backgroundColor: '#b2ebf2',
      },
    }}
  >
    <AddPhotoAlternateIcon fontSize="small" />
    <Typography variant="body2" fontWeight={500}>
      Add your review
    </Typography>
  </Paper>
</Box>

{/* פילטר דירוג - קומפקטי, ממורכז, בגוון עדין */}
<Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
  <Paper
    elevation={0}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      px: 2,
      py: 1,
      borderRadius: 50,
      bgcolor: '#f3f3f3',
    }}
  >
    <Typography variant="body2">Filter by rating:</Typography>
    <Rating
      value={minRating}
      size="small"
      onChange={(_, newValue) => setMinRating(newValue)}
    />
    {minRating !== null && (
      <Button
        size="small"
        variant="text"
        color="error"
        onClick={() => setMinRating(null)}
      >
        Clear
      </Button>
    )}
  </Paper>
</Box>


        {filteredReviews.slice(0, visibleCount).map((review) => {
          const restaurantImage = review.images?.[0]
            ? `${process.env.REACT_APP_SERVER_URL}${review.images[0]}`
            : '';

          return (
            <ReviewCard
              key={review._id}
              id={review._id}
              username={review.userId?.username || 'Unknown'}
              userImage={
              review.userId?.profileImage?.startsWith('/uploads')
              ? `${process.env.REACT_APP_SERVER_URL}${review.userId.profileImage}`
              : review.userId?.profileImage || ''
              }
              restaurantImage={restaurantImage}
              restaurantName={review.restaurantName}
              content={review.text}
              rating={review.rating}
              likes={Array.isArray(review.likes) ? review.likes.length : review.likes}
              likedByMe={review.likedByMe || false}
              commentsCount={review.commentsCount || 0}
              onLike={() => handleLike(review._id)}
            />
          );
        })}

        {visibleCount < filteredReviews.length && (
          <Box textAlign="center" mt={3}>
            <Button variant="outlined" onClick={() => setVisibleCount(prev => prev + POSTS_PER_PAGE)}>
              Load More
            </Button>
          </Box>
        )}
      </Container>
      </div>
      <Footer />
    
      <AddReviewModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handlePostReview}
      />
    </>
  );
};

export default Home;
