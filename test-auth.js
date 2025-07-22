// Test file to check if next-auth is available
try {
  const NextAuth = require('next-auth');
  console.log('next-auth is available');
} catch (error) {
  console.log('next-auth is NOT available:', error.message);
}

try {
  const { signIn } = require('next-auth/react');
  console.log('next-auth/react is available');
} catch (error) {
  console.log('next-auth/react is NOT available:', error.message);
}
