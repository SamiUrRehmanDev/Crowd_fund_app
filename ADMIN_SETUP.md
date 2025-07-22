# Admin System Setup Guide

This guide will help you set up and use the admin system for the crowdfunding platform.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Make sure your `.env.local` file includes:
```bash
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-super-secret-jwt-key
```

### 3. Create Initial Admin User
```bash
npm run setup:admin
```

This will create an admin user with:
- **Email**: admin@crowdfunding.com
- **Password**: AdminPassword123!
- **Admin Level**: super (full permissions)

### 4. Start the Development Server
```bash
npm run dev
```

### 5. Access Admin Panel
Visit: `http://localhost:3000/admin/login`

## Admin System Features

### Authentication & Security
- ✅ JWT-based authentication with secure cookies
- ✅ Password hashing with bcrypt
- ✅ Account lockout protection
- ✅ Password reset functionality
- ✅ Audit logging for all actions
- ✅ Rate limiting on login attempts
- ✅ Role-based access control

### Admin Roles & Permissions

#### Super Admin (`super`)
- All permissions
- Can manage other admins
- System configuration access

#### Manager (`manager`)
- User management
- Campaign management
- Payment management
- Analytics access
- Content moderation

#### Moderator (`moderator`)
- Content moderation
- Basic user management
- Campaign review

### Dashboard Features
- 📊 Real-time statistics
- 📈 Growth metrics
- 🚀 Quick actions
- 📝 Recent activities
- 💚 System health monitoring

### Available Modules

1. **User Management** (`/admin/users`)
   - View, edit, suspend users
   - Manage user roles
   - User analytics

2. **Campaign Management** (`/admin/campaigns`)
   - Review and approve campaigns
   - Monitor campaign performance
   - Handle reports

3. **Task Management** (`/admin/tasks`)
   - Assign and track tasks
   - Monitor volunteer activities
   - Task analytics

4. **Payment Management** (`/admin/payments`)
   - Transaction monitoring
   - Refund processing
   - Financial reports

5. **Analytics & Reports** (`/admin/analytics`)
   - Platform statistics
   - User behavior analysis
   - Revenue reports

6. **Content Moderation** (`/admin/moderation`)
   - Review flagged content
   - Handle user reports
   - Content policies

7. **System Settings** (`/admin/settings`)
   - Platform configuration
   - Email templates
   - Payment settings

8. **Communications** (`/admin/communications`)
   - Send announcements
   - Email campaigns
   - Notification management

## API Endpoints

### Authentication
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/logout` - Admin logout
- `GET /api/admin/auth/verify` - Verify token
- `POST /api/admin/auth/reset-password` - Password reset

### Dashboard
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/dashboard/activities` - Recent activities

## Security Features

### Password Policy
- Minimum 8 characters
- Account lockout after 5 failed attempts
- Password change required for default admin

### Audit Logging
All admin actions are logged with:
- User ID and email
- Action performed
- Timestamp
- IP address
- User agent

### Session Management
- JWT tokens with 24-hour expiration
- Secure HTTP-only cookies
- Automatic token refresh
- Proper logout handling

## Development

### Adding New Admin Permissions
1. Add permission to `User` model permissions array
2. Update role-based access in middleware
3. Add permission checks in components

### Creating New Admin Pages
1. Create page in `/src/app/admin/`
2. Wrap with `AdminLayout` component
3. Use `useAdminAuth` hook for authentication
4. Add permission checks as needed

### Custom Middleware
Use the provided middleware functions:
```javascript
import { withAuth, requirePermissions } from '@/lib/middleware';

// Protect API route
export const GET = withAuth(handler);

// Require specific permission
export const POST = withAuth(requirePermissions(['user_management'])(handler));
```

## Troubleshooting

### Can't Access Admin Panel
1. Ensure admin user exists: `npm run setup:admin`
2. Check JWT_SECRET in environment variables
3. Verify MongoDB connection
4. Check browser console for errors

### Login Issues
1. Verify credentials
2. Check for account lockout
3. Review audit logs for failed attempts
4. Ensure cookies are enabled

### Permission Errors
1. Check user's adminLevel and permissions
2. Verify route protection middleware
3. Review component permission checks

## Production Deployment

### Security Checklist
- [ ] Change default admin password
- [ ] Use strong JWT_SECRET (32+ characters)
- [ ] Enable HTTPS
- [ ] Set secure cookie flags
- [ ] Configure rate limiting
- [ ] Set up email service for password reset
- [ ] Monitor audit logs
- [ ] Regular security updates

### Environment Variables
```bash
NODE_ENV=production
JWT_SECRET=extremely-long-random-string-for-production
MONGODB_URI=your-production-mongodb-uri
```

## Support

For issues or questions about the admin system:
1. Check the audit logs in `/admin/analytics`
2. Review the console logs for errors
3. Verify environment configuration
4. Check database connectivity

---

**⚠️ Important**: Always change the default admin password after first login!
