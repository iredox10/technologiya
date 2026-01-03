import { useState, useEffect } from 'react';
import { 
  FiSearch, 
  FiUser, 
  FiMail, 
  FiCalendar, 
  FiMessageSquare,
  FiEdit,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
  FiEye
} from 'react-icons/fi';
import { userService } from '../../lib/appwriteServices';
import type { User } from '../../types';

interface UserWithStats extends User {
  commentsCount?: number;
  lastActivity?: string;
}

// Helper components for the list
const RoleBadge = ({ role }: { role?: string }) => {
  const styles = {
    admin: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
    author: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
    user: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
  };
  const labels = { admin: 'Admin', author: 'Marubucin', user: 'Mai Amfani' };
  
  return (
    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${styles[role as keyof typeof styles] || styles.user}`}>
      {labels[role as keyof typeof labels] || 'Mai Amfani'}
    </span>
  );
};

const UserActions = ({ onView, onDelete }: { onView: () => void, onDelete: () => void }) => (
  <div className="flex items-center gap-1">
    <button
      onClick={onView}
      className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
      title="Duba"
    >
      <FiEye className="w-4 h-4" />
    </button>
    <button
      onClick={onDelete}
      className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
      title="Share"
    >
      <FiTrash2 className="w-4 h-4" />
    </button>
  </div>
);

export default function UsersManager() {
  const [users, setUsers] = useState<UserWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  
  const usersPerPage = 10;
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  useEffect(() => {
    loadUsers();
  }, [currentPage]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const result = await userService.getUsers(currentPage, usersPerPage);
      
      if (result.success && result.data) {
        const usersData = result.data.documents as unknown as User[];
        
        // Enrich users with activity stats
        const enrichedUsers = await Promise.all(
          usersData.map(async (user) => {
            const statsResult = await userService.getUserStats(user.$id);
            return {
              ...user,
              commentsCount: statsResult.success ? statsResult.data?.commentsCount : 0,
              lastActivity: user.$updatedAt
            };
          })
        );
        
        setUsers(enrichedUsers);
        setTotalUsers(result.data.total || 0);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      loadUsers();
      return;
    }

    setLoading(true);
    try {
      const result = await userService.searchUsers(searchTerm, 1, usersPerPage);
      
      if (result.success && result.data) {
        const usersData = result.data.documents as unknown as User[];
        setUsers(usersData);
        setTotalUsers(result.data.total || 0);
        setCurrentPage(1);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user: UserWithStats) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Shin kana tabbatar kana son share wannan mai amfani?')) {
      return;
    }

    try {
      const result = await userService.deleteUser(userId);
      
      if (result.success) {
        loadUsers();
        alert('An share mai amfani cikin nasara!');
      } else {
        alert('Kuskure wajen share mai amfani: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An sami kuskure wajen share mai amfani');
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Ba a sani ba';
    const date = new Date(dateString);
    return date.toLocaleDateString('ha', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Ba a sani ba';
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Yau';
    if (diffInDays === 1) return 'Jiya';
    if (diffInDays < 7) return `${diffInDays} kwanaki da suka wuce`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} mako da suka wuce`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} wata da suka wuce`;
    return `${Math.floor(diffInDays / 365)} shekara da suka wuce`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Masu Amfani
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Sarrafa masu amfani da ayyukansu
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nemo mai amfani..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </form>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Jimlar Masu Amfani</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">{totalUsers}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <FiUser className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Jimlar Sharhi</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {users.reduce((acc, u) => acc + (u.commentsCount || 0), 0)}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <FiMessageSquare className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table/List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <FiUser className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">Babu masu amfani</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Ba a sami wani mai amfani da ya dace da neman ka ba' : 'Har yanzu babu masu amfani a cikin tsarin'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mai Amfani</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Matsayi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sharhi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aiki Na Karshe</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ayyuka</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user) => (
                    <tr key={user.$id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">{user.name?.charAt(0).toUpperCase()}</div>
                          )}
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <RoleBadge role={user.role} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1.5">
                          <FiMessageSquare className="h-4 w-4" />
                          {user.commentsCount || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {getTimeAgo(user.lastActivity)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <UserActions onView={() => handleViewUser(user)} onDelete={() => handleDeleteUser(user.$id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <div key={user.$id} className="p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="h-10 w-10 rounded-full object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">{user.name?.charAt(0).toUpperCase()}</div>
                      )}
                      <div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">{user.email}</div>
                      </div>
                    </div>
                    <RoleBadge role={user.role} />
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <FiMessageSquare className="h-3 w-3" />
                        {user.commentsCount || 0}
                      </span>
                      <span>{getTimeAgo(user.lastActivity)}</span>
                    </div>
                    <UserActions onView={() => handleViewUser(user)} onDelete={() => handleDeleteUser(user.$id)} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-4 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Shafi {currentPage} daga {totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowUserDetails(false)}></div>
          <div className="relative bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Bayanan Mai Amfani</h3>
              <div className="flex items-center gap-4 mb-8">
                {selectedUser.avatar ? (
                  <img src={selectedUser.avatar} alt="" className="h-20 w-20 rounded-full object-cover" />
                ) : (
                  <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                    {selectedUser.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedUser.name}</h4>
                  <p className="text-gray-500 dark:text-gray-400">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Matsayi</p>
                  <RoleBadge role={selectedUser.role} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Jimlar Sharhi</p>
                  <p className="text-gray-900 dark:text-white font-medium">{selectedUser.commentsCount || 0}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Ranar Shiga</p>
                  <p className="text-gray-900 dark:text-white font-medium">{formatDate(selectedUser.$createdAt)}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 flex justify-end">
              <button
                onClick={() => setShowUserDetails(false)}
                className="px-6 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Rufe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
