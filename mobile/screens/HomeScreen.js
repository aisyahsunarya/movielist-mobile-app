import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";

import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import api, { API_URL } from "../services/api";

export default function HomeScreen({ navigation }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMovies = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/movies");

      setMovies(response.data.data);
    } catch (error) {
      console.log(error);

      Alert.alert(
        "Connection Error",
        "Gagal mengambil data movie dari server."
      );
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getMovies();
    }, [])
  );

  const deleteMovie = (id) => {
    Alert.alert(
      "Delete Movie",
      "Apakah kamu yakin ingin menghapus film ini?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/api/movies/${id}`);

              getMovies();
            } catch (error) {
              Alert.alert(
                "Error",
                "Movie gagal dihapus."
              );
            }
          },
        },
      ]
    );
  };

  const renderMovie = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.card}
      onPress={() =>
        navigation.navigate("Detail", {
          id: item.id,
        })
      }
    >
      {item.image ? (
        <Image
          source={{
            uri: `${API_URL}/uploads/${item.image}`,
          }}
          style={styles.poster}
        />
      ) : (
        <View style={styles.noPoster}>
          <Ionicons
            name="film-outline"
            size={40}
            color="#777"
          />

          <Text style={styles.noPosterText}>
            No Poster
          </Text>
        </View>
      )}

      <View style={styles.movieInfo}>
        <Text
          style={styles.movieTitle}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        <View style={styles.genreBadge}>
          <Text style={styles.genreText}>
            {item.genre}
          </Text>
        </View>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons
              name="calendar-outline"
              size={15}
              color="#9e9eaa"
            />

            <Text style={styles.metaText}>
              {item.releaseYear}
            </Text>
          </View>

          <View style={styles.rating}>
            <Ionicons
              name="star"
              size={16}
              color="#FFD54A"
            />

            <Text style={styles.ratingText}>
              {item.rating ?? "-"}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate("Edit", {
                id: item.id,
              })
            }
          >
            <Ionicons
              name="create-outline"
              size={17}
              color="#fff"
            />

            <Text style={styles.actionText}>
              Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() =>
              deleteMovie(item.id)
            }
          >
            <Ionicons
              name="trash-outline"
              size={17}
              color="#ff6262"
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#0B0B0F"
      />

      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>
            MovieList
          </Text>

          <Text style={styles.headerSubtitle}>
            Your personal movie collection
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Ionicons
            name="film"
            size={25}
            color="#E50914"
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color="#E50914"
          />

          <Text style={styles.loadingText}>
            Loading movies...
          </Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) =>
            item.id.toString()
          }
          renderItem={renderMovie}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons
                name="film-outline"
                size={65}
                color="#444"
              />

              <Text style={styles.emptyTitle}>
                No movies yet
              </Text>

              <Text style={styles.emptyText}>
                Tambahkan film pertamamu dengan menekan tombol +
              </Text>
            </View>
          }
        />
      )}

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.addButton}
        onPress={() =>
          navigation.navigate("Create")
        }
      >
        <Ionicons
          name="add"
          size={32}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0F",
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "#777785",
    marginTop: 4,
    fontSize: 13,
  },

  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#18181F",
    justifyContent: "center",
    alignItems: "center",
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },

  card: {
    backgroundColor: "#17171E",
    borderRadius: 18,
    marginBottom: 16,
    flexDirection: "row",
    overflow: "hidden",
    minHeight: 190,
  },

  poster: {
    width: 125,
    minHeight: 190,
    resizeMode: "cover",
  },

  noPoster: {
    width: 125,
    minHeight: 190,
    backgroundColor: "#22222A",
    justifyContent: "center",
    alignItems: "center",
  },

  noPosterText: {
    color: "#777",
    marginTop: 7,
  },

  movieInfo: {
    flex: 1,
    padding: 15,
  },

  movieTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 25,
  },

  genreBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#272730",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 10,
  },

  genreText: {
    color: "#C4C4CC",
    fontSize: 12,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  metaText: {
    color: "#9E9EAA",
    marginLeft: 5,
  },

  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 18,
  },

  ratingText: {
    color: "#FFF",
    marginLeft: 5,
    fontWeight: "700",
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 14,
  },

  editButton: {
    backgroundColor: "#E50914",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  deleteButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#302126",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 9,
  },

  actionText: {
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 5,
  },

  addButton: {
    position: "absolute",
    right: 22,
    bottom: 28,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#E50914",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#999",
    marginTop: 10,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 120,
    paddingHorizontal: 30,
  },

  emptyTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 15,
  },

  emptyText: {
    color: "#777",
    textAlign: "center",
    marginTop: 7,
    lineHeight: 20,
  },
});