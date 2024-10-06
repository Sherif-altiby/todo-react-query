import axios from "axios";
import { Item } from "./types";

export const getItems = async () => {
  try {
    const res = await axios.get<Item[]>("http://localhost:3001/tasks");
    return res.data;
  } catch (e) {
    console.log("Error", e);
  }
};

export const getComletedItems = async () => {
  try {
    const res = await axios.get<Item[]>("http://localhost:3001/tasks");
    const completedItems = res.data.filter((item) => item.completed === true);
    return completedItems;
  } catch (e) {
    console.log("Error", e);
  }
};

export const createItem = async (item: Item) => {
  try {
    const res = await axios.post("http://localhost:3001/tasks", item);
    return res.data;
  } catch (e) {}
};

export const completeItem = async (item: Item) => {
  try {
    const res = await axios.put(`http://localhost:3001/tasks/${item.id}`, {
      ...item,
      completed: !item.completed,
    });
    return res.data;
  } catch (error) {
    console.error("Error completing item:", error);
  }
};


export const deleteItem = async (id: string) => {
    try {
        const res = await axios.delete(`http://localhost:3001/tasks/${id}`);
        return res.data;
      } catch (error) {
        console.error("Error completing item:", error);
      }
}