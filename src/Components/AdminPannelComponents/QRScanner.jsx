import  { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";

const QRScanner = () => {
  const [scanResult, setScanResult] = useState(null);
  const [data, setData] = useState("");
  const [userStatus, setUserStatus] = useState(null);
  const [checkConfirmation, setCheckConfirmation] = useState(false);
  const scannerRef = useRef(null);

  // Function to fetch user status based on user ID
  const fetchUserStatus = async (userId) => {
    try {
      const response = await axios.get(
        `https://tesract-server.onrender.com/participant/status/${userId}`
      );
      console.log("User status response:", response);

      // If the response is successful (status code 200), set the user data
      if (response.status === 200) {
        setData(response.data);
        setUserStatus(response.data.userEntryStatus);
      } else if (response.status === 404) {
        // If status code is 404, display no user found message
        setUserStatus("not-found");
      } else if (response.status === 500) {
        // If status code is 500, display error message
        setUserStatus("error");
      }
    } catch (error) {
      console.error("Error fetching user status:", error);
      // Handle network or other errors
      setUserStatus("error");
    }
  };

  // Function to update user status to checked-in
  const updateUserStatus = async (userId) => {
    try {
      const response = await axios.patch(
        `https://tesract-server.onrender.com/participant/updateStatus/${userId}`
      );
      setUserStatus("true");
      setCheckConfirmation(true);
    } catch (error) {
      console.error("Error updating user status:", error);
    }
  };

  // Initialize QR scanner
  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: { width: 400, height: 400 },
      fps: 10,
    });

    scanner.render(
      (result) => {
        setScanResult(result);
        scanner.clear();
      },
      (error) => {
        console.warn("QR Code scan error:", error);
      }
    );

    scannerRef.current = scanner;

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  // Reset the scanner after a scan
  const resetScanner = () => {
    setScanResult(null);
    setUserStatus(null);
    setCheckConfirmation(false);
    if (scannerRef.current) {
      scannerRef.current.clear();
      const scanner = new Html5QrcodeScanner("reader", {
        qrbox: { width: 400, height: 400 },
        fps: 10,
      });
      scanner.render(
        (result) => {
          setScanResult(result);
          scanner.clear();
        },
        (error) => {
          console.warn("QR Code scan error:", error);
        }
      );
      scannerRef.current = scanner;
    }
  };

  // Trigger user status fetch when QR code is scanned
  useEffect(() => {
    if (scanResult) {
      fetchUserStatus(String(scanResult));
    }
  }, [scanResult]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-6">
      <h1 className="text-4xl font-bold text-indigo-600 mb-8 drop-shadow-lg">
        Event Check-In App
      </h1>
      {/* Reader Box */}
      <div
        id="reader"
        className="w-96 h-96 relative bg-gray-800 rounded-lg p-4 shadow-lg"
      >
        <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
          <p className="text-lg text-gray-400 italic">
            Scanning for QR Code...
          </p>
        </div>
      </div>
      {/* Scan Result Section */}
      {scanResult && (
        <div className="mt-8 w-96 bg-gray-800 p-6 rounded-lg shadow-lg text-gray-200">
          {userStatus === "not-found" ? (
            <div>
              <h3 className="text-2xl font-semibold text-red-500">
                ❌ No User Found
              </h3>
              <p className="text-lg text-gray-400 mt-4">
                The scanned QR code does not correspond to any user in the
                system.
              </p>
              <button
                onClick={resetScanner}
                className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all"
              >
                Scan Next
              </button>
            </div>
          ) : userStatus === "error" ? (
            <div>
              <h3 className="text-2xl font-semibold text-yellow-500">
                ⚠️ There is an error scanning this code or the user is not found
              </h3>
              <p className="text-lg text-gray-400 mt-4">
                If this problem persists, please reach out to us.
              </p>
              <button
                onClick={resetScanner}
                className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all"
              >
                Scan Next
              </button>
            </div>
          ) : userStatus ? (
            data?.user?.paymentData?.success ? (
              userStatus === "true" ? (
                <div>
                  <h3 className="text-2xl font-semibold text-green-500">
                    ✅ {data?.user?.name ? data.user.name : "User"} Checked In
                  </h3>
                  <h3 className="text-xl font-semibold">
                    {data?.user?.email ? data.user.email : "N/A"}
                  </h3>
                  <button
                    onClick={resetScanner}
                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all"
                  >
                    Scan Next
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-semibold text-yellow-400">
                    ⚠️ {data?.user?.name ? data.user.name : "User"} Has Not
                    Checked In
                  </h3>
                  <h3 className="text-xl font-semibold">
                    {data?.user?.email ? data.user.email : "N/A"}
                  </h3>
                  {!checkConfirmation ? (
                    <div className="mt-6 flex space-x-4">
                      <button
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all"
                        onClick={() => updateUserStatus(scanResult)}
                      >
                        Check In
                      </button>
                      <button
                        onClick={resetScanner}
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all"
                      >
                        Scan Next
                      </button>
                    </div>
                  ) : (
                    <h3 className="text-lg font-semibold text-blue-400 mt-6">
                      🎉 User Has Been Checked In!
                    </h3>
                  )}
                </div>
              )
            ) : (
              <div>
                <h3 className="text-2xl font-semibold text-red-500">
                  ❌ Payment Failed!{" "}
                  {data?.user?.name ? data.user.name : "User"} Cannot Check In
                </h3>
                <h3 className="text-xl font-semibold">
                  {data?.user?.email ? data.user.email : "N/A"}
                </h3>
                <button
                  onClick={resetScanner}
                  className="mt-6 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all"
                >
                  Scan Next
                </button>
              </div>
            )
          ) : (
            <p className="text-lg text-gray-400 mt-4">Loading user status...</p>
          )}
        </div>
      )}
      {!scanResult && (
        <p className="text-gray-400 text-lg mt-6 italic">
          Point your camera at a QR code to scan.
        </p>
      )}
      {/* Footer */}
      <footer className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          Powered by{" "}
          <span className="font-bold text-indigo-600">Html5-QRCode</span>
        </p>
      </footer>
    </div>
  );
};

export default QRScanner;
