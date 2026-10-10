import React, { useState } from "react";

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
import api from "../services/api";

export default function CreateScreen({
  navigation,
}) {
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [releaseYear, setReleaseYear] =
    useState("");
  const [rating, setRating] = useState("");
  const [description, setDescription] =
    useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] =
    useState(false);

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
      setImage(result.assets[0]);
    }
  };

  const saveMovie = async () => {
    if (
      !title ||
      !genre ||
      !releaseYear ||
      !description
    ) {
      Alert.alert(
        "Data Belum Lengkap",
        "Title, genre, release year, dan description wajib diisi."
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

      if (image) {
        formData.append("image", {
          uri: image.uri,

          name:
            image.fileName ||
            `poster-${Date.now()}.jpg`,

          type:
            image.mimeType ||
            "image/jpeg",
        });
      }

      await api.post(
        "/api/movies",
        formData
      );

      Alert.alert(
        "Berhasil",
        "Movie berhasil ditambahkan.",
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
        "Movie gagal ditambahkan."
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
        {image ? (
          <Image
            source={{ uri: image.uri }}
            style={styles.preview}
          />
        ) : (
          <Text style={styles.chooseText}>
            Choose Poster
          </Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>
        Movie Title
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Interstellar"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>
        Genre
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Sci-Fi"
        value={genre}
        onChangeText={setGenre}
      />

      <Text style={styles.label}>
        Release Year
      </Text>

      <TextInput
        style={styles.input}
        placeholder="2014"
        keyboardType="numeric"
        value={releaseYear}
        onChangeText={setReleaseYear}
      />

      <Text style={styles.label}>
        Rating
      </Text>

      <TextInput
        style={styles.input}
        placeholder="8.7"
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
        placeholder="Movie description..."
        multiline
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={saveMovie}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading
            ? "SAVING..."
            : "SAVE MOVIE"}
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

  preview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  chooseText: {
    color: "#555",
    fontWeight: "600",
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