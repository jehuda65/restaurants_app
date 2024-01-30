import { Link } from "@remix-run/react";

export default function Nav() {
  return (
    <nav className="fixed bg-opacity-90 backdrop-blur-sm z-20 top-0 left-0 bg-gray-800 w-full text-white h-16 flex items-center">
      <div className="basis-1/2 pl-6 font-arbutus">
        <Link to="/" className="flex items-center gap-4 group duration-300">
          <img
            className="h-9 p-1 bg-gradient-to-t from-green-700 to-green-500 rounded-lg group-hover:bg-gradient-to-t group-hover:from-green-700 group-hover:to-green-400 duration-500"
            src="/img/croissant.png"
            alt=""
          />
          <p>
            The Restaurants <span className="text-green-500">Hub</span>
          </p>
        </Link>
      </div>
      <div className="flex justify-end pr-6 basis-1/2 space-x-6">
        <button className="hover:bg-gray-400/40 px-5 py-1 rounded duration-300 ring-1 ring-green-600">
          <Link to="/join">Sign up</Link>
        </button>
        <button className="hover:bg-gray-400/40 px-5 py-1 rounded duration-300 ring-1 ring-green-600">
          <Link to="/login"> Log in</Link>
        </button>
      </div>
    </nav>
  );
}
