import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { format, eachDayOfInterval, parseISO, isSameDay } from "date-fns";

const FinancialReports = () => {
  const eventSelector = useSelector((state) => state.eventId.value);
  const [eventData, setEventData] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [datesList, setDatesList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to generate list of dates between start and end date
  const DateList = (start, end) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const tempDatesList = [];

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
        console.log("Event Data:", eventResponse.data.data);
        setEventData(eventResponse.data.data);

        const participantsResponse = await axios.get(
          `https://tesract-server.onrender.com/participants/event/${eventSelector?.eventId}`
        );
        console.log("Participants Data:", participantsResponse.data);
        setParticipants(participantsResponse.data);

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
  const countParticipantsForDate = (date) => {
    return participants.filter((participant) =>
      isSameDay(new Date(participant.userRegistrationDate), date)
    ).length;
  };

  if (loading) return;
  return (
    <>
      <h1 className="text-3xl text-center text-indigo-600 my-5 font-semibold">
        Financial reports
      </h1>
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
                    {(
                      numParticipants *
                      (eventData?.eventPrice * 0.02 + 5)
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
