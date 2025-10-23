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
import { userService, commentService } from '../../lib/appwriteServices';
import type { User } from '../../types';

interface UserWithStats extends User {
  commentsCount?: number;
  lastActivity?: string;
}

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Jimlar Masu Amfani</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {totalUsers}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <FiUser className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Masu Aiki Yau</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {users.filter(u => getTimeAgo(u.lastActivity) === 'Yau').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <FiUser className="w-6 h-6 text-green-600 dark:text-green-400" />
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

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sabbin Masu Amfani</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
                {users.filter(u => {
                  const created = new Date(u.$createdAt || '');
                  const now = new Date();
                  const diffInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
                  return diffInDays <= 7;
                }).length}
              </p>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <FiUser className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <FiUser className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
              Babu masu amfani
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm ? 'Ba a sami wani mai amfani da ya dace da neman ka ba' : 'Har yanzu babu masu amfani a cikin tsarin'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Mai Amfani
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Imel
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Matsayi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Sharhi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ranar Shiga
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Aiki Na Karshe
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Ayyuka
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => (
                  <tr key={user.$id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                            {user.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <FiMail className="mr-2 h-4 w-4" />
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
                          : user.role === 'author'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : user.role === 'author' ? 'Marubucin' : 'Mai Amfani'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <FiMessageSquare className="mr-2 h-4 w-4" />
                        {user.commentsCount || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center">
                        <FiCalendar className="mr-2 h-4 w-4" />
                        {formatDate(user.$createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                      {getTimeAgo(user.lastActivity)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewUser(user)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="Duba"
                        >
                          <FiEye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.$id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                          title="Share"
                        >
                          <FiTrash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75" onClick={() => setShowUserDetails(false)}></div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100 mb-4">
                      Bayanan Mai Amfani
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        {selectedUser.avatar ? (
                          <img
                            src={selectedUser.avatar}
                            alt={selectedUser.name}
                            className="h-20 w-20 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-20 w-20 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold">
                            {selectedUser.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {selectedUser.name}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedUser.email}
                          </p>
                        </div>
                      </div>

                      {selectedUser.bio && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Bayani
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedUser.bio}
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Matsayi
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedUser.role === 'admin' ? 'Admin' : selectedUser.role === 'author' ? 'Marubucin' : 'Mai Amfani'}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Sharhi
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedUser.commentsCount || 0}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Ranar Shiga
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(selectedUser.$createdAt)}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Aiki Na Karshe
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {getTimeAgo(selectedUser.lastActivity)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowUserDetails(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-700 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Rufe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
