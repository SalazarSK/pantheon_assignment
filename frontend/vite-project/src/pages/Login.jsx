import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import { login, register } from "../api/api";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const resetError = () => {
    setError(false);
    setErrorMsg("");
  };

  const handleSubmit = async () => {
    resetError();

    if (!username.trim() || !password.trim()) {
      setError(true);
      setErrorMsg("Please fill in username and password.");
      return;
    }

    if (mode === "register" && (!firstName.trim() || !lastName.trim())) {
      setError(true);
      setErrorMsg("Please fill in first name and last name.");
      return;
    }

    try {
      if (mode === "login") {
        const user = await login(username.trim(), password.trim());
        onLogin(user);
      } else {
        const user = await register({
          username: username.trim(),
          password: password.trim(),
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        });
        onLogin(user);
      }
    } catch (e) {
      setError(true);
      setErrorMsg(
        mode === "login"
          ? "Invalid username or password."
          : "Registration failed. Username may already be taken."
      );
      console.error(e);
    }
  };

  const toggleMode = () => {
    resetError();
    setMode((m) => (m === "login" ? "register" : "login"));
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #6b73ff 0%, #000dff 100%)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: 380,
          borderRadius: 3,
          textAlign: "center",
          backdropFilter: "blur(6px)",
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={1.5}>
          Chatty
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          {mode === "login"
            ? "Sign in to start chatting"
            : "Create an account to join the chat"}
        </Typography>

        <Stack spacing={2}>
          {mode === "register" && (
            <>
              <TextField
                label="First name"
                variant="outlined"
                fullWidth
                error={error && (!firstName.trim() || !lastName.trim())}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <TextField
                label="Last name"
                variant="outlined"
                fullWidth
                error={error && (!firstName.trim() || !lastName.trim())}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </>
          )}

          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            error={error && !username.trim()}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            error={error && !password.trim()}
            helperText={error ? errorMsg : ""}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{
              mt: 1,
              borderRadius: 2,
              textTransform: "none",
              fontSize: 16,
            }}
          >
            {mode === "login" ? "Sign In" : "Register"}
          </Button>

          <Button
            variant="text"
            size="small"
            onClick={toggleMode}
            sx={{ textTransform: "none", mt: 1 }}
          >
            {mode === "login"
              ? "Don't have an account? Register"
              : "Already have an account? Sign in"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
