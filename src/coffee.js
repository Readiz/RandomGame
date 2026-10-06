import { mount } from "svelte";
import CoffeeGame from "./CoffeeGame.svelte";
import "./coffee.css";

mount(CoffeeGame, { target: document.getElementById("app") });
