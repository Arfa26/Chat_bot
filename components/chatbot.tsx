"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem
} from "@mui/material";
import {
  LocalizationProvider,
  DatePicker
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const predefinedQuestions = [
  "Do you have any allergies?",
  "Are you currently taking any medications?",
  "Have you experienced any recent pain or discomfort?",
  "Do you have a history of chronic illness?",
  "Are you pregnant or planning to become pregnant?",
  "Have you had any surgeries in the past year?",
  "Do you smoke or consume alcohol?",
  "Do you have a family history of any major illnesses?",
  "Have you been vaccinated for COVID-19?",
  "Are you currently experiencing fever or cold symptoms?"
];

const textFieldStyles = {
  my: 2,
  input: { color: "white" },
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: "white" },
    "&:hover fieldset": { borderColor: "#ccc" },
    "&.Mui-focused fieldset": { borderColor: "white" }
  },
  "& .MuiInputLabel-root": { color: "white" },
  "& .MuiInputLabel-root.Mui-focused": { color: "white" }
};

const nextButtonStyles = {
  mt: 3,
  background: "linear-gradient(90deg, #ad5389 0%, #ad5389 100%)",
  color: "white",
  ":hover": {
    background: "linear-gradient(90deg, #3c1053 0%, #ad5389 100%)"
  }
};

const validationSchemas = [
 Yup.object({
  name: Yup.string()
    .matches(/^[A-Za-z ]+$/, "Only alphabets are allowed")
    .min(3, "Minimum 3 characters required")
    .required("Name is required"),
}),
  Yup.object({ dob: Yup.date().required("Date of Birth is required") }),
  Yup.object({ gender: Yup.string().required("Gender is required") })
];

export default function Chatbot() {
  const [step, setStep] = useState(0);
  const [agree, setAgree] = useState(false);
  const [responses, setResponses] = useState({
    name: "",
    dob: null as Dayjs | null,
    gender: "",
    questions: [] as { question: string; answer: string }[]
  });
  const [randomQuestions, setRandomQuestions] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");

  useEffect(() => {
    const shuffled = [...predefinedQuestions].sort(() => 0.5 - Math.random());
    setRandomQuestions(shuffled.slice(0, 5));
  }, []);

  const handleSubmit = () => {
    const formattedResponses = {
      ...responses,
      dob: responses.dob ? responses.dob.format("DD/MM/YYYY") : null
    };
    console.log("Submitted Data:", formattedResponses);
    setStep(step + 1);
  };

  return (
    <Box mt={20} p={4} maxWidth={600} mx="auto">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          background: "linear-gradient(to bottom, #ad5389, #3c1053)",
          color: "white"
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          sx={{ textAlign: "center", fontWeight: "bold", textTransform: "uppercase", mb: 3 }}
        >
          Pre-Consultation Chatbot
        </Typography>

        {step === 0 && (
          <>
            <Typography variant="h6">
              I would like to ask you some questions before you visit the doctor.
              Do you agree?
            </Typography>
            <Box sx={{ display: "flex" }}>
              <Button
                variant="contained"
                onClick={() => {
                  setAgree(true);
                  setStep(1);
                }}
                fullWidth
                sx={{ mt: 2, mr: 2, backgroundColor: "#ad5389", ":hover": { backgroundColor: "#3c1053" } }}
              >
                Yes
              </Button>
              <Button
                variant="outlined"
                onClick={() => setStep(-1)}
                fullWidth
                sx={{ mt: 2, border: "1px solid #ad5389", color: "white", ":hover": { backgroundColor: "#ad5389" } }}
              >
                No
              </Button>
            </Box>
          </>
        )}

        {step === -1 && (
          <Typography>
            I understand. Please let me know when you're ready to begin.
          </Typography>
        )}

        {step >= 1 && step <= 3 && (
          <Formik
            initialValues={{
              name: responses.name,
              dob: responses.dob,
              gender: responses.gender
            }}
            validationSchema={validationSchemas[step - 1]}
            onSubmit={(values) => {
              setResponses((prev) => ({ ...prev, ...values }));
              setStep(step + 1);
            }}
          >
            {({ values, errors, touched, handleChange, setFieldValue }) => (
              <Form>
                {step === 1 && (
                  <>
                    <Typography>What is your name?</Typography>
                    <TextField
                      name="name"
                      fullWidth
                      sx={textFieldStyles}
                      value={values.name}
                      onChange={handleChange}
                      error={touched.name && Boolean(errors.name)}
                      helperText={touched.name && errors.name}
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <Typography>What is your Date of Birth?</Typography>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={values.dob}
                        onChange={(newValue) => setFieldValue("dob", newValue)}
                        slotProps={{ textField: { fullWidth: true, sx: textFieldStyles, error: touched.dob && Boolean(errors.dob), helperText: touched.dob && errors.dob } }}
                      />
                    </LocalizationProvider>
                  </>
                )}

                {step === 3 && (
                  <>
                    <Typography>What is your gender?</Typography>
                    <TextField
                      select
                      name="gender"
                      fullWidth
                      sx={textFieldStyles}
                      value={values.gender}
                      onChange={handleChange}
                      error={touched.gender && Boolean(errors.gender)}
                      helperText={touched.gender && errors.gender}
                    >
                      <MenuItem value="">Select Gender</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                      <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
                    </TextField>
                  </>
                )}

                <Button type="submit" variant="contained" fullWidth sx={nextButtonStyles}>
                  Next
                </Button>
              </Form>
            )}
          </Formik>
        )}

       {step >= 4 && step < 9 && (
  <>
    <Typography>{randomQuestions[step - 4]}</Typography>
    <TextField
      fullWidth
      sx={textFieldStyles}
      value={currentAnswer}
      onChange={(e) => setCurrentAnswer(e.target.value)}
      error={
        currentAnswer.trim() !== "" &&
        !/^(yes|no)$/i.test(currentAnswer.trim())
      }
      helperText={
        currentAnswer.trim() !== "" &&
        !/^(yes|no)$/i.test(currentAnswer.trim())
          ? 'Please answer "Yes" or "No" only'
          : " "
      }
    />
    <Button
      variant="contained"
      fullWidth
      sx={nextButtonStyles}
      disabled={
        !currentAnswer.trim() || !/^(yes|no)$/i.test(currentAnswer.trim())
      }
      onClick={() => {
        const question = randomQuestions[step - 4];
        setResponses((prev) => ({
          ...prev,
          questions: [
            ...prev.questions,
            { question, answer: currentAnswer.trim() }
          ]
        }));
        setCurrentAnswer("");
        setStep(step + 1);
      }}
    >
      Next
    </Button>
  </>
)}

        {step === 9 && (
          <>
            <Typography>Thank you! Submitting your responses...</Typography>
            <Button variant="contained" sx={nextButtonStyles} onClick={handleSubmit} fullWidth>
              Submit
            </Button>
          </>
        )}

        {step === 10 && (
          <Typography>
            Thank you for your time. Your responses have been securely stored and
            will be reviewed by your doctor.(On Console)
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
