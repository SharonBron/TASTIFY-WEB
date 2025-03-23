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
    restaurantLocation: string;
  }) => void;
  defaultValues?: {
    content: string;
    rating: number;
    imageUrl?: string;
    restaurantName: string;
    restaurantLocation: string;
  };
};

const AddReviewModal: React.FC<Props> = ({ open, onClose, onSubmit, defaultValues }) => {
  const [content, setContent] = useState(defaultValues?.content || '');
  const [rating, setRating] = useState<number | null>(defaultValues?.rating || 0);
  const [imageUrl, setImageUrl] = useState<string | null>(defaultValues?.imageUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [restaurantName, setRestaurantName] = useState(defaultValues?.restaurantName || '');
  const [restaurantLocation, setRestaurantLocation] = useState(defaultValues?.restaurantLocation || '');
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
    }
  };

  const handlePost = () => {
    onSubmit({
      content,
      rating: rating || 0,
      imageUrl: imageUrl || undefined, // זאת תמונת preview - בפועל בשרת תטפלי בקובץ
      restaurantName,
      restaurantLocation,
    });

    // ניקוי
    setContent('');
    setRating(0);
    setImageUrl(null);
    setSelectedFile(null);
    setRestaurantName('');
    setRestaurantLocation('');
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
          {loadingSuggestion ? <CircularProgress size={20} /> : 'רוצה שנציע לך ניסוח אוטומטי?'}
        </Button>
      </Box>
    </Modal>
  );
};

export default AddReviewModal;
