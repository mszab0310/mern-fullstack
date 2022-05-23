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
import TextField from "@mui/material/TextField";
import { Input, InputLabel, MenuItem, Select } from "@material-ui/core";
import Header from "./Navbar";
import "./Admin.css";

const Admin = () => {
  const [userlist, setUserList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [openDetails, setOpenDetails] = React.useState(false);
  const [currentRole, setCurrentRole] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [shouldRender, setShouldRender] = useState(false);
  const [tmpabout, setTmpAbout] = useState("");
  const [about, setAbout] = useState("");
  const [tmpContact, setTmpContact] = useState("");
  const [contact, setContact] = useState("");
  const [tmpservices, setTmpServices] = useState("");
  const [services, setServices] = useState("");
  const userRole = "user";
  const adminRole = "admin";
  const mechanicRole = "mechanic";
  var wereChangesMade = false;
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

  async function getDetails() {
    const res = await fetch("http://localhost:1590/api/details", {
      method: "GET",
    });
    const data = await res.json();
    if (data.status === "ok") {
      let information = data.details;
      let abt = information.about;
      setAbout(abt);
      let serv = information.services;
      setServices(serv);
      let cont = information.contact;
      setContact(cont);
    } else {
      alert("Problem found");
    }
  }

  async function postDetails() {
    console.log(tmpabout + " " + tmpservices + " " + tmpContact);
    const res = await fetch("http://localhost:1590/api/admin/details", {
      method: "POST",
      headers: {
        "admin-access-token": localStorage.getItem("token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        services: tmpservices,
        about: tmpabout,
        contact: tmpContact,
      }),
    });

    const data = await res.json();
    if (data.status === "ok") {
      alert("Details updated successfully");
    } else {
      alert("Operation failed");
    }
  }

  async function admin(event) {
    event.preventDefault();
    setShouldRender(true);
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

  const handleCloseDetails = () => {
    setOpenDetails(false);
  };

  const handleSave = () => {
    setOpen(false);
  };

  const selectRole = (event) => {
    setCurrentRole(event.target.value);
    changeUserRole(currentEmail, event.target.value);
  };

  const collapseTable = () => {
    setShouldRender(false);
  };

  const openDetailsModal = () => {
    getDetails();
    setOpenDetails(true);
  };

  const saveDetails = () => {
    if (tmpabout === "") setTmpAbout(about);
    if (tmpContact === "") setTmpContact(contact);
    if (tmpservices === "") setTmpServices(services);
    if (wereChangesMade) postDetails();
    setOpenDetails(false);
  };

  const addAbout = (e) => {
    wereChangesMade = true;
    setTmpAbout(e.target.value);
  };

  const addDetails = (e) => {
    wereChangesMade = true;
    setTmpContact(e.target.value);
  };

  const addServices = (e) => {
    wereChangesMade = true;
    setTmpServices(e.target.value);
  };

  return (
    <div>
      <Header />

      <div className="Admin">
        <div className="text">
          This is your Admin Dashboard. View all of your users by clicking the
          View Users button
        </div>
        {!shouldRender && (
          <form onSubmit={admin}>
            <input type="submit" value="View Users" />
          </form>
        )}
        {shouldRender && (
          <form onSubmit={collapseTable}>
            <input type="submit" value="Hide Table" />
          </form>
        )}
        <div className="text">
          View and edit the details that are shown about your company on the
          website by clickin the View Details button.
        </div>
        <button onClick={openDetailsModal}>View Details</button>
        {shouldRender && (
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
        )}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edit user</DialogTitle>
          <DialogContent>
            <DialogContentText>
              You can only change the role of a user. Personal information can
              not be changed by anyone else than the users themselves.
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

        <Dialog open={openDetails} onClose={handleCloseDetails}>
          <DialogTitle>Edit details</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Change or update the details of your service.
            </DialogContentText>
          </DialogContent>
          <InputLabel>About</InputLabel>
          <h2>{about}</h2>
          <TextField
            id="outlined-textarea"
            label="New About"
            placeholder="About"
            multiline
            onChange={addAbout}
          />
          <InputLabel>Details</InputLabel>
          <h2>{contact}</h2>
          <TextField
            id="outlined-textarea"
            label="Contact details"
            placeholder="Contact details"
            multiline
            onChange={addDetails}
          />
          <InputLabel>Services</InputLabel>
          <h2>{services}</h2>
          <TextField
            id="outlined-textarea"
            label="New Services"
            placeholder="Services"
            multiline
            onChange={addServices}
          />
          <DialogActions>
            <Button onClick={handleCloseDetails}>Cancel</Button>
            <Button onClick={saveDetails}>Save changes</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default Admin;
