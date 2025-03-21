// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { Bar } from "react-chartjs-2";
// import * as XLSX from "xlsx";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const Overview = () => {
//   const eventSelector = useSelector((state) => state.eventId.value);
//   const [eventData, setEventData] = useState(null);
//   const [eventParticipants, setEventParticipants] = useState([]);

//   const countParticipantsBetweenDates = (participants, startDate, endDate) => {
//     return participants.filter((participant) => {
//       const registrationDate = new Date(participant.userRegistrationDate);
//       return (
//         registrationDate >= new Date(startDate) &&
//         registrationDate <= new Date(endDate) &&
//         participant.paymentData?.data?.state === "COMPLETED"
//       );
//     }).length;
//   };

//   const totalSales = (price, participants, startDate, endDate) => {
//     const totalParticipants = countParticipantsBetweenDates(
//       participants,
//       startDate,
//       endDate
//     );
//     const totalRevenue = price * totalParticipants;

//     const percentageDeduction = totalRevenue * 0.02;
//     const fixedDeduction = totalParticipants * 5;

//     const finalTotal = totalRevenue - (percentageDeduction + fixedDeduction);
//     // const finalTotal = totalRevenue - percentageDeduction;

//     return finalTotal.toLocaleString();
//   };

//   // const getTodayParticipants = (participants) => {
//   //   const today = new Date();
//   //   return participants.filter((participant) => {
//   //     const registrationDate = new Date(participant.userRegistrationDate);
//   //     return (
//   //       registrationDate.getDate() === today.getDate() &&
//   //       registrationDate.getMonth() === today.getMonth() &&
//   //       registrationDate.getFullYear() === today.getFullYear()
//   //     );
//   //   });
//   // };

//   const downloadExcel = () => {
//     const data = eventParticipants.map((participant) => ({
//       Name: participant.name,
//       Email: participant.email,
//       College: participant.college,
//       "Roll Number": participant.rollNumber,
//       "Phone Number": participant.phoneNumber,
//       "Event Name": participant.eventName,
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
//     XLSX.writeFile(workbook, "Participants.xlsx");
//   };

//   const downloadPDF = () => {
//     const doc = new jsPDF();
//     const tableData = eventParticipants.map((participant) => [
//       participant.name,
//       participant.email,
//       participant.college,
//       participant.rollNumber,
//       participant.phoneNumber,
//       participant.eventName,
//     ]);

//     doc.text("Participants List", 14, 16);
//     doc.autoTable({
//       head: [
//         [
//           "Name",
//           "Email",
//           "College",
//           "Roll Number",
//           "Phone Number",
//           "Event Name",
//         ],
//       ],
//       body: tableData,
//     });

//     doc.save("Participants.pdf");
//   };

//   const onboardedCount = eventParticipants.filter(
//     (participant) => participant.userEntryStatus === "true"
//   ).length;

//   const getTodayParticipants = (participants) => {
//     const today = new Date();
//     return participants.filter((participant) => {
//       const registrationDate = new Date(participant.userRegistrationDate);
//       return (
//         registrationDate.getDate() === today.getDate() &&
//         registrationDate.getMonth() === today.getMonth() &&
//         registrationDate.getFullYear() === today.getFullYear() &&
//         participant.paymentData?.data?.state === "COMPLETED"
//       );
//     }).length;
//   };

//   useEffect(() => {
//     const fetchEventData = async () => {
//       try {
//         const eventResponse = await axios.get(
//           `https://api.eventaura.tech/event/${eventSelector.eventId}`
//         );
//         setEventData(eventResponse.data.data);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     const fetchParticipantsData = async () => {
//       try {
//         const participantsResponse = await axios.get(
//           `https://api.eventaura.tech/participants/event/${eventSelector.eventId}`
//         );
//         setEventParticipants(participantsResponse.data);
//       } catch (error) {
//         console.log(error);
//       }
//     };

//     fetchEventData();
//     fetchParticipantsData();
//   }, [eventSelector.eventId]);

//   const getParticipantsByDate = (participants) => {
//     const paidParticipants = participants.filter(
//       (p) => p.paymentData?.data?.state === "COMPLETED"
//     );

//     const dateCount = paidParticipants.reduce((acc, p) => {
//       const registrationDate = new Date(p.userRegistrationDate).toDateString();
//       acc[registrationDate] = (acc[registrationDate] || 0) + 1;
//       return acc;
//     }, {});

//     const labels = Object.keys(dateCount);
//     const data = Object.values(dateCount);

//     return { labels, data };
//   };

//   const participantsWithUserEntry = eventParticipants.filter(
//     (participant) => participant.userEntryStatus === "true"
//   );

//   return (
//     <>
//       {eventParticipants.length > 0 && eventData ? (
//         <div className="flex flex-col space-y-6 p-6 rounded-lg shadow-md max-h max-w">
//           {/* Row - 1: Update Event Details */}
//           <div className="flex space-x-6">
//             <div className="bg-gray-900 p-6 rounded-lg shadow-md flex-1">
//               <h2 className="text-lg font-semibold text-gray-100">
//                 Welcome Back <br />{" "}
//                 <span className="text-indigo-600 font-bold text-xl py-2">
//                   {eventData?.eventName}
//                 </span>
//               </h2>
//               <p className="text-gray-100">
//                 <span className="font-semibold">
//                   Last Date for Registrations:
//                 </span>{" "}
//                 {new Date(eventData?.eventLastDate).toDateString()}
//               </p>
//               <p className="text-gray-100">
//                 Event Price: ₹{eventData?.eventPrice}
//               </p>
//             </div>
//           </div>

//           {/* First Row */}
//           <div className="flex space-x-6">
//             <div className="bg-gray-800 p-6 rounded-lg shadow-md flex-1">
//               <h2 className="text-lg font-semibold text-gray-100 mb-2">
//                 Number of Participants
//               </h2>
//               <div className="flex items-center space-x-4">
//                 <span className="text-4xl font-extrabold text-blue-500">
//                   {countParticipantsBetweenDates(
//                     eventParticipants,
//                     eventData?.eventCreatedDate,
//                     eventData?.eventLastDate
//                   )}
//                 </span>
//                 <div className="flex flex-col text-sm text-gray-300">
//                   <span className="leading-tight">Total</span>
//                   <span className="leading-tight">Participants (Paid)</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-800 p-6 rounded-lg shadow-md flex-1">
//               <h2 className="text-lg font-semibold text-gray-100 mb-2">
//                 Total Sales
//               </h2>
//               <div className="flex items-center space-x-4">
//                 <span className="text-4xl font-extrabold text-green-500">
//                   ₹
//                   {totalSales(
//                     eventData?.eventPrice,
//                     eventParticipants,
//                     eventData?.eventCreatedDate,
//                     eventData?.eventLastDate
//                   )}
//                 </span>
//                 <div className="flex flex-col text-sm text-gray-300">
//                   <span className="leading-tight">Total</span>
//                   <span className="leading-tight">Revenue</span>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-gray-800 p-6 rounded-lg shadow-md flex-1">
//               <h2 className="text-base font-semibold text-gray-100 mb-2">
//                 Participants Registered Today
//               </h2>
//               <div className="flex items-center space-x-4">
//                 <span className="text-4xl font-extrabold text-purple-500">
//                   {getTodayParticipants(
//                     eventParticipants,
//                     eventData?.eventCreatedDate,
//                     eventData?.eventLastDate
//                   )}
//                 </span>
//                 <div className="flex flex-col text-sm text-gray-300">
//                   <span className="leading-tight">New</span>
//                   <span className="leading-tight">Registrations</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Second Row */}
//           <div className="flex flex-col space-y-6 p-6 rounded-lg shadow-md max-h max-w">
//             <div className="flex space-x-6">
//               <div className="bg-gray-800 p-6 rounded-lg shadow-md flex-1">
//                 <h2 className="text-lg font-semibold text-gray-100 mb-4">
//                   Participants by Date (Paid)
//                 </h2>
//                 <Bar
//                   data={{
//                     labels: getParticipantsByDate(eventParticipants).labels,
//                     datasets: [
//                       {
//                         label: "Participants (Paid)",
//                         data: getParticipantsByDate(eventParticipants).data,
//                         backgroundColor: "rgba(75, 192, 192, 0.6)",
//                         borderColor: "rgba(75, 192, 192, 1)",
//                         borderWidth: 1,
//                       },
//                     ],
//                   }}
//                   options={{
//                     responsive: true,
//                     plugins: {
//                       legend: {
//                         position: "top",
//                       },
//                       title: {
//                         display: true,
//                         text: "Participants Over Time",
//                       },
//                     },
//                     scales: {
//                       x: { title: { display: true, text: "Dates" } },
//                       y: {
//                         title: {
//                           display: true,
//                           text: "Number of Participants",
//                         },
//                       },
//                     },
//                   }}
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Third Row */}
//           <div className="bg-gray-800 p-6 rounded-lg shadow-md">
//             <h2 className="text-lg font-semibold text-gray-100">
//               Recent Participants
//             </h2>
//             <div className="overflow-x-auto mt-4">
//               <table className="table-auto w-full text-gray-100">
//                 <thead>
//                   <tr className="bg-gray-600">
//                     <th className="px-4 py-2 border border-gray-500">Name</th>
//                     <th className="px-4 py-2 border border-gray-500">Email</th>
//                     <th className="px-4 py-2 border border-gray-500">
//                       Payment Status
//                     </th>
//                     <th className="px-4 py-2 border border-gray-500">
//                       Transaction ID
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {eventParticipants.slice(0, 3).map((participant, index) => (
//                     <tr key={index} className="hover:bg-gray-600">
//                       <td className="border px-4 py-2 border-gray-500">
//                         {participant.name}
//                       </td>
//                       <td className="border px-4 py-2 border-gray-500">
//                         {participant.email}
//                       </td>
//                       <td className="border px-4 py-2 border-gray-500">
//                         {participant.paymentData?.data?.state === "PENDING"
//                           ? "PENDING"
//                           : participant.paymentData?.data?.state === "COMPLETED"
//                           ? "PAID"
//                           : participant.paymentData?.data?.state === "FAILED"
//                           ? "Failed"
//                           : "FAILED"}
//                       </td>
//                       <td className="border px-4 py-2 border-gray-500">
//                         {participant.paymentData?.data?.transactionId
//                           ? participant.paymentData?.data?.transactionId
//                           : "NULL"}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//           <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-8">
//             <h2 className="text-lg font-semibold text-gray-100 mb-4">
//               Participants with User Entry Status (True)
//             </h2>
//             <div>
//               <div className="flex space-x-4 mt-6 mb-4">
//                 <button
//                   onClick={downloadExcel}
//                   className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//                 >
//                   Download Excel
//                 </button>
//                 <button
//                   onClick={downloadPDF}
//                   className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//                 >
//                   Download PDF
//                 </button>
//                 <div className="text-lg text-gray-100 font-bold">
//                   Onboarded Participants: {onboardedCount}
//                 </div>
//               </div>
//             </div>
//             <div className="overflow-x-auto">
//               <table className="table-auto w-full text-gray-100">
//                 <thead>
//                   <tr className="bg-gray-600">
//                     <th className="px-4 py-2 border border-gray-500">Name</th>
//                     <th className="px-4 py-2 border border-gray-500">Email</th>
//                     <th className="px-4 py-2 border border-gray-500">
//                       College
//                     </th>
//                     <th className="px-4 py-2 border border-gray-500">
//                       Roll Number
//                     </th>
//                     <th className="px-4 py-2 border border-gray-500">
//                       Phone Number
//                     </th>
//                     <th className="px-4 py-2 border border-gray-500">
//                       Event Name
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {participantsWithUserEntry.length > 0 ? (
//                     participantsWithUserEntry.map((participant, index) => (
//                       <tr key={index} className="hover:bg-gray-600">
//                         <td className="border px-4 py-2 border-gray-500">
//                           {participant.name}
//                         </td>
//                         <td className="border px-4 py-2 border-gray-500">
//                           {participant.email}
//                         </td>
//                         <td className="border px-4 py-2 border-gray-500">
//                           {participant.college}
//                         </td>
//                         <td className="border px-4 py-2 border-gray-500">
//                           {participant.rollNumber}
//                         </td>
//                         <td className="border px-4 py-2 border-gray-500">
//                           {participant.phoneNumber}
//                         </td>
//                         <td className="border px-4 py-2 border-gray-500">
//                           {participant.eventName}
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td
//                         colSpan="6"
//                         className="text-center py-4 text-gray-300"
//                       >
//                         No participants with user entry status.
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="flex flex-col justify-center items-center h-screen">
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 100 100"
//             preserveAspectRatio="xMidYMid"
//             width="100"
//             height="100"
//             style={{
//               shapeRendering: "auto",
//               display: "block",
//             }}
//             className="mb-4"
//           >
//             <circle
//               cx="50"
//               cy="50"
//               r="23"
//               strokeDasharray="108.38494654884786 38.12831551628262"
//               strokeWidth="4"
//               stroke="#3949ab"
//               fill="none"
//             >
//               <animateTransform
//                 attributeName="transform"
//                 type="rotate"
//                 repeatCount="indefinite"
//                 dur="0.9174311926605504s"
//                 values="0 50 50;360 50 50"
//                 keyTimes="0;1"
//               />
//             </circle>
//           </svg>
//           <h2 className="text-xl font-semibold text-gray-100 mt-4">
//             Analyzing Your Dashboard 🎇
//           </h2>
//         </div>
//       )}
//     </>
//   );
// };

// export default Overview;





import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import * as XLSX from "xlsx";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import jsPDF from "jspdf";
import "jspdf-autotable";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Overview = () => {
  const eventSelector = useSelector((state) => state.eventId.value);
  const [eventData, setEventData] = useState(null);
  const [eventParticipants, setEventParticipants] = useState([]);

  const countParticipantsBetweenDates = (participants, startDate, endDate) => {
    return participants.filter((participant) => {
      const registrationDate = new Date(participant.userRegistrationDate);
      return (
        registrationDate >= new Date(startDate) &&
        registrationDate <= new Date(endDate) &&
        participant.paymentData?.data?.state === "COMPLETED"
      );
    }).length;
  };

  const totalSales = (price, participants, startDate, endDate) => {
    const totalParticipants = countParticipantsBetweenDates(
      participants,
      startDate,
      endDate
    );
    const totalRevenue = price * totalParticipants;

    const percentageDeduction = totalRevenue * 0.02;
    const fixedDeduction = totalParticipants * 5;

    const finalTotal = totalRevenue - (percentageDeduction + fixedDeduction);
    return finalTotal.toLocaleString();
  };

  const downloadExcel = () => {
    const participantsWithUserEntry = eventParticipants.filter(
      (participant) => participant.userEntryStatus === "true"
    );

    const data = participantsWithUserEntry.map((participant) => ({
      Name: participant.name,
      Email: participant.email,
      College: participant.college,
      "Roll Number": participant.rollNumber,
      "Phone Number": participant.phoneNumber,
      "Event Name": participant.eventName,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Participants");
    XLSX.writeFile(workbook, "Participants.xlsx");
  };

  const downloadPDF = () => {
    const participantsWithUserEntry = eventParticipants.filter(
      (participant) => participant.userEntryStatus === "true"
    );

    const doc = new jsPDF();
    const tableData = participantsWithUserEntry.map((participant) => [
      participant.name,
      participant.email,
      participant.college,
      participant.rollNumber,
      participant.phoneNumber,
      participant.eventName,
    ]);

    doc.text("Participants List", 14, 16);
    doc.autoTable({
      head: [
        [
          "Name",
          "Email",
          "College",
          "Roll Number",
          "Phone Number",
          "Event Name",
        ],
      ],
      body: tableData,
    });

    doc.save("Participants.pdf");
  };

  const onboardedCount = eventParticipants.filter(
    (participant) => participant.userEntryStatus === "true"
  ).length;

  const getTodayParticipants = (participants) => {
    const today = new Date();
    return participants.filter((participant) => {
      const registrationDate = new Date(participant.userRegistrationDate);
      return (
        registrationDate.getDate() === today.getDate() &&
        registrationDate.getMonth() === today.getMonth() &&
        registrationDate.getFullYear() === today.getFullYear() &&
        participant.paymentData?.data?.state === "COMPLETED"
      );
    }).length;
  };

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventResponse = await axios.get(
          `https://api.eventaura.tech/event/${eventSelector.eventId}`
        );
        setEventData(eventResponse.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchParticipantsData = async () => {
      try {
        const participantsResponse = await axios.get(
          `https://api.eventaura.tech/participants/event/${eventSelector.eventId}`
        );
        setEventParticipants(participantsResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchEventData();
    fetchParticipantsData();
  }, [eventSelector.eventId]);

  const getParticipantsByDate = (participants) => {
    const paidParticipants = participants.filter(
      (p) => p.paymentData?.data?.state === "COMPLETED"
    );

    const dateCount = paidParticipants.reduce((acc, p) => {
      const registrationDate = new Date(p.userRegistrationDate).toDateString();
      acc[registrationDate] = (acc[registrationDate] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(dateCount);
    const data = Object.values(dateCount);

    return { labels, data };
  };

  const participantsWithUserEntry = eventParticipants.filter(
    (participant) => participant.userEntryStatus === "true"
  );

  return (
    <>
      {eventParticipants.length > 0 && eventData ? (
        <div className="flex flex-col space-y-6 p-6 rounded-lg shadow-md max-h max-w">
          {/* Row - 1: Update Event Details */}
          <div className="flex space-x-6">
            <div className="bg-gray-900 p-6 rounded-lg shadow-md flex-1">
              <h2 className="text-lg font-semibold text-gray-100">
                Welcome Back <br />{" "}
                <span className="text-indigo-600 font-bold text-xl py-2">
                  {eventData?.eventName}
                </span>
              </h2>
              <p className="text-gray-100">
                <span className="font-semibold">
                  Last Date for Registrations:
                </span>{" "}
                {new Date(eventData?.eventLastDate).toDateString()}
              </p>
              <p className="text-gray-100">
                Event Price: ₹{eventData?.eventPrice}
              </p>
            </div>
          </div>

          {/* First Row */}
          <div className="flex space-x-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md flex-1">
              <h2 className="text-lg font-semibold text-gray-100 mb-2">
                Number of Participants
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-extrabold text-blue-500">
                  {countParticipantsBetweenDates(
                    eventParticipants,
                    eventData?.eventCreatedDate,
                    eventData?.eventLastDate
                  )}
                </span>
                <div className="flex flex-col text-sm text-gray-300">
                  <span className="leading-tight">Total</span>
                  <span className="leading-tight">Participants (Paid)</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-md flex-1">
              <h2 className="text-lg font-semibold text-gray-100 mb-2">
                Total Sales
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-extrabold text-green-500">
                  ₹
                  {totalSales(
                    eventData?.eventPrice,
                    eventParticipants,
                    eventData?.eventCreatedDate,
                    eventData?.eventLastDate
                  )}
                </span>
                <div className="flex flex-col text-sm text-gray-300">
                  <span className="leading-tight">Total</span>
                  <span className="leading-tight">Revenue</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg shadow-md flex-1">
              <h2 className="text-base font-semibold text-gray-100 mb-2">
                Participants Registered Today
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-4xl font-extrabold text-purple-500">
                  {getTodayParticipants(eventParticipants)}
                </span>
                <div className="flex flex-col text-sm text-gray-300">
                  <span className="leading-tight">New</span>
                  <span className="leading-tight">Registrations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="flex flex-col space-y-6 p-6 rounded-lg shadow-md max-h max-w">
            <div className="flex space-x-6">
              <div className="bg-gray-800 p-6 rounded-lg shadow-md flex-1">
                <h2 className="text-lg font-semibold text-gray-100 mb-4">
                  Participants by Date (Paid)
                </h2>
                <Bar
                  data={{
                    labels: getParticipantsByDate(eventParticipants).labels,
                    datasets: [
                      {
                        label: "Participants (Paid)",
                        data: getParticipantsByDate(eventParticipants).data,
                        backgroundColor: "rgba(75, 192, 192, 0.6)",
                        borderColor: "rgba(75, 192, 192, 1)",
                        borderWidth: 1,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: "top",
                      },
                      title: {
                        display: true,
                        text: "Participants Over Time",
                      },
                    },
                    scales: {
                      x: { title: { display: true, text: "Dates" } },
                      y: {
                        title: {
                          display: true,
                          text: "Number of Participants",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Third Row */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-gray-100">
              Recent Participants
            </h2>
            <div className="overflow-x-auto mt-4">
              <table className="table-auto w-full text-gray-100">
                <thead>
                  <tr className="bg-gray-600">
                    <th className="px-4 py-2 border border-gray-500">Name</th>
                    <th className="px-4 py-2 border border-gray-500">Email</th>
                    <th className="px-4 py-2 border border-gray-500">
                      Payment Status
                    </th>
                    <th className="px-4 py-2 border border-gray-500">
                      Transaction ID
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {eventParticipants.slice(0, 3).map((participant, index) => (
                    <tr key={index} className="hover:bg-gray-600">
                      <td className="border px-4 py-2 border-gray-500">
                        {participant.name}
                      </td>
                      <td className="border px-4 py-2 border-gray-500">
                        {participant.email}
                      </td>
                      <td className="border px-4 py-2 border-gray-500">
                        {participant.paymentData?.data?.state === "PENDING"
                          ? "PENDING"
                          : participant.paymentData?.data?.state === "COMPLETED"
                          ? "PAID"
                          : participant.paymentData?.data?.state === "FAILED"
                          ? "Failed"
                          : "FAILED"}
                      </td>
                      <td className="border px-4 py-2 border-gray-500">
                        {participant.paymentData?.data?.transactionId
                          ? participant.paymentData?.data?.transactionId
                          : "NULL"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Fourth Row */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-8">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">
              Participants with User Entry Status (True)
            </h2>
            <div>
              <div className="flex space-x-4 mt-6 mb-4">
                <button
                  onClick={downloadExcel}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Download Excel
                </button>
                <button
                  onClick={downloadPDF}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Download PDF
                </button>
                <div className="text-lg text-gray-100 font-bold">
                  Onboarded Participants: {onboardedCount}
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-gray-100">
                <thead>
                  <tr className="bg-gray-600">
                    <th className="px-4 py-2 border border-gray-500">Name</th>
                    <th className="px-4 py-2 border border-gray-500">Email</th>
                    <th className="px-4 py-2 border border-gray-500">
                      College
                    </th>
                    <th className="px-4 py-2 border border-gray-500">
                      Roll Number
                    </th>
                    <th className="px-4 py-2 border border-gray-500">
                      Phone Number
                    </th>
                    <th className="px-4 py-2 border border-gray-500">
                      Event Name
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {participantsWithUserEntry.length > 0 ? (
                    participantsWithUserEntry.map((participant, index) => (
                      <tr key={index} className="hover:bg-gray-600">
                        <td className="border px-4 py-2 border-gray-500">
                          {participant.name}
                        </td>
                        <td className="border px-4 py-2 border-gray-500">
                          {participant.email}
                        </td>
                        <td className="border px-4 py-2 border-gray-500">
                          {participant.college}
                        </td>
                        <td className="border px-4 py-2 border-gray-500">
                          {participant.rollNumber}
                        </td>
                        <td className="border px-4 py-2 border-gray-500">
                          {participant.phoneNumber}
                        </td>
                        <td className="border px-4 py-2 border-gray-500">
                          {participant.eventName}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="6"
                        className="text-center py-4 text-gray-300"
                      >
                        No participants with user entry status.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
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
            Analyzing Your Dashboard 🎇
          </h2>
        </div>
      )}
    </>
  );
};

export default Overview;