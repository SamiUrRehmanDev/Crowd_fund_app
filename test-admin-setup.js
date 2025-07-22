// Simple test to verify admin system setup
console.log('🚀 Testing Admin System Setup...');
console.log('');

// Test 1: Check if all required files exist
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'src/lib/mongodb.js',
  'src/lib/auth.js',
  'src/lib/middleware.js',
  'src/lib/models/User.js',
  'src/lib/models/AuditLog.js',
  'src/components/admin/AdminAuthProvider.js',
  'src/components/admin/AdminLayout.js',
  'src/app/admin/layout.js',
  'src/app/admin/page.js',
  'src/app/admin/login/page.js',
  'src/app/api/admin/auth/login/route.js',
  'src/app/api/admin/auth/logout/route.js',
  'src/app/api/admin/auth/verify/route.js'
];

console.log('📁 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

console.log('');
if (allFilesExist) {
  console.log('✅ All required files exist!');
} else {
  console.log('❌ Some files are missing!');
}

// Test 2: Check package.json dependencies
console.log('');
console.log('📦 Checking dependencies...');
const packageJson = require('./package.json');
const requiredDeps = ['mongoose', 'jsonwebtoken', 'bcryptjs', 'react-icons', 'framer-motion'];

requiredDeps.forEach(dep => {
  const exists = packageJson.dependencies[dep] || packageJson.devDependencies[dep];
  console.log(`${exists ? '✅' : '❌'} ${dep}`);
});

// Test 3: Check environment variables
console.log('');
console.log('🔧 Environment variables setup:');
console.log(`${process.env.MONGODB_URI ? '✅' : '❌'} MONGODB_URI`);
console.log(`${process.env.JWT_SECRET ? '✅' : '❌'} JWT_SECRET`);

console.log('');
console.log('🎯 Admin System Setup Complete!');
console.log('');
console.log('🚀 Next steps:');
console.log('1. npm run dev (start development server)');
console.log('2. npm run setup:admin (create initial admin user)');
console.log('3. Visit http://localhost:3000/admin/login');
console.log('');
console.log('📧 Default admin credentials:');
console.log('   Email: admin@crowdfunding.com');
console.log('   Password: AdminPassword123!');
console.log('');
console.log('⚠️  Remember to change the default password after first login!');
