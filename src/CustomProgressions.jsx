import React, { useState, useEffect } from "react";

const chordData = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "i",
  "ii",
  "iii",
  "iv",
  "v",
  "vi",
  "vii",
  "bII",
  "bIII",
  "bVI",
  "bVII",
];

const ChordButtons = ({ onChordClick }) => {
  const allChords = chordData;

  return (
    <div className="mb-4">
      <h3 className="text-lg font-semibold mb-2">All Chords:</h3>
      <div className="flex flex-wrap gap-2">
        {allChords.map((chord, index) => (
          <button
            key={index}
            onClick={() => onChordClick(chord)}
            className="px-2 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 transition"
          >
            {chord}
          </button>
        ))}
      </div>
    </div>
  );
};

const CustomProgressions = () => {
  const [customProgressions, setCustomProgressions] = useState([]);
  const [newProgressionName, setNewProgressionName] = useState("");
  const [newProgressionChords, setNewProgressionChords] = useState("");

  useEffect(() => {
    const storedProgressions = localStorage.getItem("customProgressions");
    if (storedProgressions) {
      setCustomProgressions(JSON.parse(storedProgressions));
    }
  }, []);

  const saveCustomProgressions = (progressions) => {
    localStorage.setItem("customProgressions", JSON.stringify(progressions));
  };

  const addCustomProgression = () => {
    if (newProgressionName && newProgressionChords) {
      const newProgression = {
        name: newProgressionName,
        chords: newProgressionChords.split("-").map((chord) => chord.trim()),
      };
      const updatedProgressions = [...customProgressions, newProgression];
      setCustomProgressions(updatedProgressions);
      saveCustomProgressions(updatedProgressions);
      setNewProgressionName("");
      setNewProgressionChords("");
    }
  };

  const deleteCustomProgression = (index) => {
    const updatedProgressions = customProgressions.filter(
      (_, i) => i !== index
    );
    setCustomProgressions(updatedProgressions);
    saveCustomProgressions(updatedProgressions);
  };

  const handleChordClick = (chord) => {
    setNewProgressionChords((prev) => (prev ? `${prev}-${chord}` : chord));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 text-center">
        Custom Progressions:
      </h2>
      <div className="flex flex-wrap justify-center mb-4">
        {customProgressions.map((prog, index) => (
          <div key={index} className="relative m-1">
            <button className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
              {prog.name}
            </button>
            <button
              onClick={() => deleteCustomProgression(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <ChordButtons onChordClick={handleChordClick} />
      <div className="flex justify-center items-center mb-4">
        <input
          type="text"
          placeholder="Progression Name"
          value={newProgressionName}
          onChange={(e) => setNewProgressionName(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="Chords (e.g., I-V-vi-IV)"
          value={newProgressionChords}
          onChange={(e) => setNewProgressionChords(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={addCustomProgression}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default CustomProgressions;
