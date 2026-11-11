
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  signupUser,
  logout as logoutAction
} from "./features/authSlice";
import "./App.css";

const initialData = {
  disasters: [],
  resources: [],
  volunteers: [],
  relief: [],
};

function LoginPage({ onLogin }) {
  const [loginType, setLoginType] = useState("user");
  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
const dispatch = useDispatch();
const loading = useSelector((state) => state.auth.loading);
 const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  // ADMIN LOGIN
  if (loginType === "admin") {
    if (
      email === "deepika@gmail.com" &&
      password === "deepika@123"
    ) {
      localStorage.setItem("dmsRole", "admin");

      localStorage.setItem(
        "dmsCurrentUser",
        JSON.stringify({
          name: "Admin",
          email: email,
        })
      );

      onLogin("admin");
    } else {
      setError("Invalid admin email or password");
    }
    return;
  }

  // USER LOGIN THROUGH BACKEND
  try {
    const result = await dispatch(
      loginUser({ email, password })
    ).unwrap();

    localStorage.setItem("dmsRole", "user");

    localStorage.setItem(
      "dmsCurrentUser",
      JSON.stringify(result.user)
    );

    onLogin("user");
  } catch (err) {
    setError(err || "Login failed");
  }
};
const handleSignup = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return;
  }

  try {
    await dispatch(
      signupUser({ name, email, password })
    ).unwrap();

    setSuccess("Signup successful! Please login.");
    setIsSignup(false);
    setPassword("");
    setConfirmPassword("");
  } catch (err) {
    setError(err || "Signup failed");
  }
};
  const switchLoginType = (type) => {
    setLoginType(type);
    setIsSignup(false);
    setError("");
    setSuccess("");
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo-icon">🚨</div>
          <h1>Disaster Management</h1>
          <p>Emergency Response System</p>
        </div>

        {/* USER / ADMIN TABS */}
        <div className="login-tabs">
          <button
            type="button"
            className={
              loginType === "user" ? "active" : ""
            }
            onClick={() => switchLoginType("user")}
          >
            👤 User
          </button>

          <button
            type="button"
            className={
              loginType === "admin" ? "active" : ""
            }
            onClick={() => switchLoginType("admin")}
          >
            🛡️ Admin
          </button>
        </div>

        {/* SIGNUP FORM */}
        {loginType === "user" && isSignup ? (
          <form onSubmit={handleSignup}>
            <h2>Create Account</h2>
            <p className="signup-subtitle">
              Register as a new user
            </p>

            <input
              type="text"
              className="login-input"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              className="login-input"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="password"
              className="login-input"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {success && (
              <div className="signup-success">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
            >
              Create Account
            </button>

            <button
              type="button"
              className="signup-link-button"
              onClick={() => {
                setIsSignup(false);
                setError("");
                setSuccess("");
              }}
            >
              ← Back to Login
            </button>
          </form>
        ) : (
          /* LOGIN FORM */
          <form onSubmit={handleLogin}>
            <h2>
              {loginType === "admin"
                ? "Admin Login"
                : "User Login"}
            </h2>

            <input
              type="email"
              className="login-input"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              className="login-input"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            {success && (
              <div className="signup-success">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="login-button"
            >
              Login
            </button>

            {/* SIGNUP ONLY FOR USER */}
            {loginType === "user" && (
              <div className="signup-option">
                <span>Don't have an account?</span>

                <button
                  type="button"
                  className="signup-link-button"
                  onClick={() => {
                    setIsSignup(true);
                    setError("");
                    setSuccess("");
                    setPassword("");
                  }}
                >
                  Create Account
                </button>
              </div>
            )}
          </form>
        )}

        <div className="login-footer">
          <p>Disaster Management System</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  const dispatch = useDispatch();
  const [weather, setWeather] = useState(null);
const [weatherError, setWeatherError] = useState("");
  const [role, setRole] = useState(
    localStorage.getItem("dmsRole") || ""
  );

  const [activePage, setActivePage] =
    useState("dashboard");

  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem(
      "disasterManagementData"
    );

    return savedData
      ? JSON.parse(savedData)
      : initialData;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser =
      localStorage.getItem("dmsCurrentUser");

    return savedUser
      ? JSON.parse(savedUser)
      : null;
  });

  const [disasterForm, setDisasterForm] = useState({
    type: "",
    location: "",
    description: "",
    severity: "Medium",
  });

  const [resourceForm, setResourceForm] = useState({
    name: "",
    quantity: "",
    location: "",
    type: "",
  });

  const [volunteerForm, setVolunteerForm] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
  });

  useEffect(() => {
    localStorage.setItem(
      "disasterManagementData",
      JSON.stringify(data)
    );
  }, [data]);
  useEffect(() => {
  const fetchWeather = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/weather?city=Tirupati"
      );

      if (!response.ok) {
        throw new Error("Weather unavailable");
      }

      const result = await response.json();
      setWeather(result);
      setWeatherError("");
    } catch (error) {
      setWeatherError("Unable to load weather");
    }
  };

  fetchWeather();
}, []);

  const handleLogin = (userRole) => {
    setRole(userRole);

    const savedUser =
      localStorage.getItem("dmsCurrentUser");

    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  };

  const logout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("dmsRole");
    localStorage.removeItem("dmsCurrentUser");

    setRole("");
    setCurrentUser(null);
    setActivePage("dashboard");
  };

  // ================= DISASTER FUNCTIONS =================

  const addDisaster = (e) => {
    e.preventDefault();

    if (
      !disasterForm.type ||
      !disasterForm.location ||
      !disasterForm.description
    ) {
      return;
    }

    const newDisaster = {
      id: Date.now(),
      ...disasterForm,
      status: "Pending",
      reportedBy:
        currentUser?.name || "Registered User",
      date: new Date().toLocaleDateString(),
    };

    setData((prev) => ({
      ...prev,
      disasters: [
        newDisaster,
        ...prev.disasters,
      ],
    }));

    setDisasterForm({
      type: "",
      location: "",
      description: "",
      severity: "Medium",
    });
  };

  const deleteDisaster = (id) => {
    setData((prev) => ({
      ...prev,
      disasters: prev.disasters.filter(
        (item) => item.id !== id
      ),
    }));
  };

  const updateDisasterStatus = (id, status) => {
    setData((prev) => ({
      ...prev,
      disasters: prev.disasters.map((item) =>
        item.id === id
          ? { ...item, status }
          : item
      ),
    }));
  };

  // ================= RESOURCE FUNCTIONS =================

  const addResource = (e) => {
    e.preventDefault();

    if (
      !resourceForm.name ||
      !resourceForm.quantity ||
      !resourceForm.location
    ) {
      return;
    }

    const newResource = {
      id: Date.now(),
      ...resourceForm,
    };

    setData((prev) => ({
      ...prev,
      resources: [
        ...prev.resources,
        newResource,
      ],
    }));

    setResourceForm({
      name: "",
      quantity: "",
      location: "",
      type: "",
    });
  };

  const deleteResource = (id) => {
    setData((prev) => ({
      ...prev,
      resources: prev.resources.filter(
        (item) => item.id !== id
      ),
    }));
  };

  // ================= VOLUNTEER FUNCTIONS =================

  const addVolunteer = (e) => {
    e.preventDefault();

    if (
      !volunteerForm.name ||
      !volunteerForm.email ||
      !volunteerForm.phone
    ) {
      return;
    }

    const newVolunteer = {
      id: Date.now(),
      ...volunteerForm,
      status: "Available",
    };

    setData((prev) => ({
      ...prev,
      volunteers: [
        ...prev.volunteers,
        newVolunteer,
      ],
    }));

    setVolunteerForm({
      name: "",
      email: "",
      phone: "",
      skills: "",
    });
  };

  const deleteVolunteer = (id) => {
    setData((prev) => ({
      ...prev,
      volunteers: prev.volunteers.filter(
        (item) => item.id !== id
      ),
    }));
  };

  // ================= DASHBOARD =================

  const renderDashboard = () => {
    const totalDisasters = data.disasters.length;
    const pendingDisasters =
      data.disasters.filter(
        (d) => d.status === "Pending"
      ).length;

    const totalResources = data.resources.length;
    const totalVolunteers =
      data.volunteers.length;

    return (
      <div className="page-content">
        <div className="welcome-section">
          <h1>
            Welcome,{" "}
            {role === "admin"
              ? "Admin"
              : currentUser?.name ||
                "Registered User"}
            👋
          </h1>

          <p>
            Manage disaster response and coordinate
            emergency resources efficiently.
          </p>
        </div>
<div className="dashboard-section">
  <h2>🌦️ Live Weather - Tirupati</h2>

  {weather ? (
    <div className="stat-card">
      <div className="stat-icon">🌤️</div>
      <div>
        <h3>{weather.main.temp}°C</h3>
        <p>{weather.weather[0].description}</p>
        <p>Humidity: {weather.main.humidity}%</p>
        <p>Wind Speed: {weather.wind.speed} m/s</p>
      </div>
    </div>
  ) : (
    <p>{weatherError || "Loading weather..."}</p>
  )}
</div>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🚨</div>
            <div>
              <h3>{totalDisasters}</h3>
              <p>Total Disasters</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div>
              <h3>{pendingDisasters}</h3>
              <p>Pending Reports</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div>
              <h3>{totalResources}</h3>
              <p>Resources</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🤝</div>
            <div>
              <h3>{totalVolunteers}</h3>
              <p>Volunteers</p>
            </div>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Recent Disaster Reports</h2>

          {data.disasters.length === 0 ? (
            <div className="empty-state">
              No disaster reports available.
            </div>
          ) : (
            <div className="disaster-cards">
              {data.disasters
                .slice(0, 5)
                .map((disaster) => (
                  <div
                    className="disaster-card"
                    key={disaster.id}
                  >
                    <div className="disaster-header">
                      <h3>{disaster.type}</h3>

                      <span
                        className={`badge ${disaster.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {disaster.status}
                      </span>
                    </div>

                    <p>
                      📍 {disaster.location}
                    </p>

                    <p>
                      {disaster.description}
                    </p>

                    <small>
                      Severity:{" "}
                      {disaster.severity}
                    </small>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <h2>Safety Guidelines</h2>

          <div className="safety-guidelines">
            <div className="guideline">
              🚨 Stay calm and follow official
              instructions.
            </div>

            <div className="guideline">
              📱 Keep emergency contacts saved.
            </div>

            <div className="guideline">
              🎒 Keep an emergency kit ready.
            </div>

            <div className="guideline">
              🏠 Move to a safe location during
              emergencies.
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ================= DISASTERS PAGE =================

  const renderDisasters = () => (
    <div className="page-content">
      <div className="page-header">
        <h1>Disaster Reports</h1>
        <p>
          Report and manage disaster incidents.
        </p>
      </div>

      <div className="form-card">
        <h2>Report a Disaster</h2>

        <form onSubmit={addDisaster}>
          <div className="form-grid">
            <div className="input-group">
              <label>Disaster Type</label>

              <input
                type="text"
                value={disasterForm.type}
                onChange={(e) =>
                  setDisasterForm({
                    ...disasterForm,
                    type: e.target.value,
                  })
                }
                placeholder="Flood, Fire, Earthquake..."
              />
            </div>

            <div className="input-group">
              <label>Location</label>

              <input
                type="text"
                value={disasterForm.location}
                onChange={(e) =>
                  setDisasterForm({
                    ...disasterForm,
                    location: e.target.value,
                  })
                }
                placeholder="Enter location"
              />
            </div>

            <div className="input-group">
              <label>Severity</label>

              <select
                value={disasterForm.severity}
                onChange={(e) =>
                  setDisasterForm({
                    ...disasterForm,
                    severity: e.target.value,
                  })
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Critical</option>
              </select>
            </div>

            <div className="input-group">
              <label>Description</label>

              <input
                type="text"
                value={disasterForm.description}
                onChange={(e) =>
                  setDisasterForm({
                    ...disasterForm,
                    description: e.target.value,
                  })
                }
                placeholder="Describe the incident"
              />
            </div>
          </div>

          <button
            type="submit"
            className="primary-btn"
          >
            Report Disaster
          </button>
        </form>
      </div>

      <div className="dashboard-section">
        <h2>All Reports</h2>

        {data.disasters.length === 0 ? (
          <div className="empty-state">
            No disaster reports found.
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Reported By</th>

                  {role === "admin" && (
                    <th>Actions</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {data.disasters.map(
                  (disaster) => (
                    <tr key={disaster.id}>
                      <td>{disaster.type}</td>
                      <td>
                        {disaster.location}
                      </td>
                      <td>
                        {disaster.severity}
                      </td>
                      <td>
                        {role === "admin" ? (
                          <select
                            value={
                              disaster.status
                            }
                            onChange={(e) =>
                              updateDisasterStatus(
                                disaster.id,
                                e.target.value
                              )
                            }
                          >
                            <option>
                              Pending
                            </option>
                            <option>
                              In Progress
                            </option>
                            <option>
                              Resolved
                            </option>
                          </select>
                        ) : (
                          <span
                            className={`badge ${disaster.status
                              .toLowerCase()
                              .replace(
                                " ",
                                "-"
                              )}`}
                          >
                            {
                              disaster.status
                            }
                          </span>
                        )}
                      </td>

                      <td>
                        {disaster.reportedBy ||
                          "User"}
                      </td>

                      {role === "admin" && (
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteDisaster(
                                disaster.id
                              )
                            }
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // ================= RESOURCES PAGE =================

  const renderResources = () => (
    <div className="page-content">
      <div className="page-header">
        <h1>Relief Resources</h1>
        <p>
          View and manage emergency relief
          resources.
        </p>
      </div>

      {role === "admin" && (
        <div className="form-card">
          <h2>Add Resource</h2>

          <form onSubmit={addResource}>
            <div className="form-grid">
              <div className="input-group">
                <label>Resource Name</label>

                <input
                  type="text"
                  value={resourceForm.name}
                  onChange={(e) =>
                    setResourceForm({
                      ...resourceForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="Food, Water, Medicines..."
                />
              </div>

              <div className="input-group">
                <label>Quantity</label>

                <input
                  type="text"
                  value={
                    resourceForm.quantity
                  }
                  onChange={(e) =>
                    setResourceForm({
                      ...resourceForm,
                      quantity:
                        e.target.value,
                    })
                  }
                  placeholder="Enter quantity"
                />
              </div>

              <div className="input-group">
                <label>Location</label>

                <input
                  type="text"
                  value={
                    resourceForm.location
                  }
                  onChange={(e) =>
                    setResourceForm({
                      ...resourceForm,
                      location:
                        e.target.value,
                    })
                  }
                  placeholder="Storage location"
                />
              </div>

              <div className="input-group">
                <label>Type</label>

                <input
                  type="text"
                  value={resourceForm.type}
                  onChange={(e) =>
                    setResourceForm({
                      ...resourceForm,
                      type: e.target.value,
                    })
                  }
                  placeholder="Medical / Food / Water"
                />
              </div>
            </div>

            <button
              type="submit"
              className="primary-btn"
            >
              Add Resource
            </button>
          </form>
        </div>
      )}

      <div className="resource-grid">
        {data.resources.length === 0 ? (
          <div className="empty-state">
            No resources available.
          </div>
        ) : (
          data.resources.map((resource) => (
            <div
              className="resource-card"
              key={resource.id}
            >
              <h3>{resource.name}</h3>

              <p>
                Quantity:{" "}
                {resource.quantity}
              </p>

              <p>
                Location:{" "}
                {resource.location}
              </p>

              <p>
                Type: {resource.type}
              </p>

              {role === "admin" && (
                <button
                  className="delete-btn"
                  onClick={() =>
                    deleteResource(
                      resource.id
                    )
                  }
                >
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );

  // ================= VOLUNTEERS PAGE =================

  const renderVolunteers = () => (
    <div className="page-content">
      <div className="page-header">
        <h1>Volunteers</h1>
        <p>
          Register and manage emergency
          volunteers.
        </p>
      </div>

      <div className="form-card">
        <h2>Register as Volunteer</h2>

        <form onSubmit={addVolunteer}>
          <div className="form-grid">
            <div className="input-group">
              <label>Name</label>

              <input
                type="text"
                value={volunteerForm.name}
                onChange={(e) =>
                  setVolunteerForm({
                    ...volunteerForm,
                    name: e.target.value,
                  })
                }
                placeholder="Full name"
              />
            </div>

            <div className="input-group">
              <label>Email</label>

              <input
                type="email"
                value={volunteerForm.email}
                onChange={(e) =>
                  setVolunteerForm({
                    ...volunteerForm,
                    email: e.target.value,
                  })
                }
                placeholder="Email address"
              />
            </div>

            <div className="input-group">
              <label>Phone</label>

              <input
                type="tel"
                value={volunteerForm.phone}
                onChange={(e) =>
                  setVolunteerForm({
                    ...volunteerForm,
                    phone: e.target.value,
                  })
                }
                placeholder="Phone number"
              />
            </div>

            <div className="input-group">
              <label>Skills</label>

              <input
                type="text"
                value={volunteerForm.skills}
                onChange={(e) =>
                  setVolunteerForm({
                    ...volunteerForm,
                    skills: e.target.value,
                  })
                }
                placeholder="First Aid, Rescue..."
              />
            </div>
          </div>

          <button
            type="submit"
            className="primary-btn"
          >
            Register Volunteer
          </button>
        </form>
      </div>

      <div className="dashboard-section">
        <h2>Registered Volunteers</h2>

        {data.volunteers.length === 0 ? (
          <div className="empty-state">
            No volunteers registered yet.
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Skills</th>
                  <th>Status</th>

                  {role === "admin" && (
                    <th>Actions</th>
                  )}
                </tr>
              </thead>

              <tbody>
                {data.volunteers.map(
                  (volunteer) => (
                    <tr
                      key={volunteer.id}
                    >
                      <td>
                        {volunteer.name}
                      </td>
                      <td>
                        {volunteer.email}
                      </td>
                      <td>
                        {volunteer.phone}
                      </td>
                      <td>
                        {volunteer.skills}
                      </td>
                      <td>
                        <span className="badge">
                          {
                            volunteer.status
                          }
                        </span>
                      </td>

                      {role === "admin" && (
                        <td>
                          <button
                            className="delete-btn"
                            onClick={() =>
                              deleteVolunteer(
                                volunteer.id
                              )
                            }
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // ================= RELIEF PAGE =================

  const renderRelief = () => (
    <div className="page-content">
      <div className="page-header">
        <h1>Relief Activities</h1>
        <p>
          Monitor disaster relief activities
          and response efforts.
        </p>
      </div>

      <div className="dashboard-section">
        <div className="empty-state">
          Relief activity information will
          appear here.
        </div>
      </div>
    </div>
  );

  // ================= ANALYTICS PAGE =================

  const renderAnalytics = () => (
    <div className="page-content">
      <div className="page-header">
        <h1>Analytics</h1>
        <p>
          Disaster management system
          statistics.
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            🚨
          </div>

          <div>
            <h3>
              {data.disasters.length}
            </h3>

            <p>Total Reports</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            📦
          </div>

          <div>
            <h3>
              {data.resources.length}
            </h3>

            <p>Total Resources</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            🤝
          </div>

          <div>
            <h3>
              {data.volunteers.length}
            </h3>

            <p>Total Volunteers</p>
          </div>
        </div>
      </div>
    </div>
  );

  // ================= PAGE ROUTING =================

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return renderDashboard();

      case "disasters":
        return renderDisasters();

      case "resources":
        return renderResources();

      case "volunteers":
        return renderVolunteers();

      case "relief":
        return renderRelief();

      case "analytics":
        return role === "admin"
          ? renderAnalytics()
          : renderDashboard();

      default:
        return renderDashboard();
    }
  };

  // ================= LOGIN =================

  if (!role) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">🚨</div>

          <div>
            <h2>Disaster MS</h2>
            <span>
              Management System
            </span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button
            className={
              activePage === "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("dashboard")
            }
          >
            🏠 Dashboard
          </button>

          <button
            className={
              activePage === "disasters"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("disasters")
            }
          >
            🚨 Disaster Reports
          </button>

          <button
            className={
              activePage === "resources"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("resources")
            }
          >
            📦 Resources
          </button>

          <button
            className={
              activePage === "volunteers"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("volunteers")
            }
          >
            🤝 Volunteers
          </button>

          <button
            className={
              activePage === "relief"
                ? "active"
                : ""
            }
            onClick={() =>
              setActivePage("relief")
            }
          >
            🏥 Relief Activities
          </button>

          {role === "admin" && (
            <button
              className={
                activePage === "analytics"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActivePage("analytics")
              }
            >
              📊 Analytics
            </button>
          )}
        </nav>

        <button
          className="sidebar-logout"
          onClick={logout}
        >
          🚪 Logout
        </button>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h2>
              {role === "admin"
                ? "Admin Dashboard"
                : "User Dashboard"}
            </h2>

            <p>
              Disaster Management System
            </p>
          </div>

          <div className="topbar-user">
            <span>
              {role === "admin"
                ? "🛡️ Admin"
                : `👤 ${
                    currentUser?.name ||
                    "User"
                  }`}
            </span>

            <button
              className="logout-btn"
              onClick={logout}
            >
              Logout
            </button>
          </div>
        </header>

        {renderPage()}

        <footer className="app-footer">
          <p>
            © 2026 Disaster Management System |
            SDC Project
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;