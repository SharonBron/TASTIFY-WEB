import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Rating,
  Tooltip,
} from '@mui/material';
import { usePosts } from '../context/PostsContext';
import ReviewCard from '../components/ReviewCard';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AddReviewModal from '../components/AddReviewModal';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';


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

        const enrichedPosts = await Promise.all(
          response.data.posts.map(async (post: any) => {
            const [commentsRes, detailsRes] = await Promise.all([
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
              likedByMe: detailsRes.data.likedByMe,
              likes: detailsRes.data.likesCount,
              userId: detailsRes.data.post.userId, // כולל username ו-profileImage
            };
          })
        );

        setPosts(enrichedPosts);
      } catch (error) {
        console.error('❌ Error fetching user posts:', error);
      }
    };

    if (currentUserId) {
      fetchUserPosts();
    }
  }, [currentUserId, setPosts]);

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
        console.error('❌ Failed to delete post:', err);
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

      setPosts(prevPosts =>
        prevPosts.map(post =>
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
      alert('Failed to like the post.');
    }
  };

  const filteredPosts = posts.filter(
    post =>
      post.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedRating === null || post.rating === selectedRating)
  );

  return (
    <>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div style={{ minHeight: '100vh' }}>
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

              return (
                <Box key={post._id} sx={{ position: 'relative', mb: 3 }}>
                  <ReviewCard
                    id={post._id}
                    username={post.userId?.username || 'Unknown'}
                    userImage={
                      post.userId?.profileImage?.startsWith('/uploads')
                        ? `${process.env.REACT_APP_SERVER_URL}${post.userId.profileImage}`
                        : post.userId?.profileImage || ''
                    }
                    restaurantImage={restaurantImage}
                    restaurantName={post.restaurantName}
                    content={post.text}
                    rating={post.rating}
                    likes={Array.isArray(post.likes) ? post.likes.length : post.likes}
                    likedByMe={post.likedByMe || false}
                    commentsCount={post.commentsCount || 0}
                    onLike={() => handleLike(post._id)}
                  />
                <Box
  sx={{
    position: 'absolute',
    top: 8,
    right: 1,
    display: 'flex',
   // gap: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 2,
    p: 0.5,
  }}
>
  <Tooltip title="Edit">
    <IconButton size="small" onClick={() => handleEdit(post)}>
      <EditIcon fontSize="small" />
    </IconButton>
  </Tooltip>
  <Tooltip title="Delete">
    <IconButton size="small" onClick={() => handleDelete(post._id)}>
      <DeleteIcon fontSize="small" />
    </IconButton>
  </Tooltip>
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
          }}
        />
      )}
</div>
      <Footer />
    </>
  );
};

export default MyPosts;