import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const { data } = await api.put("/users/me", { name, bio });
      updateUser(data);
      setMessage("Profile updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <div className="profile-avatar-large">
          <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
        </div>
        <h2>{user?.name}</h2>
        <p className="muted">{user?.email}</p>

        <form onSubmit={handleSubmit} className="profile-form">
          {message && <div className="alert-success">{message}</div>}
          {error && <div className="alert-error">{error}</div>}

          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

          <label>Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={200}
            placeholder="Tell people about yourself..."
          />

          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
