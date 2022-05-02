import MaterialTable from "material-table";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import tableIcons from "../components/MaterialTableIcons";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { InputLabel, MenuItem, Select } from "@material-ui/core";
import Header from "./Navbar";

const Admin = () => {
  const [userlist, setUserList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [currentRole, setCurrentRole] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const userRole = "user";
  const adminRole = "admin";
  const mechanicRole = "mechanic";
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

  async function deleteUser(email) {
    const response = await fetch(
      "http://localhost:1590/api/admin/delete_user",
      {
        method: "DELETE",
        headers: {
          "x-access-token": localStorage.getItem("token"),
          user_email: email,
        },
      }
    );
    const data = await response.json();
    if (!window.confirm("user is about to be deleted" + email)) {
      return;
    }
    if (data.status === "ok") {
      console.log(data.success);
      getAdmin();
    } else {
      alert("Operation failed");
    }
  }

  async function changeUserRole(email, new_role) {
    const response = await fetch(
      "http://localhost:1590/api/admin/update_user_role",
      {
        method: "PUT",
        headers: {
          "x-access-token": localStorage.getItem("token"),
          user_email: email,
          new_role: new_role,
        },
      }
    );
    const data = await response.json();

    if (data.status === "ok") {
      console.log(data.success);
      getAdmin();
    } else {
      alert("Operation failed");
    }
  }

  function deleteUserButton(email) {
    deleteUser(email);
  }

  const handleClickOpen = (role, email) => {
    setCurrentRole(role);
    setCurrentEmail(email);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    setOpen(false);
  };

  const selectRole = (event) => {
    setCurrentRole(event.target.value);
    changeUserRole(currentEmail, event.target.value);
  };

  return (
    <div>
      <Header />
      <form onSubmit={admin}>
        <input type="submit" value="Get Users" />
      </form>
      <MaterialTable
        title="User List"
        icons={tableIcons}
        columns={columns}
        data={userlist}
        options={{ grouping: true }}
        actions={[
          {
            icon: tableIcons.Edit,
            tooltip: "Edit User",
            onClick: (event, rowData) => {
              handleClickOpen(rowData.role, rowData.email);
            },
          },
          {
            icon: tableIcons.Delete,
            tooltip: "Delete User",
            onClick: (event, rowData) => deleteUserButton(rowData.email),
          },
        ]}
      ></MaterialTable>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Edit user</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can only change the role of a user. Personal information can not
            be changed by anyone else than the users themselves.
          </DialogContentText>
          <InputLabel>Role</InputLabel>
          <Select
            value={currentRole}
            autoFocus
            label="Role"
            onChange={selectRole}
          >
            <MenuItem value={adminRole}>admin</MenuItem>
            <MenuItem value={userRole}>user</MenuItem>
            <MenuItem value={mechanicRole}>mechanic</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave}>Save changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Admin;
