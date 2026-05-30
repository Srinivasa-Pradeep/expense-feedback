import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Container, Typography, TextField, FormControl, InputLabel, 
  Select, MenuItem, Grid, Box, IconButton, Button, Checkbox, FormControlLabel, CircularProgress 
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { PermMedia } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './ExpenseForm.css';
import Navbar from '../Navbar/Navbar';
import InputAdornment from '@mui/material/InputAdornment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { GrPowerReset } from "react-icons/gr";




function ExpenseForm() {

  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const name = user ? user.firstName : ''
  const email = user ? user.email : ''
  
  const [formData, setFormData] = useState({
    transactionDate: '',
    businessPurpose: '',
    vendorDescription: '',
    city: '',
    paymentType: '',
    amount: '',
    currency: '',
    taxAndPostedAmount: '',
    personalExpense: false,
    comment: '',
    name: name,
    email: email,
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [filename, setFilename] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fileError, setFileError] = useState('');

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const handleDaySelect = (day) => {
    const formattedMonth = String(currentMonth + 1).padStart(2, '0');
    const formattedDay = String(day).padStart(2, '0');
    const selectedDate = `${currentYear}-${formattedMonth}-${formattedDay}`;
    setFormData(prevState => ({
      ...prevState,
      transactionDate: selectedDate
    }));
    setIsCalendarOpen(false);
  };

  const handleMonthChange = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(prev => prev - 1);
      } else {
        setCurrentMonth(prev => prev - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(prev => prev + 1);
      } else {
        setCurrentMonth(prev => prev + 1);
      }
    }
  };

  useEffect(() => {
    if (!isCalendarOpen) return;
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.date-picker-wrapper')) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [isCalendarOpen]);


  const paymentOptions = ['Cash', 'Credit Card', 'Debit Card', 'UPI', 'Other'];
  const currencyOptions = [
    { value: 'Euro (EUR)', label: 'Euro (EUR)' },
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'GBP', label: 'British Pound (GBP)' },
    { value: 'JPY', label: 'Japanese Yen (JPY)' },
    { value: 'CAD', label: 'Canadian Dollar (CAD)' },
    { value: 'INR', label: 'Indian Rupee (INR)' },
  ];

  const onDrop = (acceptedFiles) => {
    setReceiptFile(acceptedFiles[0]);
    setFilename(acceptedFiles[0].name);
    setFileError('');
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.tif', '.tiff'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 5 * 1024 * 1024,
    onDrop,
  });


  useEffect(()=>{
    const authStatus = JSON.parse(localStorage.getItem("isAuthenticated"));
    setIsAuthenticated(authStatus);
  },[]);

  const handleChange = (e) => {
    const { name, value, type,checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleReset = () =>{
    setFeedback('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback('');
    setIsLoading(true);

    if (!receiptFile) {
      setFileError('Please upload a receipt file.'); // Set file error if no file is uploaded
      setIsLoading(false);
      return;
    }

    const expenseData = {
      ...formData
    };

    console.log(expenseData);
    console.log(name);

    try {
      const user=JSON.parse(localStorage.getItem("user"));
      const email=user.email;
      const formData = new FormData();
      formData.append('file', receiptFile);
      formData.append('email',email);
      const uploadResponse = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      expenseData.receiptFileId = uploadResponse.data;
    
    
    const response = await fetch('http://127.0.0.1:5001/submit-expense', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(expenseData)
    });
    

      setIsLoading(false);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';

      while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value);
          setFeedback(result);
      }

      setIsLoading(false);

  } 
  catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
  }
};


  return (
    isAuthenticated ? (
      <>
        <div className="navbar-fixed">
          <Navbar />
        </div>
        <div className='container-scrollable'>
          <Container className="glass-panel main-form-container">
            <Typography variant="h4" align="center" className="form-title">
              EXPENSE REPORT
            </Typography>
            <div className='overall-container'>
              <form onSubmit={handleSubmit} className="expense-form">
                <Typography variant="h6" className="form-section-title">
                  Enter Expense Details
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <div className="date-picker-wrapper">
                      <TextField 
                        className='label-required custom-field'
                        fullWidth
                        label="Transaction Date"
                        name="transactionDate"
                        value={formData.transactionDate}
                        onClick={() => setIsCalendarOpen(true)}
                        required
                        InputLabelProps={{ shrink: formData.transactionDate ? true : false }}
                        InputProps={{
                          readOnly: true,
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={(e) => { e.stopPropagation(); setIsCalendarOpen(!isCalendarOpen); }}>
                                <CalendarTodayIcon style={{ color: 'var(--text-secondary)' }} />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      {isCalendarOpen && (
                        <div className="glassy-calendar glass-panel" onClick={(e) => e.stopPropagation()}>
                          <div className="calendar-header">
                            <button type="button" onClick={() => handleMonthChange('prev')}>&lt;</button>
                            <div className="calendar-selects">
                              <select
                                value={currentMonth}
                                onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                                className="calendar-select"
                              >
                                {months.map((m, idx) => (
                                  <option key={m} value={idx}>{m}</option>
                                ))}
                              </select>
                              <select
                                value={currentYear}
                                onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                                className="calendar-select"
                              >
                                {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - 15 + i).map(year => (
                                  <option key={year} value={year}>{year}</option>
                                ))}
                              </select>
                            </div>
                            <button type="button" onClick={() => handleMonthChange('next')}>&gt;</button>
                          </div>
                          
                          <div className="calendar-weekdays">
                            {weekdays.map(d => <div key={d} className="weekday">{d}</div>)}
                          </div>
                          
                          <div className="calendar-days">
                            {Array(getFirstDayOfMonth(currentMonth, currentYear)).fill(null).map((_, i) => (
                              <div key={`empty-${i}`} className="empty-day"></div>
                            ))}
                            {Array.from({ length: getDaysInMonth(currentMonth, currentYear) }, (_, i) => i + 1).map(day => {
                              const formattedMonth = String(currentMonth + 1).padStart(2, '0');
                              const formattedDay = String(day).padStart(2, '0');
                              const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;
                              const isSelected = formData.transactionDate === dateStr;
                              
                              return (
                                <button
                                  key={day}
                                  type="button"
                                  className={`day-btn ${isSelected ? 'selected' : ''}`}
                                  onClick={() => handleDaySelect(day)}
                                >
                                  {day}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      className="custom-field"
                      fullWidth
                      label="Business Purpose"
                      name="businessPurpose"
                      value={formData.businessPurpose}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      className="custom-field"
                      fullWidth
                      label="Vendor Description"
                      name="vendorDescription"
                      value={formData.vendorDescription}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      className="custom-field"
                      fullWidth
                      label="Location/ Destination"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth className="custom-field">
                      <InputLabel style={{ backgroundColor: 'var(--bg-primary)', padding: '0 6px' }}>
                        Payment Type <span style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <Select
                        name="paymentType"
                        value={formData.paymentType}
                        onChange={handleChange}
                        required
                      >
                        {paymentOptions.map((option) => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      className='label-required custom-field'
                      fullWidth
                      label="Total Amount ( including tax )"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      type="number"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth className="custom-field">
                      <InputLabel style={{ backgroundColor: 'var(--bg-primary)', padding: '0 6px' }}>
                        Currency <span style={{ color: 'red' }}>*</span>
                      </InputLabel>
                      <Select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        required
                      >
                        {currencyOptions.map((option) => (
                          <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      className="custom-field"
                      fullWidth
                      label="Tax"
                      name="taxAndPostedAmount"
                      value={formData.taxAndPostedAmount}
                      onChange={handleChange}
                      type="number"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth className="custom-checkbox">
                      <FormControlLabel
                        control={                  
                          <Checkbox
                            value={formData.personalExpense}
                            checked={formData.personalExpense}
                            onChange={handleChange}
                            name="personalExpense"
                            color="primary"
                          />
                        }
                        label="Personal Expense"
                      />
                    </FormControl>  
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      className="custom-field"
                      fullWidth
                      label="Why was this expense made?"
                      name="comment"
                      value={formData.comment}
                      onChange={handleChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" className="form-upload-title">
                      Upload Your Receipt
                    </Typography>
                    <Box {...getRootProps()} className="dropzone-box">
                      <IconButton className="upload-icon-btn">
                        <PermMedia className="upload-icon" />
                      </IconButton>
                      <input {...getInputProps()} />
                      <Typography variant="body1" className="upload-text">
                        {filename ? `File uploaded: ${filename}` : 'Upload or drag files here.'}
                      </Typography>
                      <Typography variant="body2" className="upload-subtext">
                        Supports: .png, .jpg, .jpeg, .pdf, .tif, .tiff
                      </Typography>
                      {fileError && (
                        <Typography variant="body2" className="upload-error">
                          {fileError}
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  <Grid item xs={12} className="form-actions">
                    <Button type="submit" className="premium-btn submit-btn">
                      Generate Feedback ✨
                    </Button>
                    <Button onClick={handleReset} className="premium-btn outline-btn reset-btn">
                      <GrPowerReset />
                    </Button>
                  </Grid>
                </Grid>
              </form>

              <div className="feedback-container">
                <Box className="feedback-box glass-panel">
                  <Typography variant="h6" className="feedback-title">
                    Feedback
                  </Typography>

                  {feedback === '' ? (
                    !isLoading ? (
                      <div className="feedback-placeholder">
                        <Typography variant="body2">Your feedback will be accessible here.</Typography>
                      </div>
                    ) : (
                      <CircularProgress className="feedback-loader" />
                    )
                  ) : (
                    <div className="feedback-content">
                      {feedback.split('\n').map((point, index) => (
                        <Typography key={index} variant="body1" className="feedback-point">
                          {point}
                        </Typography>
                      ))}
                    </div>
                  )}
                </Box>
              </div>
            </div>
          </Container>
        </div>
      </>
    ) : (
      <Typography variant="h6" align="center" className="login-prompt">
        Please log in to access this page.
      </Typography>
    )
  );
}

export default ExpenseForm;

