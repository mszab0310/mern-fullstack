import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [userlist, setUserList] = useState([]);

  const navigate = useNavigate();
  async function getAdmin() {
    const response = await fetch("http://localhost:1590/api/admin/getusers", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    //  let tempArr = list;
    const data = await response.json();

    if (data.status === "ok") {
      let userList = data.userList;
      setUserList(userList);
      console.log(userList[2].name);
    } else {
      alert("ACCES DENIED");
      navigate("/dashboard", { replace: true });
    }
  }

  async function admin(event) {
    event.preventDefault();
    console.log("BUtton");
    getAdmin();
    console.log("returns");
  }
  return (
    <div>
      <form onSubmit={admin}>
        <input type="submit" value="Get Users" />
      </form>
      <ul>
        {userlist.length > 0 &&
          userlist.map((user) => (
            <li>
              {user.name} {user.email} {user.role}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Admin;
