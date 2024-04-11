import io from "socket.io-client";
const socket = io.connect("http://localhost:3000");

export default function Root() {
  const sendMessage = () => {
    socket.emit();
    console.log("hello");
  };
  return (
    <>
      <div id="sidebar">
        <div>
          <input type="text" />
          <button onClick={sendMessage()}>message</button>
        </div>
      </div>
    </>
  );
}
