import { useEffect, useState } from "react";
import "./App.css";
import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableTaskItem from "./SortableTaskItem";
function App() {
  let [lists, setLists] = useState([]);
  let [value, setValue] = useState("");
  let [search, setSearch] = useState("");
  useEffect(() => {
    let items = JSON.parse(localStorage.getItem("lists"));
    if (items?.length) {
      setLocal(items, false);
    } else {
      localStorage.setItem("lists", JSON.stringify([]));
    }
  }, []);
  function addlist(e) {
    if (e.key === "Enter") {
      if (value.trim() === "") return;
      let newlists = [...lists, { id: Date.now(), value, checked: false }];
      setValue("");
      setLocal(newlists);
    }
  }
  function edit(id, e) {
    let newlists = lists;
    if (["svg", "path"].includes(e?.target?.tagName)) {
      newlists = lists.filter((item) => item.id !== id);
    } else {
      newlists = lists.map((item, i) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      );
    }
    setLocal(newlists);
  }
  function setLocal(lists, local) {
    setLists(lists);
    if (local !== false) localStorage.setItem("lists", JSON.stringify(lists));
  }
  let tasks = search.length
    ? lists.filter((c) =>
        c.value.toLowerCase().trim().includes(search.toLowerCase().trim())
      )
    : lists.sort((a, b) => a.checked - b.checked);
  function onDragEnd(e) {
    if (!e.over) return;
    let activeId = e.active.id,
      overId = e.over.id;
    if (activeId === overId) return;
    let oldIndex = lists.findIndex((item) => item.id === activeId);
    let newIndex = lists.findIndex((item) => item.id === overId);
    let updatedLists = [...lists];
    let [movedItem] = updatedLists.splice(oldIndex, 1);
    updatedLists.splice(newIndex, 0, movedItem);
    setLocal(updatedLists);
  }

  return (
    <div className="App">
      <div className="todo">
        <div className="header">
          <h1>To Do</h1>
        </div>
        <div className="search">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            placeholder="Enter your search term..."
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>
        <div className="lists">
          <DndContext onDragEnd={onDragEnd}>
            <SortableContext
              items={tasks.map((c) => c.id)}
              strategy={verticalListSortingStrategy}
            >
              {tasks.map((c, i) => {
                return (
                  <SortableTaskItem
                    key={c.id}
                    id={c.id}
                    onClick={(e) => edit(c.id, e)}
                  >
                    <div className="list">
                      <p className={c.checked ? "checked" : ""}>{c.value}</p>
                      <svg
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3 6.5H5H21"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                        <path
                          d="M8 6.5V4.5C8 3.96957 8.21071 3.46086 8.58579 3.08579C8.96086 2.71071 9.46957 2.5 10 2.5H14C14.5304 2.5 15.0391 2.71071 15.4142 3.08579C15.7893 3.46086 16 3.96957 16 4.5V6.5M19 6.5V20.5C19 21.0304 18.7893 21.5391 18.4142 21.9142C18.0391 22.2893 17.5304 22.5 17 22.5H7C6.46957 22.5 5.96086 22.2893 5.58579 21.9142C5.21071 21.5391 5 21.0304 5 20.5V6.5H19Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </div>
                  </SortableTaskItem>
                );
              })}
            </SortableContext>
          </DndContext>
        </div>

        <div className="add">
          <label htmlFor="add">Add new</label>
          <input
            id="add"
            placeholder="Add new todo..."
            onKeyDown={addlist}
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
