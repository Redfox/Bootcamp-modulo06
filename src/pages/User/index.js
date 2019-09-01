import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
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
  const [loadingNextPage, setLoadingNextPage] = useState(false);
  const [page, setPage] = useState(1);
  const [endReached, setEndReached] = useState(false);
  const [refreshingList, setRefreshingList] = useState(false);
  const storageUser = navigation.getParam('user');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const response = await api.get(
        `/users/${storageUser.login}/starred?page=${page}`
      );

      setStars(response.data);
      setLoading(false);
    }

    fetchData();
    setRefreshingList(false);
  }, [refreshingList]);

  useEffect(() => {
    async function fetchData() {
      setLoadingNextPage(true);

      const response = await api.get(
        `/users/${storageUser.login}/starred?page=${page}`
      );

      if (response.data.length > 0) {
        setStars([...stars, ...response.data]);
      } else {
        setEndReached(true);
      }
      setLoadingNextPage(false);
    }

    if (page > 1 || refreshingList) {
      fetchData();
    }
  }, [page]);

  const loadMoreStarred = () => {
    if (!endReached && !loadingNextPage) {
      setPage(page + 1);
    }
  };

  const refreshList = () => {
    setPage(1);
    setRefreshingList(true);
  };

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
          onRefresh={refreshList}
          refreshing={refreshingList}
          keyExtractor={star => String(star.id)}
          onEndReachedThreshold={0.2}
          onEndReached={loadMoreStarred}
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
      {loadingNextPage && <ActivityIndicator color="#7159c1" />}
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
