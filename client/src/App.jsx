import io from "socket.io-client";
const socket = io.connect("http://localhost:3000");
function App() {
  const sendMessage = () => {
    socket.emit();
    console.log("hello");
  };
  return (
    <div>
      <input type="text" />
      <button onClick={sendMessage()}>message</button>
    </div>
  );
}

export default App;
