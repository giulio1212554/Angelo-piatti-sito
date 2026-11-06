export type Dish = { name: string; price: string; desc?: string };
export type Section = { id: string; title: string; image: string; dishes: Dish[] };

import antipastiA from "@/assets/antipasti.jpg.asset.json";
const antipasti = antipastiA.url;
import primiA from "@/assets/primi.jpg.asset.json";
const primi = primiA.url;
import secondiA from "@/assets/secondi.jpg.asset.json";
const secondi = secondiA.url;
import pizzeA from "@/assets/pizze.jpg.asset.json";
const pizze = pizzeA.url;
import dolciA from "@/assets/dolci.jpg.asset.json";
const dolci = dolciA.url;

export const MENU: Section[] = [
  { id: "antipasti", title: "Antipasti", image: antipasti, dishes: [
    { name: "Crocchè di Patate", price: "2,00", desc: "Patate, fiordilatte, pepe, prezzemolo, panatura croccante" },
    { name: "Fiore di Zucca Ripieno", price: "3,00", desc: "Fiore di zucca, ricottina, provola, fritto in pastella" },
    { name: "Zuppetta di Fagioli", price: "4,00", desc: "Fagioli cannellini stufati alla napoletana" },
    { name: "Peperone Ripieno", price: "4,00", desc: "Peperone al forno con ripieno di pane, olive e capperi" },
    { name: "Mozzarella in Carrozza", price: "5,00", desc: "Mozzarella di bufala tra fette di pane fritte" },
    { name: "Soutè Misto", price: "7,00", desc: "Misto di frutti di mare, aglio, olio EVO, prezzemolo, crostini" },
    { name: "Impepata di Cozze", price: "7,00", desc: "Cozze fresche, pepe nero macinato, limone" },
    { name: "Alici Marinate", price: "7,00", desc: "Filetti di alici fresche marinate in aceto e aromi" },
    { name: "Prosciutto e Mozzarella", price: "7,00", desc: "Prosciutto crudo e mozzarella di bufala campana" },
  ]},
  { id: "primi", title: "Primi Piatti", image: primi, dishes: [
    { name: "Pasta e Fagioli con Cozze", price: "9,00", desc: "Pasta mista, fagioli e cozze fresche" },
    { name: "Ziti alla Genovese", price: "10,00", desc: "Ziti spezzati a mano con cipolle stufate e manzo" },
    { name: "Gnocchi alla Sorrentina", price: "8,00", desc: "Gnocchi di patate, pomodoro, fiordilatte, basilico" },
  ]},
  { id: "secondi", title: "Secondi Piatti", image: secondi, dishes: [
    { name: "Parmigiana di Melanzane", price: "5,00", desc: "Melanzane fritte, pomodoro, provola" },
    { name: "Polpette al Ragù", price: "6,00", desc: "Polpette di carne affogate nel ragù napoletano" },
    { name: "Salsiccia e Friarielli", price: "7,00", desc: "Salsiccia di maiale con friarielli ripassati" },
    { name: "Alici Fritte", price: "8,00", desc: "Alici fresche infarinate e fritte dorate" },
    { name: "Spesc e Stella alla Griglia", price: "10,00", desc: "Pesce spada e stella di mare alla griglia" },
    { name: "Bistecca di Tonno", price: "12,00", desc: "Trancio di tonno rosso scottato su piastra" },
    { name: "Mazzamma", price: "12,00", desc: "Frittura di pesce misto di piccolo taglio" },
    { name: "Frittura Gamberi e Calamari", price: "12,00", desc: "Calamari e gamberi fritti, croccanti e leggeri" },
  ]},
  { id: "pizze", title: "Pizze Tradizionali", image: pizze, dishes: [
    { name: "Margherita", price: "7,00", desc: "Pomodoro San Marzano DOP, fiordilatte, Parmigiano 24 mesi, basilico" },
    { name: "Marinara", price: "7,00", desc: "Pomodoro San Marzano DOP, aglio dell'Ufita, origano, olio EVO" },
    { name: "Margherita al Filetto", price: "8,00", desc: "Pomodoro datterino, provola, Parmigiano, basilico" },
    { name: "Piccante", price: "8,00", desc: "Pomodoro, salame piccante, fiordilatte, basilico" },
    { name: "Porcina", price: "8,00", desc: "Panna, funghi porcini, salsiccia, provola, Parmigiano" },
    { name: "Mais", price: "9,00", desc: "Panna, prosciutto cotto Parmacotto, fiordilatte, mais" },
    { name: "Vegetariana", price: "9,00", desc: "Verdure di stagione grigliate, provola, pomodoro" },
    { name: "Ruchetta", price: "9,00", desc: "Rucola selvatica, mozzarella, pomodorini" },
    { name: "Bufalina", price: "10,00", desc: "Mozzarella di bufala DOP, pomodorini, basilico, Parmigiano" },
    { name: "Delizia", price: "10,00", desc: "Pomodorini, fiordilatte, prosciutto crudo, rucola, scaglie di Parmigiano" },
    { name: "Campagnola", price: "10,00", desc: "Melanzane a funghetto, provola, pomodorini, salame Napoli" },
    { name: "Pulcinella", price: "10,00", desc: "Salsiccia, friarielli napoletani, provola, Parmigiano" },
    { name: "Wurstel e Patatine", price: "10,00", desc: "Fiordilatte, wurstel, patatine fritte" },
    { name: "Capricciosa", price: "10,00", desc: "Pomodoro San Marzano DOP, fiordilatte, cotto, funghi, carciofi" },
    { name: "Gateau", price: "10,00", desc: "Provola, crocchè di patate sgranato, prosciutto cotto, panna, origano" },
    { name: "Cirù", price: "10,00", desc: "Mozzarella di bufala, ricotta di bufala, pancetta croccante, pepe" },
    { name: "Zucca", price: "10,00", desc: "Crema di zucca, provola, salame piccante, basilico" },
    { name: "Sole", price: "10,00", desc: "Pomodori gialli da serbo, provola di bufala, salame piccante" },
  ]},
  { id: "dolci", title: "Desserts & Bevande", image: dolci, dishes: [
    { name: "Tiramisù Fatto in Casa", price: "4,50" },
    { name: "Parfait Artigianale", price: "4,50" },
    { name: "Beignets alla Crema", price: "4,00" },
    { name: "Acqua Minerale 0.75 Cl", price: "3,00" },
    { name: "Caffè Espresso Napoletano", price: "1,50" },
    { name: "Vino della Casa Caraffa", price: "8,00" },
    { name: "Birra in Bottiglia / Cordiale", price: "4,00" },
  ]},
];

// Orari: index 0 = Domenica (JS getDay)
const STD: [string, string][] = [["12:30", "15:30"], ["19:30", "23:00"]];
export const HOURS: { day: string; jsDay: number; slots: [string, string][] }[] = [
  { day: "Lunedì", jsDay: 1, slots: STD },
  { day: "Martedì", jsDay: 2, slots: [] },
  { day: "Mercoledì", jsDay: 3, slots: STD },
  { day: "Giovedì", jsDay: 4, slots: STD },
  { day: "Venerdì", jsDay: 5, slots: STD },
  { day: "Sabato", jsDay: 6, slots: STD },
  { day: "Domenica", jsDay: 0, slots: [["12:30", "16:00"], ["19:30", "23:00"]] },
];

export function romeNow(d = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Rome", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(d);
  const wd = parts.find((p) => p.type === "weekday")!.value;
  const h = Number(parts.find((p) => p.type === "hour")!.value) % 24;
  const m = Number(parts.find((p) => p.type === "minute")!.value);
  const jsDay = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(wd);
  return { jsDay, minutes: h * 60 + m };
}

const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3));

export function isOpen(jsDay: number, minutes: number) {
  const day = HOURS.find((h) => h.jsDay === jsDay)!;
  return day.slots.some(([a, b]) => minutes >= toMin(a) && minutes < toMin(b));
}

// English translations (keyed by Italian text)
export const EN: Record<string, string> = {
  "Antipasti": "Starters", "Primi Piatti": "First Courses", "Secondi Piatti": "Main Courses", "Pizze Tradizionali": "Traditional Pizzas", "Desserts & Bevande": "Desserts & Drinks",
  "Crocchè di Patate": "Potato Croquettes", "Patate, fiordilatte, pepe, prezzemolo, panatura croccante": "Potatoes, fior di latte, pepper, parsley, crispy breadcrumbs",
  "Fiore di Zucca Ripieno": "Stuffed Zucchini Flower", "Fiore di zucca, ricottina, provola, fritto in pastella": "Zucchini flower, ricotta, provola, fried in batter",
  "Zuppetta di Fagioli": "Bean Soup", "Fagioli cannellini stufati alla napoletana": "Cannellini beans stewed Neapolitan style",
  "Peperone Ripieno": "Stuffed Pepper", "Peperone al forno con ripieno di pane, olive e capperi": "Baked pepper stuffed with bread, olives and capers",
  "Mozzarella in Carrozza": "Fried Mozzarella Sandwich", "Mozzarella di bufala tra fette di pane fritte": "Buffalo mozzarella between fried slices of bread",
  "Soutè Misto": "Mixed Seafood Sauté", "Misto di frutti di mare, aglio, olio EVO, prezzemolo, crostini": "Mixed seafood, garlic, extra virgin olive oil, parsley, croutons",
  "Impepata di Cozze": "Peppered Mussels", "Cozze fresche, pepe nero macinato, limone": "Fresh mussels, ground black pepper, lemon",
  "Alici Marinate": "Marinated Anchovies", "Filetti di alici fresche marinate in aceto e aromi": "Fresh anchovy fillets marinated in vinegar and herbs",
  "Prosciutto e Mozzarella": "Prosciutto and Mozzarella", "Prosciutto crudo e mozzarella di bufala campana": "Cured ham and Campania buffalo mozzarella",
  "Pasta e Fagioli con Cozze": "Pasta, Beans and Mussels", "Pasta mista, fagioli e cozze fresche": "Mixed pasta, beans and fresh mussels",
  "Ziti alla Genovese": "Ziti Genovese", "Ziti spezzati a mano con cipolle stufate e manzo": "Hand-broken ziti with slow-cooked onions and beef",
  "Gnocchi alla Sorrentina": "Gnocchi Sorrento Style", "Gnocchi di patate, pomodoro, fiordilatte, basilico": "Potato gnocchi, tomato, fior di latte, basil",
  "Parmigiana di Melanzane": "Aubergine Parmigiana", "Melanzane fritte, pomodoro, provola": "Fried aubergine, tomato, provola",
  "Polpette al Ragù": "Meatballs in Ragù", "Polpette di carne affogate nel ragù napoletano": "Meatballs slow-cooked in Neapolitan ragù",
  "Salsiccia e Friarielli": "Sausage and Friarielli", "Salsiccia di maiale con friarielli ripassati": "Pork sausage with sautéed friarielli greens",
  "Alici Fritte": "Fried Anchovies", "Alici fresche infarinate e fritte dorate": "Fresh anchovies, floured and fried golden",
  "Spesc e Stella alla Griglia": "Grilled Swordfish and Starfish", "Pesce spada e stella di mare alla griglia": "Grilled swordfish and starfish",
  "Bistecca di Tonno": "Tuna Steak", "Trancio di tonno rosso scottato su piastra": "Seared bluefin tuna steak",
  "Mazzamma": "Mazzamma (Small Fried Fish)", "Frittura di pesce misto di piccolo taglio": "Fried mix of small fish",
  "Frittura Gamberi e Calamari": "Fried Prawns and Squid", "Calamari e gamberi fritti, croccanti e leggeri": "Fried squid and prawns, crispy and light",
  "Margherita": "Margherita", "Pomodoro San Marzano DOP, fiordilatte, Parmigiano 24 mesi, basilico": "San Marzano DOP tomato, fior di latte, 24-month Parmigiano, basil",
  "Marinara": "Marinara", "Pomodoro San Marzano DOP, aglio dell'Ufita, origano, olio EVO": "San Marzano DOP tomato, Ufita garlic, oregano, extra virgin olive oil",
  "Margherita al Filetto": "Cherry Tomato Margherita", "Pomodoro datterino, provola, Parmigiano, basilico": "Datterino tomato, provola, Parmigiano, basil",
  "Piccante": "Spicy", "Pomodoro, salame piccante, fiordilatte, basilico": "Tomato, spicy salami, fior di latte, basil",
  "Porcina": "Porcini", "Panna, funghi porcini, salsiccia, provola, Parmigiano": "Cream, porcini mushrooms, sausage, provola, Parmigiano",
  "Mais": "Sweetcorn", "Panna, prosciutto cotto Parmacotto, fiordilatte, mais": "Cream, Parmacotto cooked ham, fior di latte, sweetcorn",
  "Vegetariana": "Vegetarian", "Verdure di stagione grigliate, provola, pomodoro": "Grilled seasonal vegetables, provola, tomato",
  "Ruchetta": "Rocket", "Rucola selvatica, mozzarella, pomodorini": "Wild rocket, mozzarella, cherry tomatoes",
  "Bufalina": "Buffalo Mozzarella", "Mozzarella di bufala DOP, pomodorini, basilico, Parmigiano": "Buffalo mozzarella DOP, cherry tomatoes, basil, Parmigiano",
  "Delizia": "Delight", "Pomodorini, fiordilatte, prosciutto crudo, rucola, scaglie di Parmigiano": "Cherry tomatoes, fior di latte, cured ham, rocket, Parmigiano shavings",
  "Campagnola": "Campagnola (House Special)", "Melanzane a funghetto, provola, pomodorini, salame Napoli": "Sautéed aubergine, provola, cherry tomatoes, Napoli salami",
  "Pulcinella": "Pulcinella", "Salsiccia, friarielli napoletani, provola, Parmigiano": "Sausage, Neapolitan friarielli, provola, Parmigiano",
  "Wurstel e Patatine": "Frankfurter and Fries", "Fiordilatte, wurstel, patatine fritte": "Fior di latte, frankfurter, French fries",
  "Capricciosa": "Capricciosa", "Pomodoro San Marzano DOP, fiordilatte, cotto, funghi, carciofi": "San Marzano DOP tomato, fior di latte, cooked ham, mushrooms, artichokes",
  "Gateau": "Potato Gateau", "Provola, crocchè di patate sgranato, prosciutto cotto, panna, origano": "Provola, crumbled potato croquette, cooked ham, cream, oregano",
  "Cirù": "Cirù", "Mozzarella di bufala, ricotta di bufala, pancetta croccante, pepe": "Buffalo mozzarella, buffalo ricotta, crispy pancetta, pepper",
  "Zucca": "Pumpkin", "Crema di zucca, provola, salame piccante, basilico": "Pumpkin cream, provola, spicy salami, basil",
  "Sole": "Sun", "Pomodori gialli da serbo, provola di bufala, salame piccante": "Yellow keeping tomatoes, buffalo provola, spicy salami",
  "Tiramisù Fatto in Casa": "Homemade Tiramisù", "Parfait Artigianale": "Artisan Parfait", "Beignets alla Crema": "Cream Puffs",
  "Acqua Minerale 0.75 Cl": "Mineral Water 0.75 L", "Caffè Espresso Napoletano": "Neapolitan Espresso", "Vino della Casa Caraffa": "House Wine Carafe",
  "Birra in Bottiglia / Cordiale": "Bottled Beer / Soft Drink",
};
