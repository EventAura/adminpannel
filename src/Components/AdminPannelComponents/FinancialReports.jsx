import  { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {  isSameDay } from "date-fns";

import * as XLSX from "xlsx";
import { FiDownload } from "react-icons/fi";

import { jsPDF } from "jspdf";
import "jspdf-autotable";

const FinancialReports = () => {
  const eventSelector = useSelector((state) => state.eventId.value);
  const [eventData, setEventData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [datesList, setDatesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // console.log(participants[0].paymentData?.data?.state === "COMPLETED")

  // Function to generate list of dates between start and end date
  const DateList = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const tempDatesList = [];
    console.log(tempDatesList);

    while (startDate <= endDate) {
      tempDatesList.push(new Date(startDate.toISOString())); // Store Date objects
      startDate.setDate(startDate.getDate() + 1);
    }

    setDatesList(tempDatesList);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventResponse = await axios.get(
          `https://tesract-server.onrender.com/event/${eventSelector?.eventId}`
        );
        // console.log("Event Data:", eventResponse.data.data);
        setEventData(eventResponse.data.data);

        // const participantsResponse = await axios.get(
        //   `https://tesract-server.onrender.com/participants/event/${eventSelector?.eventId}`
        // );
        // // console.log("Participants Data:", participantsResponse.data);
        // setParticipants(participantsResponse.data);
        const fetchParticipantsApi = async () => {
          try {
            const response = await axios.get(
              `https://tesract-server.onrender.com/participants/event/${eventSelector.eventId}`
            );
            setParticipants(response.data);
            setLoading(false);
            // console.log(response.data);
          } catch (error) {
            console.log(error);
          }
        };
        fetchParticipantsApi();

        if (
          eventResponse.data.data?.eventCreatedDate &&
          eventResponse.data.data?.eventLastDate
        ) {
          DateList(
            eventResponse.data.data.eventCreatedDate,
            eventResponse.data.data.eventLastDate
          );
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    if (eventSelector?.eventId) {
      fetchData();
      setLoading(false);
    }
  }, [eventSelector?.eventId]); // Dependency array to re-run effect when eventSelector?.eventId changes

  // Function to count participants registered on a specific date
  //
  const countParticipantsForDate = (date) => {
    return participants.filter(
      (participant) =>
        isSameDay(new Date(participant.userRegistrationDate), date) &&
        // && participant.paymentData?.state === "COMPLETED"
        participant.paymentData?.data?.state === "COMPLETED"
    ).length;
  };
  const downloadExcel = () => {
    const data = datesList
      .map((date) => {
        const numParticipants = countParticipantsForDate(date);
        if (numParticipants > 0) {
          return {
            Date: date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            Participants: numParticipants,
            Amount:
              // numParticipants * eventData?.eventPrice -
              // numParticipants * (eventData?.eventPrice * 0.02 + 5)
              // (numParticipants * eventData?.eventPrice).toFixed(2),
              numParticipants * eventData?.eventPrice -
              numParticipants * (eventData?.eventPrice * 0.02).toFixed(2),
          };
        }
        return null;
      })
      .filter(Boolean);

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Financial Report");

    XLSX.writeFile(workbook, "Financial_Report.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableData = datesList
      .map((date) => {
        const numParticipants = countParticipantsForDate(date);
        if (numParticipants > 0) {
          return [
            date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
            numParticipants,
            // numParticipants * eventData?.eventPrice -
            // numParticipants * (eventData?.eventPrice * 0.02 + 5)
            // (numParticipants * eventData?.eventPrice).toFixed(2),
            numParticipants * eventData?.eventPrice -
              numParticipants * (eventData?.eventPrice * 0.02).toFixed(2),
          ];
        }
        return null;
      })
      .filter(Boolean);

    doc.autoTable({
      head: [["Date", "Participants", "Amount"]],
      body: tableData,
    });

    doc.save("Financial_Report.pdf");
  };

  if (loading) return;
  return (
    <>
      <h1 className="text-3xl text-center text-indigo-600 my-5 font-semibold">
        Financial reports
      </h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={downloadExcel}
          className="text-white bg-indigo-600 p-2 rounded-md hover:bg-indigo-700 flex items-center mr-2"
        >
          <FiDownload className="mr-2" />
          Download Excel
        </button>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-lg flex items-center hover:bg-blue-600"
          onClick={downloadPDF}
        >
          <FiDownload className="mr-2" />
          Download PDF
        </button>
      </div>
      <table className="min-w-full bg-gray-800 text-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-700">
          <tr>
            <th className="py-3 px-6 text-left border-b border-gray-600">
              Date
            </th>
            <th className="py-3 px-6 text-left border-b border-gray-600">
              No. of Participants
            </th>
            <th className="py-3 px-6 text-left border-b border-gray-600">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-400">
          {datesList.map((date, index) => {
            const numParticipants = countParticipantsForDate(date);
            if (numParticipants > 0) {
              return (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="py-4 px-6 border-b border-gray-600">
                    {console.log("Date:", date)}
                    {date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-600">
                    {numParticipants}
                  </td>
                  <td className="py-4 px-6 border-b border-gray-600">
                    ₹
                    {/* {(
                      numParticipants * eventData?.eventPrice -
                      (
                        numParticipants *
                        (eventData?.eventPrice * 0.02 + 5)
                      ).toFixed(2)
                    ).toFixed(2)} */}
                    {(
                      numParticipants * eventData?.eventPrice -
                      numParticipants * (eventData?.eventPrice * 0.02)
                    ).toFixed(2)}
                  </td>
                </tr>
              );
            } else {
              return null; // Skip rendering rows with zero participants
            }
          })}
        </tbody>
      </table>
    </>
  );
};

export default FinancialReports;
