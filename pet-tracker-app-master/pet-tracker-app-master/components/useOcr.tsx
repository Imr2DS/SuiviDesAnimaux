import { firebase } from "@react-native-firebase/database";
import { TextRecognition } from "@react-native-ml-kit/vision";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";
import React, { useEffect, useState } from "react";
import { Button, Image, Text, ToastAndroid, View } from "react-native";
import { styled } from "tamagui";

const Container = styled(View, {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
});

const Title = styled(Text, {
  fontSize: 24,
  fontWeight: "bold",
});

const OcrComponent = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Permissions.askAsync(Permissions.CAMERA);
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleCapture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setImageUri(photo.uri);
      runTextRecognition(photo.uri);
    }
  };

  const runTextRecognition = async (imageUri) => {
    try {
      const image = await TextRecognition.fromUri(imageUri);
      const visionText = image.text.replace(/\n/g, "").replace(/\s/g, "");
      console.log("Detected Text: ", visionText);

      const extractedCinId = extractRegex(
        visionText,
        "IDMAR[A-Z0-9]+<\\d*([A-Z0-9]{6,})<<+"
      );
      const extractedNom = extractRegex(
        visionText,
        "([A-Z]{3,})<<[A-Z]{3,}<<+"
      );
      const extractedPrenom = extractRegex(
        visionText,
        "[A-Z]{3,}<<([A-Z]{3,})<<+"
      );

      if (extractedCinId && extractedNom && extractedPrenom) {
        authenticateUser(extractedCinId, extractedNom, extractedPrenom);
      } else {
        ToastAndroid.show(
          "Invalid data, please try again.",
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      console.error("OCR error: ", error);
      ToastAndroid.show("OCR analysis failed.", ToastAndroid.SHORT);
    }
  };

  const extractRegex = (input, pattern) => {
    const regex = new RegExp(pattern);
    const match = regex.exec(input);
    return match ? match[1] : null;
  };

  const authenticateUser = (cin, nom, prenom) => {
    const usersRef = firebase.database().ref("users");

    usersRef
      .child(cin)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          navigateToAccueil(cin);
        } else {
          const user = { cin, nom, prenom };
          usersRef
            .child(cin)
            .set(user)
            .then(() => {
              ToastAndroid.show(
                "Authentication successful.",
                ToastAndroid.SHORT
              );
              navigateToAccueil(cin);
            })
            .catch((error) => {
              ToastAndroid.show(
                "Error during registration.",
                ToastAndroid.SHORT
              );
            });
        }
      })
      .catch((error) => {
        ToastAndroid.show(
          "Error during Firebase interaction.",
          ToastAndroid.SHORT
        );
      });
  };

  const navigateToAccueil = (cin) => {
    // Logic to navigate to the "Accueil" screen
    console.log("Navigating to accueil with CIN: ", cin);
  };

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <Container>
      <Title>OCR Recognition</Title>
      <Camera style={{ flex: 1, width: "100%" }} ref={setCameraRef}>
        <Button title="Capture" onPress={handleCapture} />
      </Camera>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={{ width: 200, height: 200 }} />
      )}
    </Container>
  );
};

export default OcrComponent;
