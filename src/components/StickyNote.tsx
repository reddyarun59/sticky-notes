import { FC, useEffect, useRef, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";

interface StickyNoteProps {
  id: string;
  initialPosition: { x: number; y: number };
  updateNotePosition: (id: string, position: { x: number; y: number }) => void;
  zIndex: number;
  updateZIndex: (id: string, zIndex: number) => void;
  handleCloseNotes: (id: string) => void;
  handleChangeNotes: (id: string, noteInput: string) => void;
}

const StickyNote: FC<StickyNoteProps> = ({
  id,
  initialPosition,
  updateNotePosition,
  zIndex,
  updateZIndex,
  handleCloseNotes,
  handleChangeNotes,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState(initialPosition);
  const [pinned, setPinned] = useState(false);
  const [screenSize, setScreenSize] = useState<string>("");
  const stickyRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (stickyRef.current && !pinned) {
      const rect = stickyRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setIsDragging(true);
      const maxZIndex = Math.max(
        ...Array.from(document.querySelectorAll(".sticky-note")).map(
          (note) => parseFloat((note as HTMLElement).style.zIndex) || 0
        )
      );
      updateZIndex(id, maxZIndex + 1);
    }
  };

  const handleResize = (e: React.MouseEvent<HTMLTextAreaElement>) => {
    e.stopPropagation();
  };

  const handleChangeInternal = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    handleChangeNotes(id, value);
  };
  const handleEditClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(0, 0);
    }
  };

  const handlePinClick = () => {
    setPinned((prevPinned) => !prevPinned);
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 768) {
        setScreenSize("mobile");
      } else {
        setScreenSize("desktop");
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e: MouseEvent) => {
        setPosition({
          x: e.clientX - offset.x,
          y: e.clientY - offset.y,
        });
      };

      const handleMouseUp = () => {
        setIsDragging(false);
        updateNotePosition(id, position);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, offset, id, position, updateNotePosition]);

  return (
    <div
      ref={stickyRef}
      className="sticky-note bg-yellow-200 rounded-md border border-yellow-400"
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        cursor: isDragging ? "grabbing" : "grab",
        zIndex: zIndex.toString(),
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex justify-end border-b-2 border-b-yellow-300">
        <div
          className="mx-4 my-1 bg-white px-4 py-1 bg text-xs rounded-md"
          onClick={handleEditClick}
        >
          edit
        </div>
        <button
          onClick={handlePinClick}
          className="bg-red-400 mx-4 my-1 px-1 lg:px-4 py-1 text-xs rounded-md w-16"
        >
          {pinned ? "Unpin" : "Pin"}
        </button>
        <div
          className="cursor-pointer p-1"
          onClick={() => {
            handleCloseNotes(id);
          }}
        >
          <IoMdCloseCircle />
        </div>
      </div>
      <div>
        <textarea
          ref={textareaRef}
          className="w-full grow p-3  mt-3 text-neutral-700 bg-yellow-200 text-sm break-words rounded-md outline-none resize font-mono"
          style={{
            width: "100%",
            height: "100%",
            resize: "both",

            ...(screenSize === "mobile"
              ? { minHeight: "100px", minWidth: "40px" }
              : { minWidth: "300px", minHeight: "150px" }),
          }}
          onMouseDown={handleResize}
          onChange={handleChangeInternal}
        ></textarea>
      </div>
    </div>
  );
};

export default StickyNote;
