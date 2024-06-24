import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { setEventId } from "../../features/EventId";

const LoginPage = () => {
  const dispatcher = useDispatch();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState("");
  const { id } = useParams();

  // Function to handle form submission
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setSpinner(true);
    try {
      const response = await axios.post(
        `https://tesract-server.onrender.com/event/login/${id}`,
        { username, password }
      );
      if (response.data.message) {
        dispatcher(setEventId({ eventId: id }));
        navigate(`/secure/v3/dasboard/overview/${id}`);
      }
      if (response.data.error) {
        setError(response.data.error);
        setSpinner(false);
      }
    } catch (error) {
      console.log(error);
      setSpinner(false);
    }
  };

  // Fetch event data on component mount
  useEffect(() => {
    dispatcher(setEventId({ eventId: null }));
    const fetchEventData = async () => {
      try {
        const response = await axios.get(
          ` https://tesract-server.onrender.com/event/${id}`
        );
        setEventData(response.data.data);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    };
    fetchEventData();
  }, []);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full text-gray-100">
        <div className="text-center">
          <div className="mt-5 space-y-4">
            <p className="text-gray-200">Admin dashboard</p>
            <h3 className="">
              {/* {eventData?.eventName} */}
              {eventData ? (
                <>
                  <span className="text-indigo-600 text-2xl font-bold sm:text-3xl">
                    {eventData?.eventName}
                  </span>
                </>
              ) : (
                <>
                  <span className=" text-red-600 font-semibold">
                    An Error Occured. Please use the <b>link to Login again</b>
                  </span>
                </>
              )}
            </h3>
            <p className="text-gray-300 text-xs sm:text-sm mt-2">
              "Great events are crafted with vision, precision, and dedication.
              Your dashboard is your gateway to success."
            </p>
          </div>
        </div>
        <form onSubmit={onSubmitHandler} className="mt-8 space-y-5">
          <div>
            <label className="font-medium">Username</label>
            <input
              type="text"
              required
              className="w-full mt-2 px-3 py-2 text-gray-100 bg-gray-800 outline-none border border-gray-700 focus:border-indigo-600 shadow-sm rounded-xl"
              autoComplete="current-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="relative">
            <label className="font-medium">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              required
              className="w-full mt-2 px-3 py-2 text-gray-100 bg-gray-800 outline-none border border-gray-700 focus:border-indigo-600 shadow-sm rounded-xl pr-10"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3 mr-2 text-gray-500 hover:text-gray-600 focus:outline-none"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path d="M4.757 4.757a9.5 9.5 0 0014.486 14.486l-1.515-1.515a7.5 7.5 0 01-10.656-10.656L4.757 4.757z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path
                    d="M10 12a2 2 0 100-4 2 2 0 000 4z"
                    fill="currentColor"
                  />
                  <path d="M10 0c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10-4.477-10-10-10zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8z" />
                </svg>
              )}
            </button>
          </div>
          <div className=" text-red-600 font-semibold">{error}</div>
          {spinner ? (
            <button
              className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150 flex justify-center items-center"
              disabled
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="animate-spin h-5 w-5 mr-3"
              >
                <path
                  fill="currentColor"
                  d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
                >
                  <animateTransform
                    attributeName="transform"
                    dur="0.75s"
                    repeatCount="indefinite"
                    type="rotate"
                    values="0 12 12;360 12 12"
                    className="m-2"
                  ></animateTransform>
                </path>
              </svg>
              <span className="ml-2">Taking you to your event 🎇</span>
            </button>
          ) : (
            <button className="w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150">
              Login to your dashboard
            </button>
          )}
        </form>
        <div className="text-center mt-5">
          <p href="javascript:void(0)" className="text-indigo-100">
            Forgot password? <br />
            <a
              href="https://tesract.vercel.app/Contact-Us"
              className="text-indigo-600"
            >
              contact Us{" "}
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
