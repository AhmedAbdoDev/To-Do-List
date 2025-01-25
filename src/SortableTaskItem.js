import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableTaskItem = ({ children, id, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const [isDragging, setIsDragging] = React.useState(false);
  const handleMouseUp = (e) => {
    if (!isDragging && onClick) {
      onClick(e);
    }
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        e.stopPropagation();
      }}
      onMouseDown={(e) => setIsDragging(false)}
      onMouseMove={() => setIsDragging(true)}
      onMouseUp={handleMouseUp}
    >
      {children}
    </div>
  );
};

export default SortableTaskItem;
