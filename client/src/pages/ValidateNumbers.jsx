import React, { useEffect } from "react";

export default function ValidateNumbers({ socket }) {
  useEffect(() => {
    socket.emit("get_all_contacts", { profilePicUrl: false });
  }, []);
  return <div>ValidateNumbers</div>;
}
