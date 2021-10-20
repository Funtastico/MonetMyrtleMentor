import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Offering from './Offering.jsx';

const Offerings = (props) => {
  const testArray = props.location.state.detail;
  const [renderArray, setRenderArray] = useState([1, 2]);
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
  const filterArr = testArray.filter(onlyUnique);

  for (let i = 0; i < filterArr.length; i++) {
    filterArr[i] += 1;
  }

  useEffect(() => {
    axios.post('/api/multiOfferings', { filterArr: [1, 2] })
      .then((res) => {
        setRenderArray(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    axios.post('/api/multiOfferings', { filterArr })
      .then((res) => {
        setRenderArray(res.data);
      })
      .catch((err) => console.error(err));
  }, [testArray]);

  return (
    <div>
      {renderArray.map((element) => (
        <Offering
          key={Math.random()}
          name={element.name}
          teaches={element.offering_name}
          star={element.rating}
          desc={element.description}
          photo={element.photo}
        />
      ))}
    </div>
  );
};
export default Offerings;
