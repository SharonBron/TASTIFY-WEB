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
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const Home: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);

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

        {reviews.map((review, index) => (
          <ReviewCard key={index} {...review} />
        ))}
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
