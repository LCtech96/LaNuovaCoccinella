// Dati di default del menu - condivisi tra pagina asporto e admin

export interface Dish {
  name: string
  description: string
  price: string
  image?: string
  visible?: boolean
}

export interface Category {
  title: string
  dishes: Dish[]
}

export const defaultMenuCategories: Category[] = [
  {
    title: "Antipasti",
    dishes: [
      { name: "Patatine fritte piccola", description: "", price: "€2.50", visible: true },
      { name: "Patatine fritte grande", description: "", price: "€4.00", visible: true },
      { name: "Misto caldo", description: "Patatine fritte, panelle, crocchette, arancine", price: "€6.00", visible: true },
      { name: "Nuggets di pollo (6pz)", description: "", price: "€5.00", visible: true },
      { name: "Crocchette e panelle", description: "", price: "€4.50", visible: true }
    ]
  },
  {
    title: "Il Tagliere",
    dishes: [
      { name: "Tagliere di salumi e formaggi", description: "Salumi, formaggi, arancinette, confetture, olive condite", price: "€16.50", visible: true }
    ]
  },
  {
    title: "Rotoli di Pizza",
    dishes: [
      { name: "Prosciutto", description: "Mozzarella, prosciutto cotto (5 pezzi)", price: "€3.50", visible: true },
      { name: "Salame", description: "Mozzarella, salame piccante (5 pezzi)", price: "€3.50", visible: true },
      { name: "Funghi", description: "Mozzarella, funghi freschi", price: "€3.50", visible: true },
      { name: "Spinaci", description: "Mozzarella, spinaci", price: "€4.00", visible: true },
      { name: "Salsicciotto", description: "Mozzarella, salsiccia, gorgonzola", price: "€6.00", visible: true }
    ]
  },
  {
    title: "Pizze Gourmet",
    dishes: [
      { name: "Mortazza", description: "Mozzarella, rucola, mortadella, stracciatella, pesto di pistacchio, pistacchi tritati", price: "€14.00", visible: true },
      { name: "Terrasini", description: "Mozzarella di bufala, funghi porcini flambé, speck, noci, miele", price: "€14.00", visible: true },
      { name: "Sicilia", description: "Mozzarella di bufala, funghi porcini flambé, pomodoro, speck, scaglie di parmigiano", price: "€14.00", visible: true },
      { name: "Special", description: "Mozzarella di bufala, straccetti di pollo arrosto, radicchio al forno, pan grattato tostato, succo di limone", price: "€16.00", visible: true },
      { name: "Pizza cannolo", description: "Mozzarella di bufala, ricotta, spinaci, speck, rucola, ciliegino", price: "€10.00", visible: true }
    ]
  },
  {
    title: "Pizze Classiche",
    dishes: [
      { name: "Margherita", description: "Pomodoro, mozzarella", price: "Norm €5.50 - Maxi €11.00", visible: true },
      { name: "Napoli", description: "Pomodoro, mozzarella, acciughe, origano", price: "Norm €6.00 - Maxi €13.00", visible: true },
      { name: "Romana", description: "Pomodoro, mozzarella, prosciutto", price: "Norm €7.00 - Maxi €15.00", visible: true },
      { name: "Origanata", description: "Pomodoro, caciocavallo, acciughe, pecorino, origano, olio all'aglio", price: "Norm €6.50 - Maxi €14.00", visible: true },
      { name: "Diavola", description: "Pomodoro, mozzarella, salame piccante", price: "Norm €7.00 - Maxi €15.00", visible: true },
      { name: "Bresaolina", description: "Mozzarella, rucola, ciliegine, bresaola, scaglie di grana", price: "Norm €10.00 - Maxi €23.00", visible: true },
      { name: "4 Formaggi", description: "Mozzarella, emmenthal, gorgonzola, cacio cavallo", price: "Norm €8.00 - Maxi €18.00", visible: true },
      { name: "San Daniele", description: "Pomodoro, mozzarella, crudo, rucola, ciliegino, scaglie di grana", price: "Norm €9.00 - Maxi €20.00", visible: true },
      { name: "Capricciosa", description: "Pomodoro, mozzarella, prosciutto, funghi, carciofi, wurstel, olive", price: "Norm €8.00 - Maxi €17.00", visible: true },
      { name: "Bufalina", description: "Pomodoro, mozzarella di bufala, basilico, olio EVO", price: "Norm €8.00 - Maxi €18.00", visible: true },
      { name: "Belen", description: "Pomodoro, mozzarella, salsiccia, salame piccante, cipolla, patate al forno, all'uscita glassa di aceto balsamico", price: "Norm €9.50 - Maxi €20.00", visible: true },
      { name: "Tonnara", description: "Pomodoro, mozzarella, tonno, cipolla, origano", price: "Norm €8.00 - Maxi €17.00", visible: true },
      { name: "Parmigiana", description: "Pomodoro, mozzarella, melanzane fritte, grana, basilico", price: "Norm €8.00 - Maxi €17.00", visible: true },
      { name: "Patatosa", description: "Pomodoro, mozzarella, wurstel, patatine", price: "Norm €7.50 - Maxi €17.00", visible: true },
      { name: "Spider", description: "Mozzarella, straccetti di pollo arrosto, patatine fritte, salsa barbeque", price: "Norm €9.00 - Maxi €21.00", visible: true },
      { name: "Ortolana", description: "Pomodoro, mozzarella, zucchine, melenzane, funghi, cipolla", price: "Norm €9.00 - Maxi €20.00", visible: true },
      { name: "Vota e svota classica", description: "Olio, primo sale, pomodoro a fette, acciughe, origano", price: "€7.50", visible: true },
      { name: "Salsiccia e friarelli", description: "Mozzarella, salsiccia e friarelli", price: "Norm €9.00 - Maxi €20.00", visible: true },
      { name: "Quattro Gusti", description: "Pomodoro, mozzarella, prosciutto cotto, carciofi", price: "Norm €8.00 - Maxi €16.00", visible: true },
      { name: "Sfincionello all'antica", description: "Pomodoro, caciocavallo a cubetti, cipolla, sardelle, mollica, olio, origano", price: "€7.50", visible: true },
      { name: "Calzone", description: "Pomodoro, mozzarella, prosciutto cotto, funghi freschi", price: "€8.00", visible: true }
    ]
  },
  {
    title: "Panini",
    dishes: [
      { name: "Hot Dog", description: "Wurstel, salsa a scelta", price: "€3.50", visible: true },
      { name: "Hot dog Salsiccia", description: "Salsiccia, salsa a scelta", price: "€4.00", visible: true },
      { name: "Cartoccio", description: "Prosciutto cotto, mozzarella e salsa a scelta", price: "€3.00", visible: true },
      { name: "Topolino", description: "Prosciutto cotto, wurstel, mozzarella, salsa a scelta", price: "€3.50", visible: true },
      { name: "Bufalino", description: "Mozzarella di bufala, rucola, crudo, olio e limone", price: "€5.00", visible: true },
      { name: "Coccinella", description: "Mozzarella di bufala, bresaola, rucola, scorza di limone", price: "€6.00", visible: true },
      { name: "Vegetariano", description: "Mozzarella, verdure grigliate, pomodoro a fette", price: "€5.00", visible: true },
      { name: "Panelle e crocchè", description: "", price: "€3.50", visible: true }
    ]
  },
  {
    title: "Il nostro Pollo",
    dishes: [
      { name: "Pollo da un 1.3 KG alla brace", description: "Pollo con patate a scelta (fritte o forno), con citronette al limone, servito in confezione", price: "€12.50", visible: true },
      { name: "Mezzo pollo alla brace", description: "Pollo con patate a scelta (fritte o forno), con citronette al limone, servito in confezione", price: "€7.00", visible: true },
      { name: "Stinco di maiale", description: "Con contorno di patate arrosto", price: "€10.00", visible: true }
    ]
  },
  {
    title: "Contorni",
    dishes: [
      { name: "Patate al forno", description: "", price: "€5.00", visible: true },
      { name: "Patate fritte", description: "", price: "€4.00", visible: true },
      { name: "Verdure grigliate", description: "", price: "€5.00", visible: true },
      { name: "Insalata verde", description: "", price: "€4.00", visible: true },
      { name: "Insalata mista", description: "Iceberg, radicchio, ciliegino e rucola", price: "€5.00", visible: true }
    ]
  },
  {
    title: "Bevande",
    dishes: [
      { name: "Acqua minerale 50cl", description: "Naturale o frizzante", price: "€1.00", visible: true },
      { name: "Acqua minerale 1 L", description: "Naturale o frizzante", price: "€2.00", visible: true },
      { name: "Bibite in lattina 33 cl", description: "Coca cola, Fanta, Sprite, The freddo (limone o pesca)", price: "€2.00", visible: true },
      { name: "Coca, Fanta, Sprite in bottiglia grande", description: "", price: "€3.50", visible: true }
    ]
  },
  {
    title: "Birre",
    dishes: [
      { name: "Moretti 66 cl", description: "", price: "€3.00", visible: true },
      { name: "Beck's 66 cl", description: "", price: "€4.50", visible: true },
      { name: "Heineken 66 cl", description: "", price: "€4.50", visible: true },
      { name: "Moretti 33 cl", description: "", price: "€2.00", visible: true },
      { name: "Beck's 33 cl", description: "", price: "€3.00", visible: true },
      { name: "Heineken 33 cl", description: "", price: "€3.00", visible: true },
      { name: "Ceres 33 cl", description: "", price: "€4.00", visible: true },
      { name: "Corona 33 cl", description: "", price: "€4.00", visible: true }
    ]
  },
  {
    title: "Vini",
    dishes: [
      { name: "Vino della casa 1 L", description: "Bianco o rosso", price: "€4.00", visible: true },
      { name: "Vino rosso Merlot 1L", description: "", price: "€6.00", visible: true },
      { name: "Vino rosso Sangiovese 1L", description: "", price: "€7.00", visible: true },
      { name: "Vino rosso Nero d'Avola 1L", description: "", price: "€8.00", visible: true },
      { name: "Vino bianco Catarratto 1L", description: "", price: "€8.00", visible: true },
      { name: "Vino bianco Grillo 1L", description: "", price: "€9.00", visible: true }
    ]
  },
  {
    title: "Note",
    dishes: [
      { name: "Aggiunzioni", description: "1€", price: "", visible: true },
      { name: "Bufala, Crudo, Speck, Mortadella", description: "2€", price: "", visible: true },
      { name: "Aggiunzione pizze maxi", description: "Il Doppio", price: "", visible: true },
      { name: "Consegne a domicilio", description: "2€", price: "", visible: true }
    ]
  }
]
