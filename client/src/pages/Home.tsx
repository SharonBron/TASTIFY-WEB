import React, { useState } from 'react';
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
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const POSTS_PER_PAGE = 5;

const Home: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const handlePostReview = (data: { content: string; rating: number; image?: string }) => {
    const newReview = {
      username: 'Current User',
      userImage: 'https://randomuser.me/api/portraits/lego/1.jpg',
      restaurantImage: data.image || '',
      content: data.content,
      rating: data.rating,
    };
    setReviews([newReview, ...reviews]);
  };

  return (
    <>
      <Navbar />

      <Container sx={{ mt: 4 }}>
        {/* Mini "post" box */}
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
          <Typography color="text.secondary">What's on your mind?</Typography>
          <IconButton>
            <AddPhotoAlternateIcon />
          </IconButton>
        </Paper>

        {/* Display visible posts only */}
        {reviews.slice(0, visibleCount).map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}

        {/* Load more button */}
        {visibleCount < reviews.length && (
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
