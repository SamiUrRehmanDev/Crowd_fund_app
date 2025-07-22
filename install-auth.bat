@echo off
echo ===============================================
echo  CrowdFund Platform - Package Installation
echo ===============================================
echo.
echo Installing core authentication dependencies...
echo.

echo [1/3] Installing main packages...
npm install next-auth@4.24.11 bcryptjs@2.4.3 mongodb@6.12.0 mongoose@8.10.2

echo.
echo [2/3] Installing additional packages...
npm install @auth/mongodb-adapter@3.7.0 nodemailer@6.9.18 zustand@5.0.2

echo.
echo [3/3] Installing TypeScript types...
npm install --save-dev @types/bcryptjs@2.4.3 @types/nodemailer@6.4.15

echo.
echo ===============================================
echo Installation complete!
echo.
echo Next steps:
echo 1. Copy .env.example to .env.local
echo 2. Configure your MongoDB URI and other secrets
echo 3. Restart the development server
echo 4. Uncomment NextAuth imports in the code
echo.
echo For demo purposes, you can test with:
echo Email: test@example.com
echo Password: TestPassword123
echo ===============================================
pause
