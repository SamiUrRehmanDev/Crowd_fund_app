// Simple test to check if our imports work
console.log('Testing imports...');

try {
  // Test database connection
  const connectDB = await import('../src/lib/mongodb.js');
  console.log('✅ MongoDB import successful');
  
  // Test auth service
  const { AuthService } = await import('../src/lib/auth.js');
  console.log('✅ AuthService import successful');
  
  // Test User model
  const User = await import('../src/lib/models/User.js');
  console.log('✅ User model import successful');
  
  // Test AuditLog model
  const AuditLog = await import('../src/lib/models/AuditLog.js');
  console.log('✅ AuditLog model import successful');
  
  console.log('🎉 All imports working correctly!');
  
} catch (error) {
  console.error('❌ Import error:', error.message);
  console.error('Full error:', error);
}
