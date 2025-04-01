const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-10">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-3">About Us</h2>
          <p className="text-gray-400 text-sm">
            Welcome to our hotel booking platform, where you can find the best
            deals on hotels worldwide. We provide seamless booking experiences
            with secure transactions and top-rated accommodations.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Quick Links</h2>
          <ul className="text-gray-400 text-sm space-y-2">
            <li>
              <a href="/home" className="hover:text-gray-300">
                Home
              </a>
            </li>
            <li>
              <a className="hover:text-gray-300">About</a>
            </li>
            <li>
              <a className="hover:text-gray-300">Contact</a>
            </li>
            <li>
              <a className="hover:text-gray-300">FAQ</a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3">Contact Us</h2>
          <p className="text-gray-400 text-sm">
            📍 123 Hotel Street, City, Country
          </p>
          <p className="text-gray-400 text-sm">📞 +1 234 567 890</p>
          <p className="text-gray-400 text-sm">📧 support@hotelbooking.com</p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Hotel Booking. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
