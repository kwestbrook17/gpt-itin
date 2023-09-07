import React, { useState } from "react";
import styles from "./index.module.css";

const nationalParks = [
  { id: 1, name: "Acadia National Park" },
  { id: 2, name: "American Samoa National Park" },
  { id: 3, name: "Arches National Park" },
  { id: 4, name: "Badlands National Park" },
  { id: 5, name: "Big Bend National Park" },
  { id: 6, name: "Biscayne National Park" },
  { id: 7, name: "Black Canyon of the Gunnison National Park" },
  { id: 8, name: "Bryce Canyon National Park" },
  { id: 9, name: "Cape Cod National Seashore" },
  { id: 10, name: "Canyonlands National Park" },
  { id: 11, name: "Channel Islands National Park" },
  { id: 12, name: "Congaree National Park" },
  { id: 13, name: "Cuyahoga Valley National Park" },
  { id: 14, name: "Denali National Park" },
  { id: 15, name: "Dry Tortugas National Park" },
  { id: 16, name: "Everglades National Park" },
  { id: 17, name: "Glacier National Park" },
  { id: 18, name: "Grand Canyon National Park" },
  { id: 19, name: "Grand Teton National Park" },
  { id: 20, name: "Great Basin National Park" },
  { id: 21, name: "Great Sand Dunes National Park" },
  { id: 22, name: "Great Smoky Mountains National Park" },
  { id: 23, name: "Guadalupe Mountains National Park" },
  { id: 24, name: "Haleakalā National Park" },
  { id: 25, name: "Hawaii Volcanoes National Park" },
  { id: 26, name: "Hot Springs National Park" },
  { id: 27, name: "Hot Springs National Park" },
  { id: 28, name: "Isle Royale National Park" },
  { id: 29, name: "Joshua Tree National Park" },
  { id: 30, name: "Kings Canyon National Park" },
  { id: 31, name: "Kobuk Valley National Park" },
  { id: 32, name: "Lava Beds National Monument" },
  { id: 33, name: "Mammoth Cave National Park" },
  { id: 34, name: "Mesa Verde National Park" },
  { id: 35, name: "Mount Rainier National Park" },
  { id: 36, name: "North Cascades National Park" },
  { id: 37, name: "Olympic National Park" },
  { id: 38, name: "Petrified Forest National Park" },
  { id: 39, name: "Pictured Rocks National Lakeshore" },
  { id: 40, name: "Pinnacles National Park" },
  { id: 41, name: "Redwood National and State Parks" },
  { id: 42, name: "Rocky Mountain National Park" },
  { id: 43, name: "Saguaro National Park" },
  { id: 44, name: "Sequoia and Kings Canyon National Parks" },
  { id: 45, name: "Shenandoah National Park" },
  { id: 46, name: "Theodore Roosevelt National Park" },
  { id: 47, name: "Vicksburg National Military Park" },
  { id: 48, name: "Voyageurs National Park" },
  { id: 49, name: "Wind Cave National Park" },
  { id: 50, name: "Wrangell-St. Elias National Park" },
  { id: 51, name: "Yellowstone National Park" },
  { id: 52, name: "Yosemite National Park" },
  { id: 53, name: "Zion National Park" },
];


export default function Home() {
  const [parkInput, setParkInput] = useState("");
  const [daysInput, setDaysInput] = useState("");
  const [result, setResult] = useState("");
   const [savedTrips, setSavedTrips] = useState([]);


  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ park: parkInput, days: daysInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setParkInput("");
      setDaysInput("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  // Function to handle saving the trip
  function saveTrip() {
    if (result) {
      const newSavedTrips = [...savedTrips, result];
      setSavedTrips(newSavedTrips);
      // Save the updated list of trips to local storage
      localStorage.setItem("savedTrips", JSON.stringify(newSavedTrips));
    }
  }

  // Function to handle clearing the current trip
  function clearTrip() {
    setResult("");
  }

  // Function to handle displaying saved trips
  function showSavedTrips() {
    const savedTrips = JSON.parse(localStorage.getItem("savedTrips")) || [];
    if (savedTrips.length === 0) {
      alert("No saved trips yet.");
    } else {
      const savedTripsText = savedTrips.join("\n\n");
      alert("Saved Trips:\n\n" + savedTripsText);
    }
  }


  return (
    <div>
      <main className={styles.main}>
        <h3>Generate National Park Itinerary</h3>
        <form onSubmit={onSubmit}>
          <label htmlFor="park">Select a national park:</label>
          <select
            name="park"
            value={parkInput}
            onChange={(e) => setParkInput(e.target.value)}
          >
            <option value="">Select a national park</option>
            {nationalParks.map((park) => (
              <option key={park.id} value={park.name}>
                {park.name}
              </option>
            ))}
          </select>
          <br />
          <label htmlFor="days">Number of Days:</label>
          <input
            type="text"
            name="days"
            placeholder="Number of Days"
            value={daysInput}
            onChange={(e) => setDaysInput(e.target.value)}
          />
          <br />
          <input type="submit" value="Generate itinerary" />
        </form>
        <div className={styles.result}>{result}</div>
        <div className={styles.result}>{result}</div>
        <button onClick={saveTrip}>Save Trip</button>
        <button onClick={clearTrip}>Clear</button>
      </main>
       <button
        className={styles.myTripsButton}
        onClick={showSavedTrips}
      >
        My Trips
      </button>
    </div>
  );
}
