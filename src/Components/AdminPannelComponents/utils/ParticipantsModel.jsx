import React from "react";
import axios from "axios";
import { useState } from "react";

const ParticipantsModel = ({ isOpen, closeModal, value, eventId }) => {
  const [clicked, setClicked] = useState(false);
  const handleClick = async () => {
    const response = await axios.post(
      `https://eventaura-server-api.onrender.com/api/phone-pay/status/M22FPMAZBNMJ5/${value.merchantTransactionId}/${eventId}`
    );
    console.log(response);
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
    }, 5000);
    console.log("clicked");
  };
  return (
    <>
      {isOpen && (
        <div
          id="default-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-3xl">
            <div className="relative bg-gray-800 rounded-lg shadow-lg">
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-600 rounded-t">
                <h3 className="text-2xl font-bold text-white">
                  Event Participant Details
                </h3>
                <button
                  type="button"
                  className="text-gray-400 hover:bg-gray-700 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={closeModal}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>

              {/* Content */}
              <div className="p-4 md:p-5 max-h-[80vh] overflow-y-auto space-y-6">
                {/* Personal Info */}
                <div className="bg-gray-900 p-4 rounded-lg shadow">
                  <h4 className="text-xl font-semibold text-indigo-400 mb-4 flex items-center gap-2">
                    <span className="material-icons"></span> Personal
                    Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-400 material-icons"></span>
                      <p className="text-gray-200">
                        <span className="font-bold">Name:</span>{" "}
                        {value?.name || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-400 material-icons"></span>
                      <p className="text-gray-200">
                        <span className="font-bold">Email:</span>{" "}
                        {value?.email || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-400 material-icons"></span>
                      <p className="text-gray-200">
                        <span className="font-bold">Phone:</span>{" "}
                        {value?.phoneNumber || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-400 material-icons"></span>
                      <p className="text-gray-200">
                        <span className="font-bold">Event Name:</span>{" "}
                        {value?.eventName || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="bg-gray-900 p-4 rounded-lg shadow">
                  <h4 className="text-xl font-semibold text-indigo-400 mb-4 flex items-center gap-2">
                    <span className="material-icons">payment</span> Payment
                    Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-200">
                        <span className="font-bold text-white">
                          Payment Status:
                        </span>{" "}
                        <span
                          className={`text-sm px-2 py-1 rounded ${
                            value?.paymentData?.data?.state === "Completed"
                              ? "bg-green-500 text-white"
                              : value?.paymentData?.data?.state === "Failed"
                              ? "bg-red-500 text-white"
                              : "bg-yellow-500 text-gray-800"
                          }`}
                        >
                          {value?.paymentData?.data?.state || "N/A"}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-200">
                        <span className="font-bold text-white">
                          Transaction ID:
                        </span>{" "}
                        {value?.paymentData?.data?.transactionId || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-200">
                        <span className="font-bold text-white">
                          Gateway Transaction ID:
                        </span>{" "}
                        {value?.paymentData?.data?.merchantTransactionId ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-200">
                        <span className="font-bold text-white">
                          Entry Status:
                        </span>{" "}
                        {value?.userEntryStatus === "false"
                          ? "Not Entered the Event"
                          : "In the Event!"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gray-900 p-4 rounded-lg shadow">
                  <h4 className="text-xl font-semibold text-indigo-400 mb-4 flex items-center gap-2">
                    <span className="material-icons">info</span> Additional
                    Information
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-200">
                        <span className="font-bold text-white">Education:</span>{" "}
                        {value?.extraQuestions?.educationBackground || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-200">
                        <span className="font-bold text-white">College: </span>{" "}
                        {value?.college || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-200">
                        <span className="font-bold text-white">Year:</span>{" "}
                        {value?.extraQuestions?.year || "N/A"}
                      </p>
                    </div>

                    <div>
                      <p className="text-gray-200">
                        <span className="font-bold text-white">
                          Heard From:
                        </span>{" "}
                        {value?.extraQuestions?.heardFrom || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-200">
                        <span className="font-bold text-white">Topics:</span>{" "}
                        {value?.extraQuestions?.specificTopics || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-200">
                        <span className="font-bold text-white">Allergies:</span>{" "}
                        {value?.extraQuestions?.specialAllergies || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-200">
                        <span className="font-bold text-white">
                          Community Answer:
                        </span>{" "}
                        {value?.extraQuestions?.communityAnswer || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div>
                  {clicked && (
                    <div className="text-green-400 mt-2">Email Sent</div>
                  )}
                  <button
                    onClick={handleClick}
                    className="font-semibold text-white border-1 p-2 rounded-md bg-indigo-600 hover:bg-indigo-500"
                  >
                    Send Email Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ParticipantsModel;
