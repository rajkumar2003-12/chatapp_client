import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Zod {
  id: string;
  username: string;
}

const Home = () => {
  const [users, setUsers] = useState<Zod[]>([]);
  // const navigate = useNavigate();             

useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios
      .get("http://localhost:3000/author/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("Failed to fetch users", error));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center ">Users</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center transition-transform transform hover:scale-105"
          >
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-800">@{user.username}</h2>

              <Link to = "/chat"
                state={{ receiverId: user.id, receiverName :user.username}}>
              <button
                // onClick={() => navigate(`/chat/${user.id}`)}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Connect to Chat
              </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
