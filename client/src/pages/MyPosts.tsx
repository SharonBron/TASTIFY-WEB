import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Rating,
} from '@mui/material';
import { usePosts } from '../context/PostsContext';
import ReviewCard from '../components/ReviewCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AddReviewModal from '../components/AddReviewModal';
import axios from 'axios';

const POSTS_PER_PAGE = 5;

const MyPosts: React.FC = () => {
  const { posts, setPosts } = usePosts();
  const currentUserId = localStorage.getItem('userId');

  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/posts?userId=${currentUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const postsWithComments = await Promise.all(
          response.data.posts.map(async (post: any) => {
            const commentRes = await axios.get(`${process.env.REACT_APP_API_URL}/comments/post/${post._id}`);
            return {
              ...post,
              commentsCount: commentRes.data.length,
              likesCount: post.likes?.length || 0,
            };
          })
        );

        setPosts(postsWithComments);
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    if (currentUserId) {
      fetchUserPosts();
    }
  }, [currentUserId, setPosts]);

  const handleLike = async (postId: string) => {
    try {
      const token = localStorage.getItem('accessToken');
      await axios.post(`${process.env.REACT_APP_API_URL}/posts/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPosts(prev =>
        prev.map(post =>
          post._id === postId
            ? { ...post, likesCount: (post.likesCount || 0) + 1 }
            : post
        )
      );
    } catch (err) {
      console.error('Failed to like post:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.delete(`${process.env.REACT_APP_API_URL}/posts/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPosts(prev => prev.filter(post => post._id !== id));
      } catch (err) {
        console.error('Failed to delete post:', err);
      }
    }
  };

  const handleEdit = (post: any) => {
    setSelectedPost(post);
    setIsEditModalOpen(true);
  };

  const handleUpdate = (updatedData: {
    content: string;
    rating: number;
    imageUrl?: string;
    restaurantName: string;
    restaurantLocation: string;
  }) => {
    if (!selectedPost) return;

    setPosts(prev =>
      prev.map(post =>
        post._id === selectedPost._id
          ? {
              ...post,
              text: updatedData.content,
              rating: updatedData.rating,
              images: updatedData.imageUrl
                ? [updatedData.imageUrl.replace(process.env.REACT_APP_SERVER_URL || '', '')]
                : post.images,
              restaurantName: updatedData.restaurantName,
            }
          : post
      )
    );

    setIsEditModalOpen(false);
    setSelectedPost(null);
  };

  const filteredPosts = posts.filter(
    post =>
      post.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedRating === null || post.rating === selectedRating)
  );

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <Container sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>My Posts</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
          <Typography>Filter by Rating:</Typography>
          <Rating
            value={selectedRating}
            onChange={(_, newValue) => setSelectedRating(newValue)}
          />
          {selectedRating !== null && (
            <Button size="small" onClick={() => setSelectedRating(null)}>
              Clear
            </Button>
          )}
        </Box>

        {filteredPosts.length === 0 ? (
          <Typography>No posts found.</Typography>
        ) : (
          <>
            {filteredPosts.slice(0, visibleCount).map(post => {
              const restaurantImage = post.images?.[0]
                ? `${process.env.REACT_APP_SERVER_URL}${post.images[0]}`
                : '';
              const userImage = post.userId?.profileImage?.startsWith('/uploads')
                ? `${process.env.REACT_APP_SERVER_URL}${post.userId.profileImage}`
                : post.userId?.profileImage || '';

              return (
                <Box key={post._id} sx={{ position: 'relative', mb: 3 }}>
                  <ReviewCard
                    id={post._id}
                    username={post.userId?.username || 'Unknown'}
                    userImage={userImage}
                    restaurantImage={restaurantImage}
                    restaurantName={post.restaurantName}
                    restaurantLocation=""
                    content={post.text}
                    rating={post.rating}
                    likes={post.likesCount || 0}
                    commentsCount={post.commentsCount || 0}
                    onLike={() => handleLike(post._id)}
                  />
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 1 }}>
                    <Button variant="outlined" color="primary" onClick={() => handleEdit(post)}>Edit</Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(post._id)}>Delete</Button>
                  </Box>
                </Box>
              );
            })}

            {visibleCount < filteredPosts.length && (
              <Box textAlign="center" mt={3}>
                <Button variant="outlined" onClick={() => setVisibleCount(prev => prev + POSTS_PER_PAGE)}>
                  Load More
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>

      {selectedPost && (
        <AddReviewModal
          open={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedPost(null);
          }}
          onSubmit={handleUpdate}
          defaultValues={{
            content: selectedPost.text,
            rating: selectedPost.rating,
            imageUrl: selectedPost.images?.[0]
              ? `${process.env.REACT_APP_SERVER_URL}${selectedPost.images[0]}`
              : '',
            restaurantName: selectedPost.restaurantName,
            restaurantLocation: '',
          }}
        />
      )}

      <Footer />
    </>
  );
};

export default MyPosts;