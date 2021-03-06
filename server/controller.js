const profileModel = require('./models/profile.js');
const offeringsModel = require('./models/offerings.js');
const messagesModel = require('./models/messages.js');
const AuthModel = require('./models/AuthModel.js');
const AvailabilityModel = require('./models/AvailabilityModel.js');
const ScheduleModel = require('./models/schedules.js');

const getOfferingsByProfile = (req, res) => {
  const { id } = req.body;
  offeringsModel.getOfferingsByProfile(id) // (count, page)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => console.log('Error retrieving offerings from model: ', err));
};

const getAllOfferings = (req, res) => {
  offeringsModel.getAllOfferings() // (count, page)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => console.log('Error retrieving offerings from model: ', err));
};

const getMultiOfferings = (req, res) => {
  console.log(req.body);
  const { filterArr } = req.body;
  offeringsModel.getMultiOfferings(filterArr) // (count, page)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => console.log('Error retrieving offerings from model: ', err));
};

const searchOfferings = (req, res) => {
  console.log('!');
  console.log('search term: ', req.body.search);
  offeringsModel.searchOfferings(req.body.search)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => console.log('Error retrieving offerings from model: ', err));
};

const getProfile = (req, res) => {
  if (req.body.id === undefined) {
    res.status(400).send('Profile ID required');
  }
  console.log(req.body.id);
  profileModel.getById(req.body.id)
    .then((data) => {
      console.log('successfully retrieved profile');
      res.status(200).send(data);
    })
    .catch((err) => console.log('Error retrieving profile: ', err));
};

const getMessages = (req, res) => {
  messagesModel.getMessages(req.body) // (userId, withId = null, page = 1, count = 10)
    .then((data) => {
      console.log(data);
      res.status(200).send(data);
    })
    .catch((err) => console.log('Error retrieving messages from model: ', err));
};

const postMessage = (req, res) => {
  messagesModel.postMessage(req.body)
    .then(() => {
      res.status(201).send('posted message');
    })
    .catch((err) => console.log('Error creating message ', err));
};

const getSchedule = (req, res) => {
  const dateStr = req.query.date;
  const date = new Date(dateStr);
  ScheduleModel.getOfferingSchedule(date.toISOString().slice(0, 10),
    req.query.offeringId, (err, data) => {
      if (err) {
        console.log('error getting offering schedule', err);
        res.status(500);
      } else {
        console.log(data);
        res.json(data.map((item) => ({
          availability_id: item.availability_id,
          start_time: item.start_time.toTimeString().slice(0, 5),
          end_time: item.end_time.toTimeString().slice(0, 5),
        })));
      }
    });
};

const createBooking = (req, res) => {
  ScheduleModel.createBooking(req.body)
    .then(() => {
      res.status(201).send('Created booking');
    })
    .catch((err) => console.log('Error creating booking" ', err));
};

const getProfileSchedule = (req, res) => {
  const dateStr = req.query.date;
  const date = new Date(dateStr);
  ScheduleModel.getBooking(req.query.studentId, date.toISOString().slice(0, 10),
    (err, data) => {
      if (err) {
        console.log('error getting schedule', err);
        res.status(500);
      } else {
        console.log('successfully retrieved schedule', data);
        res.json(data.map((item) => ({
          booking_id: item.booking_id,
          start_time: item.start_time.toTimeString().slice(0, 5),
          end_time: item.end_time.toTimeString().slice(0, 5),
          offering_name: item.offering_name,
        })));
      }
    });
};

const deleteBooking = (req, res) => {
  ScheduleModel.deleteBooking(req.query.id, (err, data) => {
    if (err) {
      console.log('error deleting booking', err);
      res.status(500);
    } else {
      console.log('successfully deleted booking', data);
    }
  });
};

const createProfile = (req, res) => {
  profileModel.create(req.body)
    .then(() => {
      res.status(201).send('Created');
    })
    .catch((err) => console.log('Error creating user" ', err));
};

const goodAuth = (req, res) => {
  // This function only gets called after passport authenticates successfully.
  res.status(200).send(req.user);
};

const createNewUser = (req, res) => {
  console.log('req.body: ', req.body);
  const defaultPhotoUrl = 'https://t3.ftcdn.net/jpg/00/64/67/80/240_F_64678017_zUpiZFjj04cnLri7oADnyMH0XBYyQghG.jpg';
  const profile = {
    name: `${req.body.firstName} ${req.body.lastName}`,
    photo: req.body.photoUrl === '' ? defaultPhotoUrl : req.body.photoUrl,
    mentor: req.body.isMentor,
  };
  const user = {};

  profileModel.create(profile)
    .then((profileModelResults) => {
      console.log('Results from profiles insertion: ', profileModelResults);
      const authUser = {
        profileId: profileModelResults.insertId,
        email: req.body.email,
        password: req.body.password,
      };
      user.profile_id = profileModelResults.insertId;
      return AuthModel.create(authUser);
    })
    .then((authModelResults) => {
      console.log(`Inserted ${authModelResults.affectedRows} rows into auth table`);
      user.id = authModelResults.insertId;
      if (!req.body.isMentor) {
        req.login(user, (err) => {
          if (err) console.log('Error logging new user in: ', err);
          console.log('This is the req.login callback. req.user should be: ', req.user);
          res.status(201).send(req.user);
        });
      }
      return null;
    })
    .catch((err) => {
      res.status(500).send('Internal server error');
      console.log('Error inserting into auth table: ', err);
    })
    .then(() => {
      if (!req.body.isMentor) {
        return null;
      }

      const offering = {
        name: req.body.offeringName,
        description: req.body.offeringDesc,
        mentor_id: user.profile_id,
      };
      return offeringsModel.insertOne(offering);
    })
    .then((offeringModelResults) => {
      if (!req.body.isMentor) {
        return null;
      }

      console.log('Response from adding to offerings table: ', offeringModelResults);
      return AvailabilityModel.insertMany(offeringModelResults.insertId, req.body.availabilities);
    })
    .then((availabilityModelResults) => {
      if (!req.body.isMentor) {
        return null;
      }

      console.log(`Inserted ${availabilityModelResults.affectedRows} row(s) into availabilities table`);
      req.login(user, (err) => {
        if (err) console.log('Error logging new user in: ', err);
        console.log('This is the req.login callback. req.user should be: ', req.user);
        res.status(201).send(req.user);
      });
      return null;
    })
    .catch((err) => {
      console.log('Error inserting new user: ', err);
      res.status(500).send('Internal server error');
    });
};

module.exports = {
  getOfferingsByProfile,
  getAllOfferings,
  getMultiOfferings,
  getProfile,
  getMessages,
  createProfile,
  goodAuth,
  createNewUser,
  postMessage,
  getSchedule,
  searchOfferings,
  createBooking,
  getProfileSchedule,
  deleteBooking,
};
