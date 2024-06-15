const LikeModel = require("../models/LikeModel");

class LikeController{

    static async toggleLike(req, res) {
        const userId = req.user.userId;
        const { postId, action } = req.body; 

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated.' });
        }

        const updateLikesDetail = async () => {
            try {
                const userIds = await LikeModel.getLikesByPostId(postId);
                const isLikedByCurrentUser = userIds.map(id => id.toString()).includes(userId.toString());
                const likesCount = userIds.length;
                res.json({
                    message: action === 'like' ? 'Like added successfully.' : 'Like removed successfully.',
                    likes: userIds,
                    isLikedByCurrentUser,
                    likesCount
                });
            } catch (error) {
                console.error("Error in getLikesByPostId:", error);
                res.status(500).send('Database query error.');
            }
        };

        try {
            if (action === 'like') {
                const likeData = { user_id: userId, post_id: postId };
                const result = await LikeModel.addLike(likeData);
                if (result.alreadyLiked) {
                    return res.status(400).json(result);
                }
                updateLikesDetail();
            } else if (action === 'unlike') {
                const hasLiked = await LikeModel.checkUserLike(userId, postId);
                if (!hasLiked) {
                    return res.status(404).json({ message: 'Like not found.' });
                }
                await LikeModel.removeLike(userId, postId);
                updateLikesDetail();
            } else {
                return res.status(400).json({ message: 'Invalid action specified.' });
            }
        } catch (error) {
            console.error("Database query error:", error);
            res.status(500).send('Database query error.');
        }
    }

}

module.exports = LikeController;