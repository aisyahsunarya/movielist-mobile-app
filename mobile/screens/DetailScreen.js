import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import api, { API_URL } from "../services/api";

export default function DetailScreen({ route }) {
  const { id } = route.params;

  const [movie, setMovie] = useState(null);

  const getMovie = async () => {
    try {
      const response = await api.get(
        `/api/movies/${id}`
      );

      setMovie(response.data.data);
    } catch (error) {
      Alert.alert(
        "Error",
        "Gagal mengambil detail movie."
      );
    }
  };

  useEffect(() => {
    getMovie();
  }, []);

  if (!movie) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loading}>
          Loading...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {movie.image ? (
        <Image
          source={{
            uri: `${API_URL}/uploads/${movie.image}`,
          }}
          style={styles.poster}
        />
      ) : (
        <View style={styles.noPoster}>
          <Text>No Poster</Text>
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.title}>
          {movie.title}
        </Text>

        <Text style={styles.meta}>
          {movie.genre} • {movie.releaseYear}
        </Text>

        <Text style={styles.rating}>
          ⭐ {movie.rating ?? "-"}
        </Text>

        <Text style={styles.heading}>
          Description
        </Text>

        <Text style={styles.description}>
          {movie.description}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  poster: {
    width: "100%",
    height: 470,
    resizeMode: "cover",
  },

  noPoster: {
    height: 400,
    backgroundColor: "#ddd",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
  },

  meta: {
    marginTop: 8,
    fontSize: 16,
    color: "#666",
  },

  rating: {
    fontSize: 18,
    marginTop: 9,
  },

  heading: {
    marginTop: 25,
    fontSize: 18,
    fontWeight: "bold",
  },

  description: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
  },

  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loading: {
    marginTop: 10,
  },
});