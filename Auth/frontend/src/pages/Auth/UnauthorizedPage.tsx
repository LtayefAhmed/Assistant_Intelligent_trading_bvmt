export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl font-bold text-red-600 mb-4">403</h1>
      <h2 className="text-2xl font-semibold mb-2">Unauthorized Access</h2>
      <p className="text-gray-600 mb-6">
        You don’t have permission to view this page.
      </p>

      <a
        href="/"
        className="px-6 py-3 bg-primary text-white rounded-xl shadow hover:opacity-90"
      >
        Go Back Home
      </a>
    </div>
  );
}
