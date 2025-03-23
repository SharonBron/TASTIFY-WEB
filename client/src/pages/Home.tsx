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



  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(res.data.posts);
      } catch (err) {
        console.error('❌ Error fetching posts:', err);
      }
    };

    fetchPosts();
  }, [setPosts]);

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
  

  const filteredReviews = posts.filter(review => {
    const matchesSearch = review.restaurantName.toLowerCase().includes(searchTerm.toLowerCase());
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

        {filteredReviews.slice(0, visibleCount).map((review) => (
          <ReviewCard
            key={review._id}
            id={review._id}
            username={review.userId.username}
            userImage={review.userId.profileImage}
            restaurantImage={
              review.images?.[0]
                ? `${process.env.REACT_APP_SERVER_URL}${review.images[0]}`
                : undefined
            }
            restaurantName={review.restaurantName}
            restaurantLocation=""
            content={review.text}
            rating={review.rating}
            likes={review.likes.length}
            commentsCount={0}
          />
        ))}

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
