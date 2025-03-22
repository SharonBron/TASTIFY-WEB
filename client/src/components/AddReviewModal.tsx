import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Rating,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    content: string;
    rating: number;
    image?: string;
    restaurantName: string;
    restaurantLocation: string;
  }) => void;
  defaultValues?: {
    content: string;
    rating: number;
    image?: string;
    restaurantName: string;
    restaurantLocation: string;
  };
};

const AddReviewModal: React.FC<Props> = ({ open, onClose, onSubmit, defaultValues }) => {
  const [content, setContent] = useState(defaultValues?.content || '');
  const [rating, setRating] = useState<number | null>(defaultValues?.rating || 0);
  const [image, setImage] = useState<string | null>(defaultValues?.image || null);
  const [restaurantName, setRestaurantName] = useState(defaultValues?.restaurantName || '');
  const [restaurantLocation, setRestaurantLocation] = useState(defaultValues?.restaurantLocation || '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePost = () => {
    onSubmit({
      content,
      rating: rating || 0,
      image: image || undefined,
      restaurantName,
      restaurantLocation,
    });
    setContent('');
    setRating(0);
    setImage(null);
    setRestaurantName('');
    setRestaurantLocation('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        maxWidth: 500,
        maxHeight: '90vh', // ✅ הגבלת גובה
        overflowY: 'auto', // ✅ גלילה בעת הצורך
        bgcolor: 'white',
        p: 2,
        mx: 'auto',
        mt: '5vh',
        borderRadius: 2,
        boxShadow: 24,
        position: 'relative',
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button onClick={handlePost}>Post</Button>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>

        <Typography variant="h6" sx={{ mt: 1, mb: 2 }}>Create a Review</Typography>

        <TextField
          label="Restaurant Name"
          fullWidth
          sx={{ mb: 2 }}
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
        />
        <TextField
          label="Restaurant Location"
          fullWidth
          sx={{ mb: 2 }}
          value={restaurantLocation}
          onChange={(e) => setRestaurantLocation(e.target.value)}
        />

        <TextField
          placeholder="Write your review..."
          multiline
          rows={4}
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
          />
          <label htmlFor="upload-photo">
            <input
              type="file"
              id="upload-photo"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
            <IconButton component="span" color="primary">
              <AddPhotoAlternateIcon />
            </IconButton>
          </label>
        </Box>

        {image && (
          <Box sx={{ mt: 2 }}>
            <img src={image} alt="Preview" style={{ maxWidth: '100%', borderRadius: 8 }} />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default AddReviewModal;
