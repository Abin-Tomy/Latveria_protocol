import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "./Login";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to game
    const teamData = localStorage.getItem("lockstep_team");
    if (teamData) {
      navigate("/game");
    }
  }, [navigate]);

  return <Login />;
};

export default Index;
