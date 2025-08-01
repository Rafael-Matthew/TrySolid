// Database simulasi - dalam production ganti dengan database sesungguhnya
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
}

// In-memory storage (dalam production gunakan database seperti PostgreSQL, MongoDB, dll)
const users: User[] = [];

export const userDatabase = {
  // Tambah user baru
  createUser: (userData: Omit<User, 'id' | 'createdAt'>): User => {
    const newUser: User = {
      ...userData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    users.push(newUser);
    return newUser;
  },

  // Cari user berdasarkan email
  findUserByEmail: (email: string): User | undefined => {
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  },

  // Cari user berdasarkan ID
  findUserById: (id: string): User | undefined => {
    return users.find(user => user.id === id);
  },

  // Get semua users (untuk testing)
  getAllUsers: (): Omit<User, 'password'>[] => {
    return users.map(({ password, ...user }) => user);
  },

  // Update user
  updateUser: (id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>): User | null => {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) return null;
    
    users[userIndex] = { ...users[userIndex], ...updates };
    return users[userIndex];
  },

  // Delete user
  deleteUser: (id: string): boolean => {
    const userIndex = users.findIndex(user => user.id === id);
    if (userIndex === -1) return false;
    
    users.splice(userIndex, 1);
    return true;
  }
};

// JWT Secret
export const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

// Helper untuk membuat response tanpa password
export const sanitizeUser = (user: User): Omit<User, 'password'> => {
  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};
