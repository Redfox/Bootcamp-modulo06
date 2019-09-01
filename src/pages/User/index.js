import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import api from '../../services/api';

export default function User({ navigation }) {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const user = navigation.getParam('user');
      const response = await api.get(`/users/${user.login}/starred`);

      setStars(response.data);
    }

    fetchData();
  }, []);

  return <View />;
}

User.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('user').name,
});

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};
