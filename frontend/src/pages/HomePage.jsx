import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome to Trip Planeing</h1>
      <p className="mb-4">Here is a small suite of applets to plan and organize your next vacation!.</p>
      <Link to="/notebook" className="bg-blue-500 text-white px-4 py-2 rounded">
        Notebook
      </Link>
    </div>
  );
}

export default HomePage;