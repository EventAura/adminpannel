import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ParticipantsModel from "./utils/ParticipantsModel";

const Participants = () => {
  const eventSelector = useSelector((state) => state.eventId.value);
  const [participants, setParticipants] = useState([]);
  const [modelParticipant, setModelParticipant] = useState(null);
  const [modal, setModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const openModal = (participant) => {
    setModelParticipant(participant);
    setModal(true);
  };

  const closeModal = () => {
    setModelParticipant(null);
    setModal(false);
  };

  useEffect(() => {
    const fetchParticipantsApi = async () => {
      try {
        const response = await axios.get(
          `https://tesract-server.onrender.com/participants/event/${eventSelector.eventId}`
        );
        setParticipants(response.data);
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchParticipantsApi();
  }, [eventSelector.eventId]);

  // Filter participants based on search term
  const filteredParticipants = participants.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (loading) {
    return (
      <>
        <div className="flex flex-col justify-center items-center h-screen ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
            width="100"
            height="100"
            style={{
              shapeRendering: "auto",
              display: "block",
            }}
            className="mb-4"
          >
            <circle
              cx="50"
              cy="50"
              r="23"
              strokeDasharray="108.38494654884786 38.12831551628262"
              strokeWidth="4"
              stroke="#3949ab"
              fill="none"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                repeatCount="indefinite"
                dur="0.9174311926605504s"
                values="0 50 50;360 50 50"
                keyTimes="0;1"
              />
            </circle>
          </svg>
          <h2 className="text-xl font-semibold text-gray-100 mt-4">
            Gathering Your Paticipants 🎇
          </h2>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="items-start justify-between md:flex">
          <div className="max-w-lg">
            <h3 className="text-gray-100 text-xl font-bold sm:text-2xl">
              All Participants
            </h3>
          </div>
          <div className="mt-3 md:mt-0">
            <a
              href="javascript:void(0)"
              className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm"
            >
              Event Onboarding
            </a>
          </div>
        </div>

        {/* Search Box */}
        <div className="mt-4">
          <input
            type="text"
            className="block w-full px-3 py-2 placeholder-gray-400 text-gray-100  rounded-md shadow-sm focus:border-none border sm:text-sm"
            placeholder="Search participants by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mt-6 relative h-max overflow-auto">
          <table className="w-full table-auto text-sm text-left">
            <thead className="text-gray-100 font-medium border-b">
              <tr>
                <th className="py-3 pr-6">Name</th>
                <th className="py-3 pr-6">Date</th>
                <th className="py-3 pr-6">Status</th>
                <th className="py-3 pr-6">Transaction ID</th>
                <th className="py-3 pr-6">Email</th>
                <th className="py-3 pr-6"></th>
              </tr>
            </thead>
            <tbody className="text-gray-100 divide-y">
              {filteredParticipants.map((item, idx) => (
                <tr key={idx}>
                  <td className="pr-6 py-4 whitespace-nowrap">{item.name}</td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    {new Date(item.userRegistrationDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-2 rounded-full font-semibold text-xs ${
                        item?.paymentData?.data?.state === "COMPLETED"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {item?.paymentData?.data?.state === "COMPLETED"
                        ? "Completed"
                        : "failed"}
                    </span>
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">
                    {item?.paymentData?.data?.transactionId.slice(-5)}
                  </td>
                  <td className="pr-6 py-4 whitespace-nowrap">{item?.email}</td>
                  <td className="text-right whitespace-nowrap">
                    <button
                      href="javascript:void(0)"
                      className="py-1.5 px-2 text-gray-100 bg-indigo-600 hover:bg-indigo-800 duration-150 text-xs rounded-lg"
                      onClick={() => openModal(item)}
                    >
                      Show More
                    </button>

                    <ParticipantsModel
                      isOpen={modal}
                      closeModal={closeModal}
                      value={modelParticipant}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Participants;
