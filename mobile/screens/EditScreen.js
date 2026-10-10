import React, {
  useEffect,
  useState,
} from "react";

import {
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import api, {
  API_URL,
} from "../services/api";

export default function EditScreen({
  route,
  navigation,
}) {
  const { id } = route.params;

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");

  const [releaseYear, setReleaseYear] =
    useState("");

  const [rating, setRating] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [oldImage, setOldImage] =
    useState(null);

  const [newImage, setNewImage] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const getMovie = async () => {
    try {
      const response = await api.get(
        `/api/movies/${id}`
      );

      const movie = response.data.data;

      setTitle(movie.title);
      setGenre(movie.genre);

      setReleaseYear(
        String(movie.releaseYear)
      );

      setRating(
        movie.rating !== null
          ? String(movie.rating)
          : ""
      );

      setDescription(movie.description);
      setOldImage(movie.image);
    } catch (error) {
      Alert.alert(
        "Error",
        "Data movie gagal diambil."
      );
    }
  };

  useEffect(() => {
    getMovie();
  }, []);

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission Required",
        "Aplikasi membutuhkan izin galeri."
      );

      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        quality: 0.8,
      });

    if (!result.canceled) {
      setNewImage(result.assets[0]);
    }
  };

  const updateMovie = async () => {
    if (
      !title ||
      !genre ||
      !releaseYear ||
      !description
    ) {
      Alert.alert(
        "Data Belum Lengkap",
        "Data movie wajib dilengkapi."
      );

      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("genre", genre);

      formData.append(
        "releaseYear",
        releaseYear
      );

      if (rating) {
        formData.append("rating", rating);
      }

      formData.append(
        "description",
        description
      );

      if (newImage) {
        formData.append("image", {
          uri: newImage.uri,

          name:
            newImage.fileName ||
            `poster-${Date.now()}.jpg`,

          type:
            newImage.mimeType ||
            "image/jpeg",
        });
      }

      await api.put(
        `/api/movies/${id}`,
        formData
      );

      Alert.alert(
        "Berhasil",
        "Movie berhasil diperbarui.",
        [
          {
            text: "OK",
            onPress: () =>
              navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.log(
        error.response?.data ||
          error.message
      );

      Alert.alert(
        "Error",
        "Movie gagal diperbarui."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.label}>
        Poster
      </Text>

      <TouchableOpacity
        style={styles.imagePicker}
        onPress={pickImage}
      >
        {newImage ? (
          <Image
            source={{
              uri: newImage.uri,
            }}
            style={styles.poster}
          />
        ) : oldImage ? (
          <Image
            source={{
              uri: `${API_URL}/uploads/${oldImage}`,
            }}
            style={styles.poster}
          />
        ) : (
          <Text>Choose Poster</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>
        Movie Title
      </Text>

      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>
        Genre
      </Text>

      <TextInput
        style={styles.input}
        value={genre}
        onChangeText={setGenre}
      />

      <Text style={styles.label}>
        Release Year
      </Text>

      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={releaseYear}
        onChangeText={setReleaseYear}
      />

      <Text style={styles.label}>
        Rating
      </Text>

      <TextInput
        style={styles.input}
        keyboardType="decimal-pad"
        value={rating}
        onChangeText={setRating}
      />

      <Text style={styles.label}>
        Description
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.textArea,
        ]}
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={updateMovie}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading
            ? "UPDATING..."
            : "UPDATE MOVIE"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  label: {
    fontWeight: "600",
    marginTop: 13,
    marginBottom: 7,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 13,
    fontSize: 16,
  },

  textArea: {
    height: 120,
    textAlignVertical: "top",
  },

  imagePicker: {
    height: 260,
    backgroundColor: "#ddd",
    borderRadius: 12,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },

  poster: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  button: {
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});