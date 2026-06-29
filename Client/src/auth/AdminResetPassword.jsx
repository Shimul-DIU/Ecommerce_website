import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminResetPassword = () => {

  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(

        "http://localhost:4000/api/admin/reset-password",

        {
          token,
          password,
        }

      );

      setMessage(res.data.message);

      setTimeout(() => {

        navigate("/admin/login");

      }, 2000);

    }

    catch (error) {

      setMessage(error.response.data.message);

    }

  };

  return (

    <div>

      <form onSubmit={handleSubmit}>

        <input

          type="password"

          placeholder="New Password"

          value={password}

          onChange={(e) => setPassword(e.target.value)}

        />

        <button>

          Reset Password

        </button>

      </form>

      <p>{message}</p>

    </div>

  );

};

export default AdminResetPassword;