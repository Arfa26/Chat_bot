'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,

} from '@mui/material';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  // Button,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  LocalizationProvider,
  DatePicker,
} from '@mui/x-date-pickers';
import '../app/globals.css';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// Predefined questions
const predefinedQuestions = [
  'Do you have any allergies?',
  'Are you currently taking any medications?',
  'Have you experienced any recent pain or discomfort?',
  'Do you have a history of chronic illness?',
  'Are you pregnant or planning to become pregnant?',
  'Have you had any surgeries in the past year?',
  'Do you smoke or consume alcohol?',
  'Do you have a family history of any major illnesses?',
  'Have you been vaccinated for COVID-19?',
  'Are you currently experiencing fever or cold symptoms?',
];

const stepImages: { [key: number]: string } = {
  0: '/4.jpg',
  1: '/line.jpg',
  2: '/6.jpg',
  3: '/nurse.jpg',
  4: '/doc.jpg',
  5: '/5.jpg',
  6: '/3.jpg',
  7: '/7.jpg',
  8: '/8.jpg',
  9: '/9.jpg',
  10: '/10.jpg',
};

// MUI styles
const textFieldStyles = {
  my: 1,
  
  input: { color: 'black' },
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'black' },
    '&:hover fieldset': { borderColor: 'black' },
    '&.Mui-focused fieldset': { borderColor: 'black' },
  },
  '& .MuiInputLabel-root': { color: 'black' },
  '& .MuiInputLabel-root.Mui-focused': { color: 'black' },
};


const buttonStyles = {
  mt: 2,
  background: 'linear-gradient(to bottom, #8E0E00, #8E0E00)',
  color: 'white',
  ':hover': {
    background: 'linear-gradient(to bottom, #8E0E00, #1f1c18)',
  },
};

const validationSchemas = [
  Yup.object({
    name: Yup.string()
      .matches(/^[A-Za-z ]+$/, 'Only alphabets are allowed')
      .min(3, 'Minimum 3 characters required')
      .required('Name is required'),
  }),
  Yup.object({
    dob: Yup.date().required('Date of Birth is required'),
  }),
  Yup.object({
    gender: Yup.string().required('Gender is required'),
  }),
];

export default function Chatbot() {
  const [step, setStep] = useState(0);
  const [showFinalDialog, setShowFinalDialog] = useState(false);
  const [responses, setResponses] = useState({
    name: '',
    dob: null as Dayjs | null,
    gender: '',
    questions: [] as { question: string; answer: string }[],
  });
  const [randomQuestions, setRandomQuestions] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
const resetFormRef = React.useRef<() => void>(() => {});
  useEffect(() => {
    const shuffled = [...predefinedQuestions].sort(() => 0.5 - Math.random());
    setRandomQuestions(shuffled.slice(0, 5));
  }, []);


const handleSubmit = async () => {
  const formattedResponses = {
    username: responses.name,
    dob: responses.dob ? responses.dob.format('DD/MM/YYYY') : null,
    gender: responses.gender,
    userResponses: responses.questions,
  };

  console.log('Submitting to API:', formattedResponses);
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Show dialog box only, do NOT change step
  setShowFinalDialog(true);

  // Reset everything after 40 seconds
  const timeout = setTimeout(() => {
    setShowFinalDialog(false);
    setStep(1); // or 0 if you want to show consent again
    setResponses({
      name: '',
      dob: null,
      gender: '',
      questions: [],
    });
    setCurrentAnswer('');
  }, 40000); // 40 seconds

  return () => clearTimeout(timeout); // Cleanup
};


  return (
    <Box
      sx={{
        background: 'linear-gradient(to left, #E6DADA,  #274046)',
 
        // background: 'linear-gradient(to left, #3E5151, #decba4)',
         minHeight: '100vh', width: '100%' }}
      justifyContent="center"
      alignItems="stretch"
      gap={1}
      display="flex"
    >

      <Paper
          elevation={6}
          sx={{
            position: 'relative',
            width:800,
            mt:9,
            // p: 1,
            height: '90%',
            backgroundColor: 'white' ,
            boxShadow: '0 10px 24px rgba(0,0,0,0.7)',
            color: 'black',
            borderRadius: '20px',
            display:"flex",
            flexDirection:" xs: 'column', md: 'row' "

          }}
        >
          
      {/* Chatbot Box */}
      <Box flex={1} >
<motion.div
key={step !== 10 ? step : 'final'} 
  initial={{ opacity: 0, y: 100 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
  style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
>
        <Box sx={{p: 4,mx:1.2}}>
<Box display={'flex'} >
        <img
  src="/message.png"
  alt="Chatbot"
  
  style={{ objectFit: "cover", width: '35px', height: '35px'}} 
/>
<Typography  className="heading-font" sx={{letterSpacing:2, fontSize: "18px",pt:1 ,color:'#8E0E00',fontWeight: 'bold' }}>
  _Chatbot
</Typography>

        </Box>

  <Typography variant="h5" className="heading-font" sx={{ fontSize: "39px", fontWeight: 'bold', mb: 1.5,mt:2.7 }}>
  Pre-Consultation Chatbot
</Typography>

          {/* Step 0: Consent */}
          {step === 0 && (
            <>
              <Typography variant="h6" sx={{fontSize:20}}>Do you agree to answer some questions before your consultation?</Typography>
              <Box sx={{ display: 'flex', gap: 2 , mt: 3}}>
                <Button
                  variant="contained"
                  onClick={() => setStep(1)}
                  // width="80%"
                  // width="70%"
                  sx={{ fontWeight:'bold',mt: 2,width:'47%',p:1.5, background: 'linear-gradient(to bottom, #8E0E00, #1f1c18)', ':hover': { backgroundColor: '#3c1053' } }}
                >
                  Yes
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setStep(-1)}
                  // fullWidth
                  sx={{ fontWeight:'bold',mt: 2,width:'47%', border: '1px solid #1f1c18', color: 'black', ':hover': { background: 'linear-gradient(to bottom, #8E0E00, #1f1c18)', border:'none',color:'white'} }}
                >
                  No
                </Button>
              </Box>
            </>
          )}

          {/* Step -1: Declined */}
          {step === -1 && <Typography>No problem. Let us know when you are ready to start.</Typography>}

          {/* Step 1-3: Formik Flow */}
          {step >= 1 && step <= 3 && (
            <Formik
              initialValues={{
                name: responses.name,
                dob: responses.dob,
                gender: responses.gender,
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
  onChange={(newValue) => setFieldValue('dob', newValue)}
  shouldDisableDate={(date) => {
    return date.isAfter(dayjs(), 'day'); // disables all dates after today
  }}
  slotProps={{
    textField: {
      fullWidth: true,
      sx: textFieldStyles,
      error: touched.dob && Boolean(errors.dob),
      helperText: touched.dob && errors.dob,
    },
  }}
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

                  <Button type="submit" variant="contained" fullWidth sx={{...buttonStyles,mt:6}}>
                    Next
                  </Button>
                  {step > 1 && (
  <Button
    variant="outlined"
    fullWidth
    onClick={() => setStep(step - 1)}
    sx={{
      ...buttonStyles,
      mt: 1,
      border: '1px solid #8E0E00',
      // color: '#8E0E00',
      //buttonStyles,
      ':hover': {
        background: 'linear-gradient(to bottom, #8E0E00, #1f1c18)',
        color: 'white',
        border: 'none',
      },
    }}
  >
    Previous
  </Button>
)}
                </Form>
              )}
              
            </Formik>
            
          )}

          {/* Step 4-8: Questions */}
          {step >= 4 && step < 9 && (
            <>
            <Box display="flex" alignItems="center" justifyContent="space-between"  mb={1}>
  {[1, 2, 3, 4, 5].map((num, index) => {
    const isCompleted = step - 4 >= num;
    const isActive = step - 4 === num - 1;

    return (
      <React.Fragment key={num}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: isCompleted || isActive ? '#8E0E00' : '#ccc',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px',
            zIndex: 2,
          }}
        >
          {num}
        </Box>

        {index < 4 && (
          <Box
            flex={1}
            height={2.5}
            // mx={1}
            sx={{
              backgroundColor: step - 4 > index ? '#8E0E00' : '#ccc',
              borderRadius: 0,
            }}
          />
        )}
      </React.Fragment>
    );
  })}
</Box>

            {/* <Typography  mb={1} sx={{color:'#8E0E00' , fontWeight:"bold"}}>Ans 5 Questions</Typography> */}
              <Typography>{randomQuestions[step - 4]}</Typography>
              <TextField
                fullWidth

                sx={textFieldStyles}
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                 error={
                  currentAnswer.trim() !== '' &&
                  !/^(yes|no)$/i.test(currentAnswer.trim())
                }
                helperText={
                  currentAnswer && !/^(yes|no)$/i.test(currentAnswer)
                    ? 'Please answer "Yes" or "No"'
                    : ' '
                }
              />
             <Box display="flex" gap={2}>
  
  <Button
    variant="outlined"
    onClick={() => {
      const previousQuestions = [...responses.questions];
      previousQuestions.pop();
      setResponses((prev) => ({
        ...prev,
        questions: previousQuestions,
      }));
      setCurrentAnswer('');
      setStep(step - 1);
    }}
    sx={{
      ...buttonStyles,
      width: '50%',
      border: '1px solid #8E0E00',
      color: '#8E0E00',
      background: 'transparent',
      ':hover': {
        background: 'linear-gradient(to bottom, #8E0E00, #1f1c18)',
        color: 'white',
        border: 'none',
      },
    }}
  >
    Previous
  </Button>
  <Button
    variant="contained"
    sx={{ ...buttonStyles, width: '50%' }}
    disabled={!/^(yes|no)$/i.test(currentAnswer)}
    onClick={() => {
      const question = randomQuestions[step - 4];
      setResponses((prev) => ({
        ...prev,
        questions: [...prev.questions, { question, answer: currentAnswer }],
      }));
      setCurrentAnswer('');
      setStep(step + 1);
    }}
  >
    Next
  </Button>
</Box>

            </>
          )}

          {/* Step 9: Submit */}
          {step === 9 && (
            <>
              <Typography>Submitting your responses...</Typography>
              <Button variant="contained" sx={buttonStyles} onClick={handleSubmit} fullWidth>
                Submit
              </Button>
            </>
          )}

          {/* Step 10: Final Message */}
          
          <Dialog open={showFinalDialog}  maxWidth="sm">
  <DialogTitle sx={{color:"#8E0E00",fontWeight:'bold'}}>Submission Complete</DialogTitle>
  <DialogContent>
    <Typography>
      Thank you! Your responses have been 
      securely submitted to your doctor.
    </Typography>
  </DialogContent>
  <DialogActions>
    <Typography sx={{ mx: 'auto', fontSize: '0.9rem', color: 'gray' }}>
      This message will close automatically in 40 seconds.
    </Typography>
  </DialogActions>
</Dialog>

        </Box> 
         </motion.div>
      </Box>

      {/* Image Section */}
      <Box
  flex={1}
  display="flex"
  justifyContent="center"
  alignItems="center"
>
  <img
    src={stepImages[step] || '/default.jpg'} // fallback image
    alt="Step Visual"
    style={{
      position: 'relative',
      left: 40,
      maxWidth: '80%',
      borderTopRightRadius: '16px',
      borderBottomRightRadius: '16px',
      height: 'auto',
    }}
  />
</Box>

      </Paper>
     
    </Box>
  );
}
