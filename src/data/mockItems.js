import airpodsCase from "../assets/airpodscase.jpg";
import blackCasioWatch from "../assets/blackcasiowatch.avif";
import blueCanvasBackpack from "../assets/bluecanvasbackpack.jpg";
import brownLeatherWallet from "../assets/brownleatherwallet.jpg";
import greenWaterBottle from "../assets/greenwaterbottle.webp";
import idCard from "../assets/id.webp";

export const mockItems = [
  {
    id: 1,
    title: "Silver AirPods Case",
    category: "Electronics",
    status: "lost",
    location: "Central Library",
    date: "Today",
    match: 94,
    image: airpodsCase,
  },
  {
    id: 2,
    title: "Blue Canvas Backpack",
    category: "Bags",
    status: "found",
    location: "North Campus",
    date: "Yesterday",
    match: 87,
    image: blueCanvasBackpack,
  },
  {
    id: 3,
    title: "Student ID Card",
    category: "Cards",
    status: "lost",
    location: "Cafeteria",
    date: "Sep 03",
    match: 81,
    image: idCard,
  },
  {
    id: 4,
    title: "Black Casio Watch",
    category: "Accessories",
    status: "found",
    location: "Sports Complex",
    date: "Sep 02",
    match: 76,
    image: blackCasioWatch,
  },
  {
    id: 5,
    title: "Brown Leather Wallet",
    category: "Wallets",
    status: "lost",
    location: "Main Block",
    date: "Sep 01",
    match: 72,
    image: brownLeatherWallet,
  },
  {
    id: 6,
    title: "Green Water Bottle",
    category: "Accessories",
    status: "found",
    location: "Student Lounge",
    date: "Aug 30",
    match: 68,
    image: greenWaterBottle,
  },
];

export default mockItems;