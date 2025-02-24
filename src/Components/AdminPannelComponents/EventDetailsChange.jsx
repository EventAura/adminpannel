import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const EventDetailsChange = ({ viewMode = false }) => {
  // Add viewMode prop
  const navigate = useNavigate();
  const eventSelector = useSelector((state) => state.eventId.value);
  const [eventName, setEventName] = useState("");
  const [eventHostedBy, setEventHostedBy] = useState("");
  const [eventSpeaker, setEventSpeaker] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [price, setPrice] = useState("");
  const [eventVenueUrl, setEventVenueUrl] = useState("");
  const [eventManagerMail, setEventManagerMail] = useState("");
  const [eventManagerPhone, setEventManagerPhone] = useState("");
  const [eventManagerUPI, setEventManagerUPI] = useState("");
  const [eventAdminPassword, setEventAdminPassword] = useState("");
  const [eventDate, setEventDate] = useState(null);
  const [eventLastDate, setEventLastDate] = useState(null);
  const [messageDate, setMessageDate] = useState("");
  const [messageLastDate, setMessageLastDate] = useState("");
  const [spinner, setSpinner] = useState(false);
  const [eventMailDescription, setEventMailDescription] = useState("");
  const [freeEventCheckbox, setFreeEventCheckbox] = useState(false);
  const [isVirtual, setIsVirtual] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [eventStaus, setEventStatus] = useState("");

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.eventaura.tech/event/${eventSelector?.eventId}`
        );
        const event = response.data.data;
        setEventName(event.eventName);
        setEventHostedBy(event.eventHostedBy);
        setEventSpeaker(event.eventSpeaker);
        setEventDescription(event.eventDescription);
        setEventVenue(event.eventVenue);
        setPrice(event.eventPrice);
        setEventVenueUrl(event.eventVenueUrl);
        setEventManagerMail(event.eventManagerMail);
        setEventManagerPhone(event.eventManagerPhone);
        setEventManagerUPI(event.eventPaymentUpi);
        setEventAdminPassword(""); // Do not pre-fill the password
        setEventDate(new Date(event.eventDate));
        setEventLastDate(new Date(event.eventLastDate));
        setEventMailDescription(event.eventMailDescription);
        setIsVirtual(event.eventVenue === "Online Event");
        setFreeEventCheckbox(event.eventPrice === "0");
        setEventStatus(event.eventStaus);
      } catch (error) {
        console.error(error);
      }
    };
    fetchEventDetails();
  }, [eventSelector?.eventId]);

  const handleEventLastDate = (date) => {
    const currentDate = Date.now();

    // if (date < currentDate) {
    //   setMessageLastDate("Please select a date after the current date");
    //   setEventLastDate(null);
    // } else if (eventDate && date > eventDate) {
    //   setMessageLastDate("Please select a date before or on the event date");
    //   setEventLastDate(null);
    // } else {
    setEventLastDate(date);
    setMessageLastDate("");
    // }
  };

  const handleEventDate = (date) => {
    if (date < new Date()) {
      setMessageDate("Please select a future date");
      setEventDate(null);
      return;
    }
    setEventDate(date);
    setMessageDate("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (eventMailDescription.trim() === "") {
      setValidationError("This field is required.");
      return;
    }
    setSpinner(true);

    const data = {
      eventName,
      eventDescription,
      eventVenue,
      eventVenueUrl,

      eventDate,
      eventLastDate,
      eventHostedBy,
      eventSpeaker,
      eventMailDescription,
    };

    try {
      const response = await axios.patch(
        `https://api.eventaura.tech/event/${eventSelector?.eventId}`,
        data
      );
      // console.log(response);
      if (response.status === 200) {
        alert("Event Details Updated Successfully");
        setSpinner(false);
      } else {
        alert("Error in updating event details");
        setSpinner(false);
      }
    } catch (error) {
      console.log(error);
      setSpinner(false);
    }
  };

  return (
    <main className="w-auto h-auto flex flex-col items-center justify-center pt-5 mx-5 md:m-0">
      <div className="max-w-2xl w-full text-white">
        <div className="text-center pb-8">
          <h3 className="text-3xl font-bold sm:text-4xl">
            Edit Your Event Details
          </h3>
          <p className="mt-2 text-lg">Update the details of your event below</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4"
        >
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">Event Name</label>
            <input
              type="text"
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg bg-gray-500 text-gray-100 focus:outline-none focus:ring-indigo-500 focus:ring-1 disabled:opacity-50"
              disabled
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Event Description
            </label>
            <textarea
              id="eventDescription"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              required
              className={`w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-indigo-500 focus:ring-1 ${
                viewMode ? "bg-gray-500 cursor-not-allowed" : ""
              }`}
              disabled={viewMode}
            />
          </div>

          <div className="md:col-span-2 text-gray-100">
            <label className="block text-sm font-medium mb-2">
              Event Mail Description
            </label>
            <p className="block text-sm font-medium mb-2">
              (The same message will be sent to the registered users via email)
            </p>
            <ReactQuill
              value={eventMailDescription}
              onChange={(content, delta, source, editor) => {
                setEventMailDescription(editor.getHTML());
                setValidationError(""); // Clear error when user starts typing
              }}
              modules={{
                toolbar: [
                  [{ header: "1" }, { header: "2" }, { font: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  ["bold", "italic", "underline", "strike"],
                  [{ color: [] }, { background: [] }],
                  [{ align: [] }],
                  ["blockquote", "code-block"],
                  [{ script: "sub" }, { script: "super" }],
                  [{ indent: "-1" }, { indent: "+1" }],
                  [{ direction: "rtl" }],
                  ["clean"],
                ],
              }}
              formats={[
                "header",
                "font",
                "list",
                "bullet",
                "bold",
                "italic",
                "underline",
                "strike",
                "color",
                "background",
                "align",
                "blockquote",
                "code-block",
                "script",
                "indent",
                "direction",
                "clean",
              ]}
              placeholder="Compose an epic..."
              className="w-full rounded-2xl text-gray-100 focus:outline-none focus:ring-indigo-500 focus:ring-1"
              readOnly={viewMode}
            />
            {validationError && (
              <div className="text-red-500 text-sm mt-2">{validationError}</div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Event Hosted By
            </label>
            <input
              type="text"
              id="eventHostedBy"
              value={eventHostedBy}
              onChange={(e) => setEventHostedBy(e.target.value)}
              required
              className={`w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-indigo-500 focus:ring-1 ${
                viewMode ? "bg-gray-500 cursor-not-allowed" : ""
              }`}
              disabled={viewMode}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Event Speaker
            </label>
            <input
              type="text"
              id="eventSpeaker"
              placeholder="Name of the speaker (if any)"
              value={eventSpeaker}
              onChange={(e) => setEventSpeaker(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-indigo-500 focus:ring-1 ${
                viewMode ? "bg-gray-500 cursor-not-allowed" : ""
              }`}
              disabled={viewMode}
            />
          </div>
          <div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Event Venue
              </label>
              <input
                type="text"
                id="eventVenue"
                value={eventVenue}
                onChange={(e) => setEventVenue(e.target.value)}
                required
                className={`w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-indigo-500 focus:ring-1 ${
                  viewMode || isVirtual ? "bg-gray-500 cursor-not-allowed" : ""
                }`}
                disabled={viewMode || isVirtual}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Event Venue URL
            </label>
            <input
              type="url"
              id="eventVenueUrl"
              value={eventVenueUrl}
              onChange={(e) => setEventVenueUrl(e.target.value)}
              placeholder="https://example.com (Google Maps URL)"
              className={`w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-indigo-500 focus:ring-1 ${
                viewMode || isVirtual ? "bg-gray-500 cursor-not-allowed" : ""
              }`}
              disabled={viewMode || isVirtual}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder=""
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-indigo-500 focus:ring-1 disabled:opacity-50"
              pattern="^[0-9]+$"
              title="Please enter a valid price (numbers only)"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Event Date</label>
            <DatePicker
              selected={eventDate}
              onChange={handleEventDate}
              dateFormat="yyyy-MM-dd"
              className={`w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-indigo-500 focus:ring-1 ${
                viewMode ? "bg-gray-500 cursor-not-allowed" : ""
              }`}
              disabled={viewMode}
            />
          </div>
          <div className="md:col-span-2">
            <span className="block py-2 text-red-600">{messageDate}</span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Event Last Date for Registrations
            </label>
            <DatePicker
              selected={eventLastDate}
              onChange={handleEventLastDate}
              dateFormat="yyyy-MM-dd"
              className={`w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-100 focus:outline-none focus:ring-indigo-500 focus:ring-1 ${
                viewMode ? "bg-gray-500 cursor-not-allowed" : ""
              }`}
              disabled={eventDate === null || viewMode}
            />
          </div>
          <div className="md:col-span-2">
            <span className="block py-2 text-red-600">{messageLastDate}</span>
          </div>

          {!viewMode && (
            <button
              type="submit"
              className="md:col-span-2 w-full flex justify-center bg-indigo-500 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              {spinner ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Update Your Event Details"
              )}
            </button>
          )}
        </form>
      </div>
    </main>
  );
};

export default EventDetailsChange;
