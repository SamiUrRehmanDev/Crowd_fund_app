# CrowdFund Platform 🌟

A comprehensive crowd funding welfare management web platform built with Next.js 15, Tailwind CSS, and MongoDB.

## 🚀 Features

### Core Functionality
- **Landing Page**: Visually compelling with real-time metrics and campaign showcases
- **User Authentication**: NextAuth.js with email/password and Google OAuth
- **Campaign Management**: Create, browse, and donate to campaigns
- **Payment Integration**: Stripe and Razorpay for secure transactions
- **Real-time Updates**: Live campaign progress and notifications
- **Multi-role Support**: Admin, Donor, Volunteer, and Donee roles

### Key Sections
- Hero section with emotional call-to-action
- Live campaign cards with real-time progress
- Impact metrics dashboard
- Success story carousel
- Partner/sponsor showcase
- Newsletter signup
- Comprehensive footer

### Technical Features
- **Performance**: Optimized for <2s load times at 95th percentile
- **Security**: OWASP Top 10 compliance, PCI-DSS SAQ-A
- **Accessibility**: WCAG 2.1 AA standards
- **Responsive**: Mobile-first design
- **SEO**: Optimized meta tags and Open Graph support

## 🛠️ Technology Stack

- **Framework**: Next.js 15 (App Router, Server Components)
- **Styling**: Tailwind CSS with custom components
- **Icons**: Heroicons React
- **Animations**: Framer Motion
- **Database**: MongoDB Atlas with Mongoose
- **Authentication**: NextAuth.js
- **Payments**: Stripe & Razorpay
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Notifications**: React Hot Toast
- **Real-time**: Socket.IO
- **Email**: Nodemailer
- **File Uploads**: Multer with Sharp for image processing

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd crowd-funding
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/crowdfunding
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key
   
   # Google OAuth
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Stripe
   STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   
   # Email
   EMAIL_SERVER_HOST=smtp.gmail.com
   EMAIL_SERVER_PORT=587
   EMAIL_SERVER_USER=your-email@gmail.com
   EMAIL_SERVER_PASSWORD=your-app-password
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── campaigns/         # Campaign-related pages
│   ├── dashboard/         # User dashboards
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Landing page
├── components/            # Reusable components
│   ├── campaigns/         # Campaign components
│   ├── layout/            # Layout components
│   └── ui/                # UI components
├── lib/                   # Utility libraries
│   ├── auth.js           # NextAuth configuration
│   └── mongodb.js        # Database connection
├── models/               # MongoDB models
├── stores/               # Zustand stores
├── types/                # TypeScript type definitions
└── utils/                # Helper functions
```

## 🎯 User Roles & Permissions

### Admin (ADM)
- Moderate content and manage platform
- Approve/reject campaigns
- Assign tasks to volunteers
- View analytics dashboard
- Configure payment settings

### Donor (DNR)
- Browse and search campaigns
- Make secure donations
- Download receipts
- Propose new cases
- View donation history

### Volunteer (VOL)
- View and accept tasks
- Submit progress reports
- Update availability
- Verify campaign details

### Donee (DON)
- Submit aid requests
- Upload supporting documents
- Track campaign progress
- Receive updates

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Code Quality

- **ESLint**: Configured for Next.js and TypeScript
- **Prettier**: Code formatting with Tailwind CSS plugin
- **Husky**: Git hooks for pre-commit checks
- **TypeScript**: Type safety throughout the application

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Manual Deployment
1. Build the application: `npm run build`
2. Start the production server: `npm run start`

## 📊 Performance Targets

- **Load Time**: <2 seconds at 95th percentile
- **Lighthouse Score**: ≥90 in all categories
- **Uptime**: 99.5% availability
- **Concurrent Users**: Support for 50,000 users
- **API Response**: <300ms under normal load

## 🔒 Security Features

- OWASP Top 10 compliance
- HTTPS/TLS 1.3 enforcement
- Rate limiting (100 req/min per user)
- PCI-DSS SAQ-A compliance
- Input sanitization and validation
- CSRF protection
- XSS prevention

## 🌍 Accessibility & SEO

- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- Semantic HTML structure
- Open Graph meta tags
- Twitter Card support
- Structured data markup

## 📈 Analytics & Monitoring

- Real-time campaign metrics
- User engagement tracking
- Performance monitoring
- Error logging with Winston
- Health checks and alerts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- Email: support@crowdfund.com
- Documentation: [docs.crowdfund.com](https://docs.crowdfund.com)
- Issue Tracker: [GitHub Issues](https://github.com/your-org/crowdfund/issues)

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- All contributors and supporters of the project

---

**Built with ❤️ for communities worldwide**
