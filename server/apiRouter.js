const router = require('express').Router();
const passport = require('passport');
const {
  getOfferingsByProfile,
  getAllOfferings,
  getMultiOfferings,
  getProfile,
  getMessages,
  createNewUser,
  postMessage,
  getSchedule,
  searchOfferings,
  goodAuth,
  createBooking,
  getProfileSchedule,
  deleteBooking,
} = require('./controller');

router.get('/offerings', getOfferingsByProfile);

router.get('/allOfferings', getAllOfferings);

router.post('/multiOfferings', getMultiOfferings);

router.post('/searchOfferings', searchOfferings);

router.post('/profile', getProfile);

router.get('/messages', getMessages);

router.post('/getMessages', getMessages);

router.post('/messages', postMessage);

router.get('/schedule', getSchedule);

router.post('/user/new', createNewUser);

router.post('/booking', createBooking);

router.delete('/booking', deleteBooking);

router.get('/profile/schedule', getProfileSchedule);

router.post('/user/login', passport.authenticate('local',
  {
    failureMessage: true,
  }), goodAuth);

router.get('/logout', (req, res) => {
  req.logout();
  res.status(200).send('Logged out');
});

router.get('/me', (req, res) => {
  let user = 'null';
  if (req.user !== undefined) {
    user = req.user;
  }
  console.log('=== This is in the request\'s \'session\' property: \n', req.session);
  console.log('=== This is the user: ', user);
  res.status(200).send(user);
});

module.exports = router;
