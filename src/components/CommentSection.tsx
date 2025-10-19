import { useState, useEffect } from 'react';
import { FiThumbsUp, FiThumbsDown, FiMessageCircle, FiSend, FiUser, FiX } from 'react-icons/fi';

interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
    email: string;
  };
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  replies: Comment[];
  userVote?: 'up' | 'down' | null;
}

interface CommentSectionProps {
  articleId: string;
}

export default function CommentSection({ articleId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    // Check if user is logged in from localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        setIsLoggedIn(true);
        setCurrentUser(userData);
      } catch (e) {
        console.error('Failed to parse user data:', e);
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }

    // Load mock comments
    loadMockComments();
  }, [articleId]);

  const loadMockComments = () => {
    // Mock data - Replace with Appwrite database query
    const mockComments: Comment[] = [
      {
        id: '1',
        author: {
          name: 'Ali Usman',
          email: 'ali@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ali'
        },
        content: 'Labari mai ban sha\'awa sosai! Na koyi abubuwa da yawa game da wannan fasaha.',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        upvotes: 12,
        downvotes: 2,
        replies: [
          {
            id: '1-1',
            author: {
              name: 'Fatima Ahmad',
              email: 'fatima@example.com',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fatima'
            },
            content: 'Na yarda da kai Ali. Marubucin ya yi kyau sosai.',
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            upvotes: 5,
            downvotes: 0,
            replies: []
          }
        ]
      },
      {
        id: '2',
        author: {
          name: 'Ibrahim Sani',
          email: 'ibrahim@example.com',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ibrahim'
        },
        content: 'Ina so in san ƙarin bayani game da wannan. Za a iya samun ƙarin misalai?',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
        upvotes: 8,
        downvotes: 1,
        replies: []
      }
    ];

    setComments(mockComments);
  };

  const handleVote = (commentId: string, voteType: 'up' | 'down', isReply: boolean = false, parentId?: string) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    // TODO: Implement Appwrite vote logic
    setComments(prevComments => {
      return prevComments.map(comment => {
        if (comment.id === commentId && !isReply) {
          const currentVote = comment.userVote;
          let newUpvotes = comment.upvotes;
          let newDownvotes = comment.downvotes;
          let newUserVote: 'up' | 'down' | null = voteType;

          // Remove previous vote if exists
          if (currentVote === 'up') newUpvotes--;
          if (currentVote === 'down') newDownvotes--;

          // Add new vote or remove if clicking same vote
          if (currentVote === voteType) {
            newUserVote = null; // Remove vote
          } else {
            if (voteType === 'up') newUpvotes++;
            if (voteType === 'down') newDownvotes++;
          }

          return { ...comment, upvotes: newUpvotes, downvotes: newDownvotes, userVote: newUserVote };
        }
        
        // Handle reply votes
        if (isReply && comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies.map(reply => {
              if (reply.id === commentId) {
                const currentVote = reply.userVote;
                let newUpvotes = reply.upvotes;
                let newDownvotes = reply.downvotes;
                let newUserVote: 'up' | 'down' | null = voteType;

                if (currentVote === 'up') newUpvotes--;
                if (currentVote === 'down') newDownvotes--;

                if (currentVote === voteType) {
                  newUserVote = null;
                } else {
                  if (voteType === 'up') newUpvotes++;
                  if (voteType === 'down') newDownvotes++;
                }

                return { ...reply, upvotes: newUpvotes, downvotes: newDownvotes, userVote: newUserVote };
              }
              return reply;
            })
          };
        }

        return comment;
      });
    });
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    if (!newComment.trim()) return;

    // TODO: Implement Appwrite comment creation
    const comment: Comment = {
      id: Date.now().toString(),
      author: currentUser!,
      content: newComment,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      replies: [],
      userVote: null
    };

    setComments([comment, ...comments]);
    setNewComment('');
  };

  const handleSubmitReply = (parentId: string) => {
    if (!isLoggedIn) {
      setShowLoginPrompt(true);
      return;
    }

    if (!replyContent.trim()) return;

    // TODO: Implement Appwrite reply creation
    const reply: Comment = {
      id: `${parentId}-${Date.now()}`,
      author: currentUser!,
      content: replyContent,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      downvotes: 0,
      replies: [],
      userVote: null
    };

    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === parentId
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      )
    );

    setReplyContent('');
    setReplyingTo(null);
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - commentDate.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) return `${diffInMinutes} minti da suka wuce`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} awa da suka wuce`;
    return `${Math.floor(diffInMinutes / 1440)} kwana da suka wuce`;
  };

  const CommentItem = ({ comment, isReply = false, parentId }: { comment: Comment; isReply?: boolean; parentId?: string }) => (
    <div className={`${isReply ? 'ml-8 md:ml-12' : ''} mb-6`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        {/* Comment Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            {comment.author.avatar ? (
              <img
                src={comment.author.avatar}
                alt={comment.author.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <FiUser className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {comment.author.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatTimeAgo(comment.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Comment Content */}
        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
          {comment.content}
        </p>

        {/* Comment Actions */}
        <div className="flex items-center space-x-4">
          {/* Upvote */}
          <button
            onClick={() => handleVote(comment.id, 'up', isReply, parentId)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors ${
              comment.userVote === 'up'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            <FiThumbsUp className="w-4 h-4" />
            <span className="text-sm font-medium">{comment.upvotes}</span>
          </button>

          {/* Downvote */}
          <button
            onClick={() => handleVote(comment.id, 'down', isReply, parentId)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-colors ${
              comment.userVote === 'down'
                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
          >
            <FiThumbsDown className="w-4 h-4" />
            <span className="text-sm font-medium">{comment.downvotes}</span>
          </button>

          {/* Reply Button */}
          {!isReply && (
            <button
              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
            >
              <FiMessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">Amsa</span>
            </button>
          )}
        </div>

        {/* Reply Form */}
        {replyingTo === comment.id && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <form onSubmit={(e) => { e.preventDefault(); handleSubmitReply(comment.id); }}>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Rubuta amsarka..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex items-center justify-end space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => { setReplyingTo(null); setReplyContent(''); }}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  Soke
                </button>
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <FiSend className="w-4 h-4" />
                  <span>Aika</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Replies */}
      {comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map(reply => (
            <CommentItem key={reply.id} comment={reply} isReply={true} parentId={comment.id} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <section className="mt-12 pt-12 border-t border-gray-200 dark:border-gray-800">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Sharhi ({comments.reduce((acc, c) => acc + 1 + c.replies.length, 0)})
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Raba ra'ayinka game da wannan labari
        </p>
      </div>

      {/* Login Prompt Modal */}
      {showLoginPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                Ana Buƙatar Shiga
              </h3>
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Ka shiga don yin sharhi, ba da ƙuri'a, ko amsawa.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowLoginPrompt(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Soke
              </button>
              <a
                href="/user-login"
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-center"
              >
                Shiga Yanzu
              </a>
            </div>
          </div>
        </div>
      )}

      {/* New Comment Form */}
      <div className="mb-8">
        {isLoggedIn ? (
          <form onSubmit={handleSubmitComment} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start space-x-3 mb-3">
              {currentUser?.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-white" />
                </div>
              )}
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Rubuta sharhinka..."
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
              >
                <FiSend className="w-4 h-4" />
                <span>Aika Sharhi</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 text-center">
            <FiMessageCircle className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Ka shiga don yin sharhi akan wannan labari
            </p>
            <a
              href="/user-login"
              className="inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Shiga Yanzu
            </a>
          </div>
        )}
      </div>

      {/* Comments List */}
      <div>
        {comments.length > 0 ? (
          comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        ) : (
          <div className="text-center py-12">
            <FiMessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Babu sharhi tukuna. Ka zama na farko!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
