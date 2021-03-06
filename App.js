import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const BUSSTOP_URL = "https://arrivelah2.busrouter.sg/?id=14191";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [arrival, setArrival] = useState("");
  const [arrivaltime, setArrivaltime] = useState("");

  function dateConvert(time){
    const day = new Date(time)
    let [hour, minute, second] = day.toLocaleTimeString("en-US").split(":")
    const timeArranged = `${hour}:${minute}:${second}`
    return timeArranged
  } 

  function loadBusStopData() {
    setLoading(true);

    fetch(BUSSTOP_URL)
      .then((response) => response.json())
      .then((responseData) => {
        //console.log(responseData)
        const myBus = responseData.services.filter(
          (item) => item.no === "195"
        )[0];
        console.log(myBus);
        const duration_s = Math.floor(myBus.next.duration_ms / 1000)
        const minutes = Math.floor(duration_s / 60)
        const seconds = duration_s % 60
        setArrivaltime(dateConvert(myBus.next.time))

        if (seconds < 0) {
          setArrival("Oops, the bus just left. Don't be late for the next one!");
          setArrivaltime(dateConvert(myBus.subsequent.time));}
          else {
          setArrival("Bus coming in " + `${minutes} minutes and ${seconds} seconds`);
          setArrivaltime(dateConvert(myBus.next.time))}
        setLoading(false);

      });
  }

  useEffect(() => {
    const interval = setInterval(loadBusStopData, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bus arrival time:</Text>
      <Text style={styles.arrivalTime}>
        {loading ? <ActivityIndicator size="large" color="#aa8" /> : arrival}
      </Text>
      <Text style={styles.arrivalTime}>{arrivaltime}</Text>
      <TouchableOpacity onPress={null} style={styles.button}>
        <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  arrivalTime: {
    fontSize: 36,
    marginBottom: 24,
  },
  button: {
    backgroundColor: "green",
    padding: 24,
    borderRadius: 6,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});