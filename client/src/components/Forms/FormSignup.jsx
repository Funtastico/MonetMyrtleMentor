import React, { useState, useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { loginContext, loginProfileContext } from '../../context.jsx';

export default function FormSignup({ isMentor }) {
  const history = useHistory();
  const { setLogin } = useContext(loginContext);
  const { setLoginIdx } = useContext(loginProfileContext);
  const [fname, setFName] = useState('');
  const [lname, setLName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [offeringName, setOfferingName] = useState('');
  const [offeringDesc, setOfferingDesc] = useState('');
  const [availabilities, setAvailabilities] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [startTime, setStartTime] = useState(new Date().toTimeString().slice(0, 5));
  const [endTime, setEndTime] = useState(new Date().toTimeString().slice(0, 5));
  const [generalMessage, setGeneralMessage] = useState(null);

  useEffect(() => {
    console.log('availabilities array has changed to: ', availabilities);
  }, [availabilities]);

  const addAvailabilitiesHandler = () => {
    console.log('What format does the date/time picker have? ', typeof startTime);
    console.log(startTime);
    console.log(endTime);
    const newTimeBlock = {
      startTime: new Date(`${date} ${startTime}`).toISOString(),
      endTime: new Date(`${date} ${endTime}`).toISOString(),
    };
    const newAvailabilities = [...availabilities];
    newAvailabilities.push(newTimeBlock);
    setAvailabilities(newAvailabilities);
    setStartTime('');
    setEndTime('');
  };

  const validatePassword = () => {
    let valid = false;
    const passwordField = document.getElementById('input-password');
    const confirmPasswordField = document.getElementById('input-confirmpassword');

    if (passwordField.value !== confirmPasswordField.value) {
      confirmPasswordField.setCustomValidity('Passwords do not match');
    } else {
      confirmPasswordField.setCustomValidity('');
      valid = true;
    }
    confirmPasswordField.reportValidity();
    return valid;
  };

  const clearFields = () => {
    setFName('');
    setLName('');
    setEmail('');
    setPassword('');
    setConfirmPwd('');
    setPhotoUrl('');
    if (isMentor) {
      setOfferingName('');
      setOfferingDesc('');
    }
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();

    if (!validatePassword()) return;
    if (password.length < 8) return;

    const formData = {
      firstName: fname,
      lastName: lname,
      email,
      photoUrl,
      password,
      isMentor: !!isMentor,
      offeringName,
      offeringDesc,
      availabilities,
    };

    axios.post('/api/user/new', formData)
      .then((response) => {
        if (response.status === 201) {
          setGeneralMessage('Your account has been created! Redirecting you in 3 seconds.');
          clearFields();
          setLoginIdx(response.data.profile_id);
          setLogin(true);
          setTimeout(() => {
            history.push('/offerings');
          }, 3000);
        }
      })
      .catch((err) => {
        console.log('Error POSTing form data: ', err);
        setGeneralMessage('There was an error creating your account');
      });
  };

  const passwordChangeHandler = (e) => {
    if (e.target.name === 'password') {
      setPassword(e.target.value);
    }
    if (e.target.name === 'confirmpassword') {
      setConfirmPwd(e.target.value);
    }
  };

  const mentorFormComponents = (
    <>
      <label htmlFor="input-offeringname">
        Offering Name:&nbsp;
        <br />
        <input id="input-offeringname" name="offeringname" type="text" placeholder="mentoring topic" value={offeringName} onChange={(e) => setOfferingName(e.target.value)} requried />
      </label>
      <br />
      <label htmlFor="input-offeringdesc">
        Offering Description:&nbsp;
        <br />
        <textarea id="input-offeringdesc" name="offeringdesc" type="text" placeholder="description of your topic/offering (minimum 50 characters)" value={offeringDesc} onChange={(e) => setOfferingDesc(e.target.value)} required minLength="50" rows="4" cols="45" />
      </label>
      <p>Add the blocks of time you want to have available to mentees:</p>
      <label htmlFor="input-date">
        Date:&nbsp;
        <input id="input-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </label>
      <br />
      <label htmlFor="input-starttime">
        Start Time:&nbsp;
        <input id="input-starttime" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      </label>
      &nbsp;&nbsp;
      <label htmlFor="input-endtime">
        End Time:&nbsp;
        <input id="input-endtime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      </label>
      &nbsp;&nbsp;
      <button id="button-availabilityadd" type="button" onClick={addAvailabilitiesHandler}>Add</button>
      <br />
      {availabilities.length === 0
        ? (<p>You must add at least one block of time for your offering</p>)
        : null}
      {availabilities.length > 0 ? (<p>You&apos;ve added the following blocks of time:</p>) : null}
      {availabilities.map((timeBlock) => (
        <div key={timeBlock.startTime}>
          <p>
            Start:&nbsp;
            {new Date(timeBlock.startTime).toLocaleString()}
            <br />
            End:&nbsp;
            {new Date(timeBlock.endTime).toLocaleString()}
          </p>
          <hr />
        </div>
      ))}
    </>
  );

  return (
    <div className="container-form">
      <form id="form-newuser">
        <label htmlFor="input-fname">
          First Name:&nbsp;&nbsp;
          <input id="input-fname" name="fname" type="text" placeholder="first name" value={fname} onChange={(e) => setFName(e.target.value)} required />
        </label>
        <br />
        <label htmlFor="input-lname">
          Last Name:&nbsp;&nbsp;
          <input id="input-lname" name="lname" type="text" placeholder="last name" value={lname} onChange={(e) => setLName(e.target.value)} required />
        </label>
        <br />
        <label htmlFor="input-email">
          Email:&nbsp;&nbsp;
          <input id="input-email" name="email" type="email" placeholder="email address" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <br />
        <label htmlFor="input-photourl">
          URL to your photo:&nbsp;&nbsp;
          <input id="input-photourl" name="photourl" type="text" placeholder="photo url" value={photoUrl} onChange={(e) => setPhotoUrl(e.target.value)} />
        </label>
        <br />
        <label htmlFor="input-password">
          Password:&nbsp;
          <br />
          <input id="input-password" name="password" type="password" placeholder="password" value={password} onChange={passwordChangeHandler} minLength="8" required />
        </label>
        <label htmlFor="input-confirmpassword">
          <br />
          <input id="input-confirmpassword" name="confirmpassword" type="password" placeholder="confirm password" value={confirmPwd} onChange={passwordChangeHandler} minLength="8" required />
        </label>
        <br />
        {isMentor ? mentorFormComponents : null}
        <button id="button-formsubmit" type="submit" onClick={formSubmitHandler} className="login-button">Submit</button>
        {generalMessage ? (<p>{generalMessage}</p>) : null}
      </form>
    </div>
  );
}
