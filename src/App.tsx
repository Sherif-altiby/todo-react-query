import "./App.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  completeItem,
  createItem,
  deleteItem,
  getComletedItems,
  getItems,
} from "./utils/api";
import { useState } from "react";
import { Item } from "./utils/types";

function App() {
  const [comleted, setCompleted] = useState(false);
  const [title, setTitle] = useState("");

  const queryClient = useQueryClient();

  const { data: allData } = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });

  const { data: completedData, refetch } = useQuery({
    queryKey: ["items-comleted"],
    queryFn: getComletedItems,
  });

  const { mutate: createMutate } = useMutation({
    mutationFn: createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["items"],
        exact: true,
      });
    },
  });

  const { mutate: updateMutate } = useMutation({
    mutationFn: completeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["items"],
        exact: true,
      });
    },
  });

  const { mutate: deleteMutate } = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["items"],
        exact: true,
      });
    },
  });

  const data = comleted ? completedData : allData;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTitle("");
    setCompleted(false);

    let lenght;
    if (allData) {
      lenght = allData.length + 1;
    } else {
      lenght = 1;
    }

    const post = {
      title,
      id: String(lenght),
      completed: false,
    };

    createMutate(post);
  };

  const handleUpdateItem = (item: Item) => {
    updateMutate(item);
  };

  return (
    <div className="container">
      <div className="todo-app">
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            placeholder="write item"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit" className="btn">
            Add
          </button>
        </form>
        <div className="filter">
          <div onClick={() => setCompleted(false)}> All </div>
          <div
            onClick={() => {
              setCompleted(true);
              refetch();
            }}
          >
            Completed
          </div>
        </div>
        <div className="items">
          {data?.map((item) => (
            <div className="item" key={item.id}>
              <p className={item.completed ? "completed" : ""}>{item.title}</p>
              <div className="btns">
                <div
                  className="btn"
                  onClick={() => {
                    deleteMutate(item.id);
                    refetch();
                  }}
                >
                  Delete
                </div>
                <div className="btn" onClick={() => handleUpdateItem(item)}>
                  Complete
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
