/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { v4 as uuid } from "uuid";
import StickyNote from "./components/StickyNote";

type INotes = {
  id: string;
  noteInput: string;
  position: { x: number; y: number };
  zIndex: number;
};

function App() {
  const [notes, setNotes] = useState<INotes[]>([]);

  const handleChangeNotes = (id: string, noteInput: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, noteInput: noteInput } : note
      )
    );
  };

  const handleCloseNotes = (id: string) => {
    const filteredArray = notes.filter((note) => note.id !== id);
    setNotes(filteredArray);
  };

  const handleAddNotes = () => {
    setNotes((prevState) => [
      ...prevState,
      {
        id: uuid(),
        noteInput: "",
        isDragging: false,
        position: {
          x: Math.floor(Math.random() * 200 + 1) + 40,
          y: Math.floor(Math.random() * 300 + 1) + 80,
        },
        zIndex: 1,
      },
    ]);
  };

  const updateNotePosition = (id: string, newPosition: any) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, position: newPosition } : note
      )
    );
  };

  const updateZIndex = (id: string, zIndex: number) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === String(id) ? { ...note, zIndex } : note
      )
    );
  };

  console.log(notes);

  return (
    <main className="w-full min-h-screen bg-orange-200">
      <div className="">
        <div className="flex border border-b-orange-300 pb-2">
          <button
            type="button"
            onClick={() => {
              handleAddNotes();
            }}
            className="bg-lime-200 mt-4 mx-4 py-1 lg:py-2 px-3 lg:px-6 rounded-md  text-xs lg:text-base"
          >
            Add Notes
          </button>
          <div className="flex lg:justify-center mx-4 lg:mx-auto mt-4 text-sm lg:text-2xl text-neutral-700 ">
            React Sticky Notes 🎨
          </div>
        </div>
        <div className="">
          {notes.map((note) => (
            <div key={note.id}>
              <StickyNote
                id={note.id}
                initialPosition={note.position}
                updateNotePosition={updateNotePosition}
                zIndex={note.zIndex}
                updateZIndex={updateZIndex}
                handleCloseNotes={handleCloseNotes}
                handleChangeNotes={handleChangeNotes}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default App;
