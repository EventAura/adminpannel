import React from "react";

const ParticipantsModel = ({ isOpen, closeModal, value }) => {
  return (
    <>
      {isOpen && (
        <div
          id="default-modal"
          tabIndex="-1"
          aria-hidden="true"
          className="fixed top-0 right-0 bottom-0 left-0 z-50 flex justify-center items-center bg-black bg-opacity-50"
        >
          <div className="relative p-4 w-full max-w-2xl">
            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Event Participant Details
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
              <div className="p-4 md:p-5 space-y-10 text-left">
                <div>
                  <p className="text-base text-gray-700 dark:text-gray-100 py-1">
                    Name:
                    <span className="font-semibold text-gray-50">
                      {" "}
                      {value?.name}{" "}
                    </span>
                  </p>
                  <p className="text-base text-gray-700 dark:text-gray-100 py-1">
                    Email:{" "}
                    <span className="font-semibold text-gray-50">
                      {value?.email}{" "}
                    </span>
                  </p>
                  <p className="text-base text-gray-700 dark:text-gray-100 py-1">
                    Phone:{" "}
                    <span className="font-semibold text-gray-50">
                      {value?.phoneNumber}{" "}
                    </span>
                  </p>
                  <p className="text-base text-gray-700 dark:text-gray-100 py-1">
                    College:{" "}
                    <span className="font-semibold text-gray-50">
                      {value?.college}{" "}
                    </span>
                  </p>
                  <p className="text-base text-gray-700 dark:text-gray-100 py-1">
                    Roll Number:{" "}
                    <span className="font-semibold text-gray-50">
                      {value?.rollNumber}{" "}
                    </span>
                  </p>
                  <p className="text-base text-gray-700 dark:text-gray-100 py-1">
                    Registration Date:{" "}
                    <span className="font-semibold text-gray-50">
                      {new Date(value?.userRegistrationDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}{" "}
                    </span>
                  </p>
                  <p className="text-base text-gray-700 dark:text-gray-100 py-1">
                    Payment Status:{" "}
                    <span className="font-semibold text-gray-50">
                      {value?.paymentData?.data?.state
                        ? value?.paymentData?.data?.state
                        : "Payment Failed"}{" "}
                    </span>
                  </p>
                  <p className="text-base text-gray-700 dark:text-gray-100 py-1">
                    Transcation Id :{" "}
                    <span className="font-semibold text-gray-50">
                      {value?.paymentData?.data?.transactionId
                        ? value?.paymentData?.data?.transactionId
                        : "Payment Failed"}{" "}
                    </span>
                  </p>
                  <p className="text-base text-gray-700 dark:text-gray-100 py-1">
                    Payment Gateway Transcation ID (PG):{" "}
                    <span className="font-semibold text-gray-50">
                      {value?.paymentData?.data?.paymentInstrument
                        ?.pgTransactionId
                        ? value?.paymentData?.data?.paymentInstrument
                            ?.pgTransactionId
                        : "Payment Failed"}{" "}
                    </span>
                  </p>
                  <p className="text-base text-gray-700 dark:text-gray-100 py-1">
                    Participant Entry Status:{" "}
                    <span className="font-semibold text-gray-50">
                      {value?.userEntryStatus == "false" ? (
                        <>
                          <div>Not Entered the evnet</div>
                        </>
                      ) : (
                        <>In the Event !</>
                      )}{" "}
                    </span>
                  </p>
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
