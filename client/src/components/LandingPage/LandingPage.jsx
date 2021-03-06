import React, { useEffect, useContext, useState } from 'react';
import pageIdxContext from '../../context.jsx';
import Modal from '../Modal/Modal.jsx';
import FormSignup from '../Forms/FormSignup.jsx';

export default function LandingPage() {
  const { setPageIdx } = useContext(pageIdxContext);
  const [component, setComponent] = useState(null);

  const studentSignupHandler = () => {
    setComponent(<FormSignup />);
  };

  const mentorSignupHandler = () => {
    setComponent(<FormSignup isMentor />);
  };

  useEffect(() => {
    setPageIdx(0);
  }, []);

  return (
    <>
      <div className="landingPage-container">
        <img src="./landingPage.jpg" alt="style" />
        <div className="title">
          MentorUP
        </div>
        <div className="subtitle">
          The easist way to learn anything you are intrested, and share your talented and passion.
          Find the mentor from all over the world, flex timeline, flex structure,
          learn in the way you always imagine.
        </div>
        <button type="button" className="imStudent" onClick={studentSignupHandler}>I&apos;m a student</button>
        <button type="button" className="imMentor" onClick={mentorSignupHandler}>I&apos;m a mentor</button>
      </div>
      <Modal component={component} setComponent={setComponent} />
    </>

  );
}
