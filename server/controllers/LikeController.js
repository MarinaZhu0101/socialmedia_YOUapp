const LikeModel = require("../models/LikeModel");

class LikeController{

    static toggleLike(req, res) {
        const userId = req.user.userId;
        const { postId, action } = req.body; 

        const updateLikesDetail = () => {
            LikeModel.getLikesByPostId(postId, (error, userIds) => {
                if (error) {
                    console.error("Error in getLikesByPostId:", error);
                    return res.status(500).send('Database query error.');
                }
                const isLikedByCurrentUser = userIds.map(id => id.toString()).includes(userId.toString());
                const likesCount = userIds.length;
                res.json({
                    message: action === 'like' ? 'Like added successfully.' : 'Like removed successfully.',
                    likes: userIds, 
                    isLikedByCurrentUser: isLikedByCurrentUser, 
                    likesCount: likesCount
                });
            });
        };

        if (action === 'like') {
            const likeData = { user_id: userId, post_id: postId };
            LikeModel.addLike(likeData, function(error, result) {
                if (error) {
                    return res.status(500).send('Database query error.');
                }
                updateLikesDetail();

            });
        }

        else if (action === 'unlike') {
            LikeModel.checkUserLike(userId, postId, (error, hasLiked) => {
                if (error) {
                    return res.status(500).send('Database query error.');
                }
                if (!hasLiked) {
                    return res.status(404).json({ message: 'Like not found.' });
                }
                LikeModel.removeLike(userId, postId, (error) => {
                    if (error) {
                        return res.status(500).send('Error removing like.');
                    }
                    updateLikesDetail();

                });
            });
        }

        else {
            return res.status(400).json({ message: 'Invalid action specified.' });
        }
    }


}

module.exports = LikeController;