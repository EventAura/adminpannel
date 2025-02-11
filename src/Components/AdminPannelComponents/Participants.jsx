import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import ParticipantsModel from "./utils/ParticipantsModel";

import { jsPDF } from "jspdf";
import "jspdf-autotable";

import * as XLSX from "xlsx";
import { Link } from "react-router-dom";

const Participants = () => {
  const eventSelector = useSelector((state) => state.eventId.value);
  const [participants, setParticipants] = useState([]);
  const [modelParticipant, setModelParticipant] = useState(null);
  const [modal, setModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

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
          `https://api.eventaura.tech/participants/event/${eventSelector.eventId}`
        );
        setParticipants(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchParticipantsApi();
  }, [eventSelector.eventId]);

  const filteredParticipants = participants
    .filter((item) =>
      Object.values(item)
        .map((field) => String(field).toLowerCase())
        .some((field) => field.includes(searchTerm.toLowerCase()))
    )
    .filter((item) => {
      if (filter === "All") return true;
      if (filter === "Paid")
        return item?.paymentData?.data?.state === "COMPLETED";
      if (filter === "Pending")
        return item?.paymentData?.data?.state === "PENDING";
      if (filter === "Failed")
        return item?.paymentData?.data?.state === "FAILED";
      if (filter === "Other")
        return (
          item?.paymentData?.data?.state !== "PENDING" &&
          item?.paymentData?.data?.state !== "COMPLETED" &&
          item?.paymentData?.data?.state !== "FAILED"
        );
      return true;
    });

  const generateFileName = () => {
    const eventName = eventSelector.eventId;
    const dateTime = new Date().toLocaleString().replace(/[/,:\s]/g, "_");
    return `${eventName}__participants_${dateTime}`;
  };

  // const downloadExcel = () => {
  //   const paidParticipants = participants.filter(
  //     (item) => item?.paymentData?.data?.state === "COMPLETED"
  //   );

  //   const data = paidParticipants.map((item) => ({
  //     Name: item.name,
  //     Date: new Date(item.userRegistrationDate).toLocaleDateString("en-US", {
  //       year: "numeric",
  //       month: "long",
  //       day: "numeric",
  //     }),
  //     "Transaction ID": item?.paymentData?.data?.transactionId || "N/A",
  //     Email: item?.email,
  //     "Phone Number": item?.phoneNumber || "N/A",
  //   }));

  //   const worksheet = XLSX.utils.json_to_sheet(data);
  //   const workbook = XLSX.utils.book_new();
  //   XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");

  //   XLSX.writeFile(workbook, `${generateFileName()}.xlsx`);
  // };

  const downloadExcel = () => {
    const filteredData = filteredParticipants.map((item) => ({
      NAME: item.name,
      "PHONE NUMBER": item?.phoneNumber || "N/A",
      EMAIL: item?.email || "N/A",
      STATUS: item?.paymentData?.data?.state || "N/A",
      "TRANSACTION ID": item?.paymentData?.data?.transactionId || "N/A",
      "MERCHANT TRANSACTION ID":
        item?.paymentData?.data?.merchantTransactionId || "N/A",
      "PAYMENT TYPE": item?.paymentData?.data?.paymentInstrument?.type || "N/A",
      "EDUCATION BACKGROUND":
        item?.extraQuestions?.educationBackground || "N/A",
      COLLEGE: item?.college || "N/A",
      YEAR: item?.extraQuestions?.year || "N/A",
      "ROLL NUMBER": item?.rollNumber || "N/A",
      "HEARD FROM": item?.extraQuestions?.heardFrom || "N/A",
      "SPECIFIC TOPICS": item?.extraQuestions?.specificTopics || "N/A",
      "SPECIAL ALLERGIES": item?.extraQuestions?.specialAllergies || "N/A",
      "COMMUNITY ANSWER": item?.extraQuestions?.communityAnswer || "N/A",
      "REGISTRATION DATE": item?.userRegistrationDate
        ? new Date(item.userRegistrationDate).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })
        : "N/A", // Use "N/A" for missing registration dates
    }));

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");

    // Ensure the column names are set properly
    XLSX.writeFile(workbook, `${generateFileName()}.xlsx`);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Participants Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`Event ID: ${eventSelector.eventId}`, 14, 30);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 36);

    const tableData = filteredParticipants.map((item) => [
      item.name,
      item?.phoneNumber || "N/A",
      item?.email || "N/A",
      item?.paymentData?.data?.state || "N/A",
      item?.paymentData?.data?.transactionId || "N/A",
    ]);

    doc.autoTable({
      head: [["Name", "Phone Number", "Email", "Status", "Transaction ID"]],
      body: tableData,
      startY: 40,
      theme: "grid",
    });

    doc.setFontSize(10); // Smaller font for footer
    doc.text("Powered by EventAura", 14, doc.internal.pageSize.height - 10); // Footer placement

    doc.save(`${generateFileName()}.pdf`);
  };

  if (loading) {
    return (
      <>
        <div className="flex flex-col justify-center items-center h-screen">
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
            Gathering Your Participants 🎇
          </h2>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="items-start justify-between md:flex">
          <h3 className="text-gray-100 text-xl font-bold sm:text-2xl">
            All Participants
          </h3>
          <Link
            to="/secure/v3/dasboard/qrcode-scanner"
            className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm"
          >
            Event Onboarding
          </Link>
        </div>

        <div className="mt-4">
          <input
            type="text"
            className="block w-full px-3 py-2 placeholder-gray-400 text-gray-100 bg-gray-800 rounded-md shadow-sm"
            style={{ width: "80%" }}
            placeholder="Search participants by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="mt-6 flex gap-4">
          <button
            className={`px-4 py-2 text-white rounded-lg ${
              filter === "All"
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => setFilter("All")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 text-white rounded-lg ${
              filter === "Paid"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => setFilter("Paid")}
          >
            Paid
          </button>
          <button
            className={`px-4 py-2 text-white rounded-lg ${
              filter === "Pending"
                ? "bg-yellow-500 hover:bg-yellow-600"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => setFilter("Pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 text-white rounded-lg ${
              filter === "Failed"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => setFilter("Failed")}
          >
            Failed
          </button>

          <button
            className={`px-4 py-2 text-white rounded-lg ${
              filter === "Other"
                ? "bg-purple-600 hover:bg-purple-700"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => setFilter("Other")}
          >
            Other
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            className="text-white bg-indigo-600 p-2 rounded-md hover:bg-indigo-700 flex items-center mr-2"
            onClick={downloadExcel}
          >
            Download Excel
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-600"
            onClick={downloadPDF}
          >
            Download PDF
          </button>
        </div>

        <div className="mt-6 relative h-max overflow-auto">
          <table className="w-full table-auto text-base text-left">
            <thead className="text-gray-100 font-semibold border-b border-gray-700">
              <tr>
                <th className="py-4 pr-6">Name</th>
                <th className="py-4 pr-6">Date</th>
                <th className="py-4 pr-6">Status</th>
                <th className="py-4 pr-6">Transaction ID</th>
                <th className="py-4 pr-6">Email</th>
                <th className="py-4 pr-6"></th>
              </tr>
            </thead>
            <tbody className="text-gray-100 divide-y divide-gray-700">
              {filteredParticipants.map((item, idx) => (
                <tr key={idx} className="hover:bg-gray-800">
                  <td className="pr-6 py-4">{item.name}</td>
                  <td className="pr-6 py-4">
                    {new Date(item.userRegistrationDate).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </td>
                  <td className="pr-6 py-4">
                    <span
                      className={`px-3 py-2 rounded-full font-semibold text-xs ${
                        item?.paymentData?.data?.state === "COMPLETED"
                          ? "text-green-500"
                          : item?.paymentData?.data?.state === "PENDING"
                          ? "text-yellow-500"
                          : item?.paymentData?.data?.state === "FAILED"
                          ? "text-red-500"
                          : "text-purple-500"
                      }`}
                    >
                      {item?.paymentData?.data?.state === "PENDING"
                        ? "PENDING"
                        : item?.paymentData?.data?.state === "COMPLETED"
                        ? "PAID"
                        : item?.paymentData?.data?.state === "FAILED"
                        ? "FAILED"
                        : "OTHER"}
                    </span>
                  </td>
                  <td className="pr-6 py-4">
                    {item?.paymentData?.data?.transactionId || "N/A"}
                  </td>
                  <td className="pr-6 py-4">{item.email}</td>
                  <td className="pr-6 py-4">
                    <button
                      className="py-2 px-4 text-gray-100 bg-indigo-600 hover:bg-indigo-800 duration-150 text-xs rounded-lg"
                      onClick={() => openModal(item)}
                    >
                      Show More
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ParticipantsModel
          isOpen={modal}
          closeModal={closeModal}
          value={modelParticipant}
          eventId={eventSelector.eventId}
        />
      </div>
    </>
  );
};

export default Participants;
