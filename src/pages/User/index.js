import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Loading,
} from './styles';

export default function User({ navigation }) {
  const user = navigation.getParam('user');
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const storageUser = navigation.getParam('user');
      const response = await api.get(`/users/${storageUser.login}/starred`);

      setStars(response.data);
      setLoading(false);
    }

    fetchData();
  }, []);

  return (
    <Container>
      <Header>
        <Avatar source={{ uri: user.avatar }} />
        <Name>{user.name}</Name>
        <Bio>{user.bio}</Bio>
      </Header>
      {loading ? (
        <Loading />
      ) : (
        <Stars
          data={stars}
          keyExtractor={star => String(star.id)}
          renderItem={({ item }) => (
            <Starred>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />
      )}
    </Container>
  );
}

User.navigationOptions = ({ navigation }) => ({
  title: navigation.getParam('user').name,
});

User.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func,
  }).isRequired,
};
