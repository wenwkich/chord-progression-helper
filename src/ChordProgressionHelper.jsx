import React, { useState, useEffect } from "react";
import {
  Progression,
  Voicing,
  VoiceLeading,
  VoicingDictionary,
  Midi,
} from "tonal";

const ChordProgressionHelper = () => {
  const [selectedKey, setSelectedKey] = useState("C");
  const [selectedProgression, setSelectedProgression] = useState([]);
  const [currentChordIndex, setCurrentChordIndex] = useState(null);
  const [progressionVoicings, setProgressionVoicings] = useState([]);
  const [currentVoicingIndex, setCurrentVoicingIndex] = useState(0);
  const [allProgressions, setAllProgressions] = useState([]);

  const keys = [
    "C",
    "G",
    "D",
    "A",
    "E",
    "B",
    "F#",
    "Db",
    "Ab",
    "Eb",
    "Bb",
    "F",
  ];

  const defaultProgressions = [
    { name: "I-V-vi-IV", chords: ["I", "V", "vi", "IV"] },
    { name: "ii-V-I", chords: ["ii", "V", "I"] },
    { name: "Canon", chords: ["I", "V", "vi", "iii", "IV", "I", "IV", "V"] },
  ];

  useEffect(() => {
    // Load progressions from local storage
    const loadProgressions = () => {
      const storedProgressions = localStorage.getItem("customProgressions");
      if (storedProgressions) {
        const parsedProgressions = JSON.parse(storedProgressions);
        setAllProgressions([...defaultProgressions, ...parsedProgressions]);
      } else {
        setAllProgressions(defaultProgressions);
      }
    };

    loadProgressions();
  }, []);

  const convertRomanNumeral = (numeral, key) => {
    const match = numeral.match(/^(b?[IViv]+)(.*)/);
    if (!match) return numeral;

    let [, base, extension] = match;
    const isMajor = base === base.toUpperCase();
    let converted = isMajor ? base + "maj" : base.toLowerCase() + "m";

    if (extension === "7" && isMajor) {
      converted = base + "7";
    } else if (extension === "maj7") {
      converted = base + "Maj7";
    } else {
      converted += extension;
    }

    return Progression.fromRomanNumerals(key, [converted])[0];
  };

  const generateVoicings = (chords, key) => {
    const chordNames = chords.map((chord) => convertRomanNumeral(chord, key));
    console.log("Chord names:", chordNames);

    const range = ["C3", "C5"];
    const firstChordVoicings = Voicing.search(
      chordNames[0],
      range,
      VoicingDictionary.all
    );
    console.log("First chord voicings:", firstChordVoicings);

    const allProgressionVoicings = firstChordVoicings.map((firstVoicing) => {
      return Voicing.sequence(
        chordNames,
        range,
        VoicingDictionary.all,
        VoiceLeading.topNoteDiff,
        firstVoicing
      );
    });

    console.log("All progression voicings:", allProgressionVoicings);
    setProgressionVoicings(allProgressionVoicings);
    setCurrentVoicingIndex(0);
  };

  useEffect(() => {
    if (selectedProgression.length > 0) {
      generateVoicings(selectedProgression, selectedKey);
    }
  }, [selectedKey, selectedProgression]);

  const handleKeyChange = (event) => {
    setSelectedKey(event.target.value);
  };

  const handleProgressionSelect = (progression) => {
    setSelectedProgression(progression.chords);
    setCurrentChordIndex(null);
  };

  const handleChordClick = (index) => {
    setCurrentChordIndex(index);
  };

  const handleNextVoicing = () => {
    setCurrentVoicingIndex(
      (prevIndex) => (prevIndex + 1) % progressionVoicings.length
    );
  };

  const handlePreviousVoicing = () => {
    setCurrentVoicingIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : progressionVoicings.length - 1
    );
  };

  const PianoKey = ({ midiNote, isActive, isBlack }) => {
    const noteName = Midi.midiToNoteName(midiNote, { sharps: true });
    return (
      <div
        className={`inline-block relative ${
          isBlack
            ? "w-8 h-20 -mx-4 z-10 border-black text-white"
            : "w-10 h-32 border-black"
        } border ${
          isActive
            ? isBlack
              ? "bg-blue-700"
              : "bg-blue-200"
            : isBlack
            ? "bg-black"
            : "bg-white"
        } transition-colors duration-300`}
      >
        <span
          className={`absolute bottom-1 left-1 text-xs ${
            isBlack ? "text-white" : "text-black"
          }`}
        >
          {noteName}
        </span>
      </div>
    );
  };

  const Piano = ({ highlightedMidiNotes }) => {
    const startMidi = Midi.toMidi("C3");
    const endMidi = Midi.toMidi("B5");
    const keys = [];

    for (let midiNote = startMidi; midiNote <= endMidi; midiNote++) {
      const noteName = Midi.midiToNoteName(midiNote, { sharps: true });
      const isBlack = noteName.includes("#");
      const isActive = highlightedMidiNotes.includes(midiNote);
      keys.push(
        <PianoKey
          key={midiNote}
          midiNote={midiNote}
          isActive={isActive}
          isBlack={isBlack}
        />
      );
    }

    return (
      <div className="flex justify-center items-start h-48 p-2 overflow-x-auto rounded-lg">
        {keys}
      </div>
    );
  };

  const getChordMidiNotes = (index) => {
    if (!progressionVoicings || progressionVoicings.length === 0) return [];
    const currentProgression = progressionVoicings[currentVoicingIndex];
    if (!currentProgression) return [];
    return currentProgression[index]?.map((note) => Midi.toMidi(note)) || [];
  };

  const formatChordNotes = (midiNotes) => {
    if (!Array.isArray(midiNotes) || midiNotes.length === 0)
      return "No notes available";
    return midiNotes
      .map((midi) => Midi.midiToNoteName(midi, { sharps: true }))
      .join(", ");
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Chord Progression Helper
        </h1>

        <div className="mb-6 text-center">
          <label className="mr-2">Select Key:</label>
          <select
            value={selectedKey}
            onChange={handleKeyChange}
            className="border p-2 rounded"
          >
            {keys.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-center">
            Chord Progressions:
          </h2>
          <div className="flex flex-wrap justify-center">
            {allProgressions.map((prog) => (
              <button
                key={prog.name}
                onClick={() => handleProgressionSelect(prog)}
                className="m-1 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                {prog.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3 text-center">
            Current Progression:
          </h2>
          <div className="flex flex-wrap justify-center">
            {selectedProgression.map((chord, index) => (
              <button
                key={index}
                onClick={() => handleChordClick(index)}
                className={`m-1 px-4 py-2 border rounded ${
                  currentChordIndex === index
                    ? "bg-gray-200"
                    : "hover:bg-gray-100"
                } transition`}
              >
                <div>{chord}</div>
                <div className="text-sm text-gray-600">
                  {formatChordNotes(getChordMidiNotes(index))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {progressionVoicings.length > 0 && (
          <div className="mb-6 text-center">
            <button
              onClick={handlePreviousVoicing}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition mr-2"
            >
              Previous Voicing
            </button>
            <button
              onClick={handleNextVoicing}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
            >
              Next Voicing
            </button>
            <div className="mt-2 text-sm">
              Voicing {currentVoicingIndex + 1} of {progressionVoicings.length}
            </div>
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-3 text-center">
            Piano Visualization:
          </h2>
          <Piano
            highlightedMidiNotes={
              currentChordIndex !== null
                ? getChordMidiNotes(currentChordIndex)
                : []
            }
          />
        </div>
      </div>
    </div>
  );
};

export default ChordProgressionHelper;
