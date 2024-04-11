import { useEffect, useState } from "react";
import { socket } from "../socket";
export default function Root() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [clientId, setClientId] = useState(null);
  const [allMessage, setAllMessage] = useState([]);
  const [inputMsg, setInputMsg] = useState("");

  const sendMessage = () => {
    socket.emit("msg_sent_evnt", { clientId, msg: inputMsg });
    setAllMessage((prev) => [
      ...prev,
      { clientId, msg: inputMsg, resType: "client" },
    ]);
  };

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      setClientId(socket.id);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("emt_rcv_msg", (data) => {
      setAllMessage((prev) => [...prev, data]);
    });

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [socket]);

  return (
    <>
      <div className="flex justify-center items-center h-screen w-screen ">
        <div className="border border-gray-200 w-96 h-96 rounded-xl relative">
          <div className="p-2 font-bold font-mono underline text-gray-800 flex justify-between">
            <h1>Chat Application</h1>
            {isConnected ? (
              <div className="bg-green-500 rounded-full p-[12px]"></div>
            ) : (
              <div className="bg-red-500 rounded-full p-[12px]"></div>
            )}
          </div>
          <div className="h-2/3 relative overflow-y-scroll flex flex-col gap-2">
            {allMessage.length === 0 && (
              <div>
                <h1 className="text-center font-medium text-gray-400">
                  No message ongoing!
                </h1>
              </div>
            )}
            {allMessage.map((el, index) => (
              <div
                key={index}
                className={`px-5 ${
                  el.resType === "client"
                    ? "flex justify-end"
                    : "flex justify-start"
                }`}
              >
                <h1 className="border p-2 rounded-lg px-5 break-all">
                  {el.msg}
                </h1>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 w-full px-4 pb-4">
            <div className="flex">
              <input
                onChange={(e) => setInputMsg(e.target.value)}
                className="border p-2 rounded-l-md w-full font-medium"
                type="text"
              />
              <button
                onClick={() => sendMessage()}
                className="bg-gray-200 p-2 rounded-r-md px-6 font-bold text-gray-500"
              >
                send
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
