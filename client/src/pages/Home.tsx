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
    restaurantLocation: string;
  }) => {
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('text', data.content);
      formData.append('rating', String(data.rating));
      formData.append('restaurantName', data.restaurantName);
      formData.append('restaurantLocation', data.restaurantLocation);

      if (data.imageUrl?.startsWith('blob:')) {
        const blob = await fetch(data.imageUrl).then(res => res.blob());
        formData.append('image', blob, 'image.jpg');
      }

      const res = await axios.post(`${process.env.REACT_APP_API_URL}/posts`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setPosts(prev => [res.data, ...prev]);
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

      <Container sx={{ mt: 4 }}>
        <Paper
          onClick={() => setOpenModal(true)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            cursor: 'pointer',
            borderRadius: 2,
            mb: 4,
          }}
        >
          <Typography color="text.secondary">Add your review</Typography>
          <IconButton>
            <AddPhotoAlternateIcon />
          </IconButton>
        </Paper>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography>Filter by rating:</Typography>
          <Rating
            value={minRating}
            onChange={(_, newValue) => setMinRating(newValue)}
          />
          <Button variant="text" onClick={() => setMinRating(null)}>Clear</Button>
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
              userImage={review.userId?.profileImage || ''}
              restaurantImage={restaurantImage}
              restaurantName={review.restaurantName}
              restaurantLocation=""
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
