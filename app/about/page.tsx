
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="p-24">
      <h1 className="text-2xl font-bold">About Us</h1>
      <p>We are building a simple app.</p>
      
      {/* Navigate back to home */}
      <Link href="/" className="text-blue-500 hover:underline mt-4 block">
        Go Back Home
      </Link>
    </div>
  );
}