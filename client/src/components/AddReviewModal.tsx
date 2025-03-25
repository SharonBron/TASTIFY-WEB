import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  IconButton,
  Button,
  Rating,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import axios from 'axios';

const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    content: string;
    rating: number;
    imageUrl?: string;
    restaurantName: string;
  }) => void;
  defaultValues?: {
    content: string;
    rating: number;
    imageUrl?: string;
    restaurantName: string;
  };
};

const AddReviewModal: React.FC<Props> = ({ open, onClose, onSubmit, defaultValues }) => {
  const [content, setContent] = useState(defaultValues?.content || '');
  const [rating, setRating] = useState<number | null>(defaultValues?.rating || null);
  const [imageUrl, setImageUrl] = useState<string | null>(defaultValues?.imageUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [restaurantName, setRestaurantName] = useState(defaultValues?.restaurantName || '');
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const [ratingError, setRatingError] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
    }
  };

  const handlePost = () => {
    if (!rating || rating < 1) {
      setRatingError(true);
      return;
    }

    onSubmit({
      content,
      rating,
      imageUrl: imageUrl || '',
      restaurantName,
    });

    // ניקוי
    setContent('');
    setRating(null);
    setImageUrl(null);
    setSelectedFile(null);
    setRestaurantName('');
    setRatingError(false);
    onClose();
  };

  const handleAutoSuggest = async () => {
    setLoadingSuggestion(true);
    try {
      const prompt = `תן לי ביקורת מסעדה קצרה ומושקעת על מסעדה בשם ${restaurantName || 'כלשהי'} בדירוג של ${rating || '5'} כוכבים.`;

      const response = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        {
          contents: [{ parts: [{ text: prompt }] }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          params: {
            key: GEMINI_API_KEY,
          },
        }
      );

      const suggestion = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      setContent(suggestion);
    } catch (error) {
      console.error('שגיאה בקבלת טקסט מוצע:', error);
      alert('אירעה שגיאה בעת יצירת ביקורת מוצעת.');
    } finally {
      setLoadingSuggestion(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        maxWidth: 500,
        maxHeight: '90vh',
        overflowY: 'auto',
        bgcolor: 'white',
        p: 3,
        mx: 'auto',
        mt: '5vh',
        borderRadius: 3,
        boxShadow: 24,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* סגירה */}
        <IconButton
          onClick={onClose}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" sx={{ mb: 3 }}>Create a Review</Typography>

        <TextField
          label="Restaurant Name"
          fullWidth
          sx={{ mb: 2 }}
          value={restaurantName}
          onChange={(e) => setRestaurantName(e.target.value)}
        />

        <TextField
          placeholder="Write your review..."
          multiline
          rows={4}
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

<Box sx={{ mt: 3 }}>
  <Typography variant="subtitle1" align="center" sx={{ mb: 1 }}>
    Rate this restaurant
  </Typography>

  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
    <Rating
      value={rating}
      onChange={(_, newValue) => {
        setRating(newValue);
        if (newValue) setRatingError(false);
      }}
    />
  </Box>

  {ratingError && (
    <Typography color="error" fontSize="0.875rem" align="center" sx={{ mt: 1 }}>
      Please provide a rating.
    </Typography>
  )}

  {/* כפתור העלאת תמונה - רחב */}
  <label htmlFor="upload-photo">
    <input
      type="file"
      id="upload-photo"
      accept="image/*"
      hidden
      onChange={handleImageChange}
    />
    <Button
      component="span"
      variant="outlined"
      color="primary"
      startIcon={<AddPhotoAlternateIcon />}
      fullWidth
      sx={{ mt: 2 }}
    >
      Upload Image
    </Button>
  </label>
</Box>
        {imageUrl && (
          <Box sx={{ mt: 2 }}>
            <img src={imageUrl} alt="Preview" style={{ maxWidth: '100%', borderRadius: 8 }} />
          </Box>
        )}

        <Button
          onClick={handleAutoSuggest}
          variant="outlined"
          color="secondary"
          sx={{ mt: 3 }}
          disabled={loadingSuggestion}
        >
          {loadingSuggestion ? <CircularProgress size={20} /> : 'רוצה שנציע ניסוח אוטומטי?'}
        </Button>

        {/* כפתור Post למטה */}
        <Button
          onClick={handlePost}
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 4 }}
        >
          Post
        </Button>
      </Box>
    </Modal>
  );
};

export default AddReviewModal;
