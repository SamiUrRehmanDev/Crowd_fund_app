import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import connectDB from './mongodb.js';
import User from './models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
import CredentialsProvider from "next-auth/providers/credentials";

// ...existing code (AuthService, etc.)...

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", required: true },
        password: { label: "Password", type: "password", required: true }
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) return null;
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;
        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          name: user.name || user.email
        };
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.name = token.name;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error"
  },
  secret: process.env.NEXTAUTH_SECRET
};
export class AuthService {
  // Helper function to ensure user stats object exists
  static ensureUserStats(user) {
    if (!user.stats) {
      user.stats = {
        totalDonations: 0,
        donationCount: 0,
        totalReceived: 0,
        campaignsCreated: 0,
        tasksCompleted: 0,
        volunteerHours: 0,
        loginCount: 0
      };
    }
    return user;
  }

  static async hashPassword(password) {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }

  static generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  static async login(email, password, ipAddress = null, userAgent = null) {
    await connectDB();
    
    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check if user is an admin
    if (!user.isAdmin && user.role !== 'admin') {
      throw new Error('Access denied. Admin privileges required.');
    }

    // Check if account is locked
    if (user.isLocked) {
      throw new Error('Account is temporarily locked due to multiple failed login attempts');
    }

    // Check if account is active (check both status field and isActive field)
    if (user.status && user.status !== 'active' && user.status !== 'pending') {
      throw new Error(`Account is ${user.status}. Please contact system administrator.`);
    }

    // Also check isActive field if it exists
    if (user.isActive !== undefined && !user.isActive) {
      throw new Error('Account is inactive. Please contact system administrator.');
    }

    // Verify password
    const isPasswordValid = await this.comparePassword(password, user.password);
    
    if (!isPasswordValid) {
      // Increment login attempts
      await user.incrementLoginAttempts();
      throw new Error('Invalid email or password');
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Ensure stats object exists and update login statistics
    this.ensureUserStats(user);
    user.stats.loginCount = (user.stats.loginCount || 0) + 1;
    user.stats.lastLogin = new Date();
    user.stats.lastActivity = new Date();
    await user.save();

    // Generate JWT token
    const tokenPayload = {
      userId: user._id,
      email: user.email,
      role: user.role,
      adminLevel: user.adminLevel,
      permissions: user.permissions || []
    };

    const token = this.generateToken(tokenPayload);

    // Create session record (optional - for advanced session management)
    const session = {
      userId: user._id,
      token,
      ipAddress,
      userAgent,
      loginAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      active: true
    };

    // Return user data without sensitive information
    const userObject = user.toObject();
    
    return {
      user: {
        _id: userObject._id,
        name: userObject.name,
        email: userObject.email,
        role: userObject.role,
        isAdmin: userObject.isAdmin,
        adminLevel: userObject.adminLevel,
        permissions: userObject.permissions || [],
        status: userObject.status,
        isActive: userObject.isActive
      },
      token,
      session
    };
  }

  static async verifyAuth(token) {
    try {
      const decoded = this.verifyToken(token);
      
      await connectDB();
      
      // Verify user still exists and is active
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        throw new Error('User not found');
      }

      if (user.role !== 'admin') {
        throw new Error('Access denied. Admin privileges required.');
      }

      // Check if account is active - check both isActive and status fields
      if (!user.isActive) {
        throw new Error('Account is not active');
      }
      
      if (user.status !== 'active') {
        throw new Error('Account status is not active');
      }

      // Ensure stats exists and update last activity
      this.ensureUserStats(user);
      user.stats.lastActivity = new Date();
      await user.save();

      return {
        user: user.toSafeObject(),
        decoded
      };
    } catch (error) {
      throw new Error('Authentication failed: ' + error.message);
    }
  }

  static async logout(userId, token) {
    await connectDB();
    
    // In a production environment, you might want to:
    // 1. Blacklist the token
    // 2. Remove active sessions
    // 3. Log the logout event
    
    const user = await User.findById(userId);
    if (user) {
      // Ensure stats exists and update last activity
      this.ensureUserStats(user);
      user.stats.lastActivity = new Date();
      await user.save();
    }

    return { success: true, message: 'Logged out successfully' };
  }

  static async refreshToken(oldToken) {
    try {
      const decoded = this.verifyToken(oldToken);
      
      await connectDB();
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user || user.role !== 'admin') {
        throw new Error('Unable to refresh token');
      }
      
      if (!user.isActive) {
        throw new Error('Account is not active');
      }
      
      if (user.status !== 'active') {
        throw new Error('Account status is not active');
      }

      // Generate new token
      const tokenPayload = {
        userId: user._id,
        email: user.email,
        role: user.role,
        adminLevel: user.adminLevel,
        permissions: user.permissions || []
      };

      const newToken = this.generateToken(tokenPayload);

      return {
        token: newToken,
        user: user.toSafeObject()
      };
    } catch (error) {
      throw new Error('Token refresh failed: ' + error.message);
    }
  }

  static async changePassword(userId, currentPassword, newPassword) {
    await connectDB();
    
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await this.comparePassword(currentPassword, user.password);
    
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Validate new password strength
    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long');
    }

    // Hash new password
    const hashedNewPassword = await this.hashPassword(newPassword);
    
    // Update password
    user.password = hashedNewPassword;
    user.updatedAt = new Date();
    await user.save();

    return { success: true, message: 'Password changed successfully' };
  }

  static async requestPasswordReset(email) {
    await connectDB();
    
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      role: 'admin'
    });
    
    if (!user) {
      // Don't reveal if email exists or not for security
      return { success: true, message: 'If the email exists, a reset link has been sent' };
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id, type: 'password_reset' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Save reset token to user
    user.passwordResetToken = resetToken;
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    // In production, send email with reset link
    // For now, return the token (remove this in production)
    return {
      success: true,
      message: 'Password reset email sent',
      resetToken // Remove this in production
    };
  }

  static async resetPassword(resetToken, newPassword) {
    try {
      const decoded = jwt.verify(resetToken, JWT_SECRET);
      
      if (decoded.type !== 'password_reset') {
        throw new Error('Invalid reset token');
      }

      await connectDB();
      
      const user = await User.findOne({
        _id: decoded.userId,
        passwordResetToken: resetToken,
        passwordResetExpires: { $gt: new Date() }
      });

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      // Validate new password
      if (newPassword.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Hash new password
      const hashedPassword = await this.hashPassword(newPassword);

      // Update user
      user.password = hashedPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.loginAttempts = 0;
      user.lockUntil = undefined;
      await user.save();

      return { success: true, message: 'Password reset successfully' };
    } catch (error) {
      throw new Error('Password reset failed: ' + error.message);
    }
  }

  static async enable2FA(userId) {
    // Implementation for 2FA setup
    // This would integrate with services like Google Authenticator
    // For now, return a placeholder
    return {
      success: true,
      secret: 'placeholder-2fa-secret',
      qrCode: 'placeholder-qr-code-url'
    };
  }

  static async verify2FA(userId, token) {
    // Implementation for 2FA verification
    // For now, return true for demo purposes
    return { success: true, valid: true };
  }
}

export default AuthService;
