import MaterialTable from "material-table";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import tableIcons from "../components/MaterialTableIcons";

const Admin = () => {
  const [userlist, setUserList] = useState([]);

  const navigate = useNavigate();
  async function getAdmin() {
    const response = await fetch("http://localhost:1590/api/admin/getusers", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });
    const data = await response.json();

    if (data.status === "ok") {
      let userList = data.userList;
      setUserList(userList);
    } else {
      alert("ACCES DENIED");
      navigate("/dashboard", { replace: true });
    }
  }

  async function admin(event) {
    event.preventDefault();
    getAdmin();
  }

  const columns = [
    { title: "Name", field: "name" },
    { title: "Email", field: "email" },
    { title: "Role", field: "role" },
  ];

  return (
    <div>
      <form onSubmit={admin}>
        <input type="submit" value="Get Users" />
      </form>

      <MaterialTable
        title="User List"
        icons={tableIcons}
        columns={columns}
        data={userlist}
      ></MaterialTable>
      {/* <ul>
        {userlist.length > 0 &&
          userlist.map((user) => (
            <li>
              {user.name} {user.email} {user.role}
            </li>
          ))}
      </ul> */}
    </div>
  );
};

export default Admin;
