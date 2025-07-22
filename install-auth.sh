#!/bin/bash
echo "==============================================="
echo " CrowdFund Platform - Package Installation"
echo "==============================================="
echo ""
echo "Installing core authentication dependencies..."
echo ""

echo "[1/4] Installing main packages..."
npm install next-auth@4.24.11 bcryptjs@2.4.3 mongodb@6.12.0 mongoose@8.10.2

echo ""
echo "[2/4] Installing additional packages..."  
npm install @auth/mongodb-adapter@3.7.0 nodemailer@6.9.18 zustand@5.0.2

echo ""
echo "[3/4] Installing TypeScript types..."
npm install --save-dev @types/bcryptjs@2.4.3 @types/nodemailer@6.4.15

echo ""
echo "[4/4] Installing additional UI packages..."
npm install react-hot-toast@2.4.1

echo ""
echo "==============================================="
echo "Installation complete!"
echo ""
echo "Next steps:"
echo "1. Environment file is already configured ✅"
echo "2. Restart the development server"
echo "3. Uncomment NextAuth imports in the code"
echo "4. Test the full authentication flow"
echo ""
echo "For demo purposes, you can test with:"
echo "Email: test@example.com"
echo "Password: TestPassword123"
echo "==============================================="
