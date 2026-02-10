export default function PageWrapper({ title, actions, children }) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">
            {title}
          </h1>
          {actions}
        </div>
        {children}
      </div>
    </div>
  );
}
