export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎉 App is Running!
        </h1>
        <p className="text-gray-600 mb-6">
          The crowd funding platform is working without NextAuth dependencies.
        </p>
        <div className="space-y-3">
          <a 
            href="/instructions" 
            className="block w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            📋 View Instructions & Demo
          </a>
          <a 
            href="/auth/signin" 
            className="block w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔑 Sign In (test@example.com)
          </a>
          <a 
            href="/auth/signup" 
            className="block w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            📝 Sign Up (simulation)
          </a>
        </div>
        <div className="mt-6 text-sm text-gray-500">
          <p>✅ Authentication pages updated</p>
          <p>✅ NextAuth imports removed</p>
          <p>✅ Temporary signin/signup flow working</p>
        </div>
      </div>
    </div>
  );
}
