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
  Rating,
} from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const POSTS_PER_PAGE = 5;

const Home: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [searchTerm, setSearchTerm] = useState('');
  const [minRating, setMinRating] = useState<number | null>(null);

  const handlePostReview = (data: {
    content: string;
    rating: number;
    image?: string;
    restaurantName: string;
    restaurantLocation: string;
  }) => {
    const newReview = {
      id: Date.now(),
      username: 'Current User',
      userImage: 'https://randomuser.me/api/portraits/lego/1.jpg',
      restaurantImage: data.image || '',
      content: data.content,
      rating: data.rating,
      restaurantName: data.restaurantName,
      restaurantLocation: data.restaurantLocation,
      likes: 0,
      comments: [],
    };
    setReviews([newReview, ...reviews]);
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.restaurantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = minRating ? review.rating >= minRating : true;
    return matchesSearch && matchesRating;
  });

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

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
          <Typography color="text.secondary">Add your review</Typography>
          <IconButton>
            <AddPhotoAlternateIcon />
          </IconButton>
        </Paper>

        {/* Rating Filter */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Typography>Filter by rating:</Typography>
          <Rating
            value={minRating}
            onChange={(_, newValue) => setMinRating(newValue)}
          />
          <Button variant="text" onClick={() => setMinRating(null)}>Clear</Button>
        </Box>

        {/* Display visible filtered posts only */}
        {filteredReviews.slice(0, visibleCount).map((review, index) => (
          <ReviewCard
            key={review.id}
            id={review.id}
            username={review.username}
            userImage={review.userImage}
            restaurantImage={review.restaurantImage}
            restaurantName={review.restaurantName}
            restaurantLocation={review.restaurantLocation}
            content={review.content}
            rating={review.rating}
            likes={review.likes}
            commentsCount={review.comments.length}
          />
        ))}

        {/* Load more button */}
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