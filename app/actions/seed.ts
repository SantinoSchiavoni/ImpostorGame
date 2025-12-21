'use server';

import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';

const INITIAL_DATA = [
    //Fútbol Argentino
    //Facil
    {
        "name": "Fútbol Argentino",
        "difficulty": "Facil",
        "words": [
            "Edinson Cavani", "Franco Armani", "Miguel Borja", "Chiquito Romero", "Marcos Rojo",
            "Juanfer Quintero", "Maravilla Martínez", "Enzo Pérez", "Pity Martínez", "Miguel Merentiel",
            "Luis Advíncula", "Paulo Díaz", "Gabriel Arias", "Iker Muniain", "Gabriel Ávalos",
            "Rodrigo Rey", "Pulga Rodríguez", "Jaminton Campaz", "Fatura Broun", "Malcorra",
            "Claudio Aquino", "Uvita Fernández", "Wanchope Ábila", "Nacho Fernández", "Manuel Lanzini",
            "Exequiel Zeballos", "Kevin Zenón", "Facundo Colidio", "Maxi Meza", "Pol Fernández",
            "Federico Mancuello", "Santiago Ascacibar", "José Sosa", "Nahuel Bustos", "Rubén Botta",
            "Toto Salvio", "Walter Bou", "Milton Giménez", "Adam Bareiro", "Lolo Miranda",
            "Cristian Lema", "Germán Pezzella", "Marcos Acuña", "Ever Banega", "Fabricio Bustos",
            "Brian Aguirre", "Tomás Belmonte", "Carlos Izquierdoz", "Chila Gómez", "Gabriel Rojas"
        ]
    },
    //Medio
    {
        "name": "Fútbol Argentino",
        "difficulty": "Medio",
        "words": [
            "Milton Delgado", "Nicolás Fonseca", "Santiago Simón", "Pablo Solari", "Agustín Almendra",
            "Gastón Martirena", "Facundo Mura", "Roger Martínez", "Santiago Sosa", "Joaquín Laso",
            "Lucas González", "Iván Marcone", "Santiago Montiel", "Federico Gattoni", "Malcom Braida",
            "Gastón Hernández", "Nahuel Barrios", "Matías Reali", "Braian Romero", "Thiago Fernández",
            "Valentín Gómez", "Elías Gómez", "Tomás Marchiori", "Federico Girotti", "Guido Herrera",
            "Matías Galarza", "Matías Catalán", "Marcelino Moreno", "Lautaro Acosta", "Felipe Peña Biafore",
            "Lucas Janson", "Frank Fabra", "Jabes Saralegui", "Nicolás Figal", "Leandro González Pírez",
            "Matías Kranevitter", "Eric Meza", "Javier Altamirano", "Guido Carrillo", "Walter Mazzantti",
            "Rodrigo Echeverría", "Franco Petroli", "Alan Lescano", "Kevin Lomónaco", "Elián Irala",
            "Juan Portillo", "Agustín Bouzat", "Francisco Pizzini", "Emanuel Mammana", "Gastón Lodico"
        ]
    },
    //Dificil
    {
        "name": "Fútbol Argentino",
        "difficulty": "Dificil",
        "words": [
            "Agustín Sant'Anna", "Ian Subiabre", "Juan Fedorco", "Franco Torgnascioli", "Juan Bisanz",
            "Renzo Tesuri", "Joaquín Mosqueira", "Mariano Troilo", "Nazareno Colombo", "Agustín García Basso",
            "Germán Conti", "Alex Luna", "Rodrigo Insua", "Jhohan Romaña", "Gastón Campi",
            "Facundo Altamirano", "Lucas Carrizo", "Lucas Suárez", "Blas Riveros", "Ramiro Carrera",
            "Nery Domínguez", "Matías Mansilla", "Milton Céliz", "Jonathan Herrera", "Lucas Menossi",
            "Mateo Sanabria", "Tobías Cervera", "Juan Pintado", "Saúl Salcedo", "Gastón Benavídez",
            "Juan Espínola", "Ignacio Russo", "Fernando Alarcón", "Agustín Lagos", "Gino Peruzzi",
            "Mateo Pellegrino", "Rodrigo Atencio", "Lucas Brochero", "Bruno Sepúlveda", "Blas Armoa",
            "Franco Pardo", "Claudio Corvalán", "Santiago Longo", "Bryan Reyna", "Gastón Suso",
            "Mateo Coronel", "Facundo Quignon", "Aaron Molinas", "Juan Miritello", "Tomás Guidara"
        ]
    },
    //Fútbol Internacional (5 grandes ligas)
    //Facil
    {
        "name": "Fútbol Internacional (5 grandes ligas)",
        "difficulty": "Facil",
        "words": [
            "Mbappe", "Haaland", "Vinicius Jr", "Bellingham", "Robert Lewandowski",
            "Mohamed Salah", "Harry Kane", "Kevin De Bruyne", "Lamine Yamal", "Griezmann",
            "Luka Modric", "Courtois", "Bernardo Silva", "Pedri", "Lautaro Martinez",
            "Julián Álvarez", "Luis Diaz", "Darwin Nuñez", "Dembélé", "Musiala",
            "Bukayo Saka", "Enzo Fernandez", "Alisson Becker", "Rodri", "Fede Valverde",
            "Bruno Fernandes", "Rodrygo", "Kyle Walker", "Marcus Rashford", "Gavi",
            "Virgil van Dijk", "Osimhen", "Rafael Leao", "Theo Hernandez", "Pulisic",
            "Donnarumma", "Hakimi", "Florian Wirtz", "Xavi Simons", "Alexander Arnold",
            "Dibu Martínez", "Phil Foden", "Heung-min Son", "Ter Stegen", "Ilkay Gündogan",
            "Paulo Dybala", "Jan Oblak", "Frenkie de Jong", "Antonio Rüdiger", "Ederson"
        ]
    },
    //Medio
    {
        "name": "Fútbol Internacional (5 grandes ligas)",
        "difficulty": "Medio",
        "words": [
            "Cole Palmer", "Nico Williams", "Alexis Mac Allister", "Douglas Luiz", "Cuti Romero",
            "Micky van de Ven", "Bremer", "Federico Chiesa", "Dusan Vlahovic", "Barella",
            "Hakan Calhanoglu", "Marcus Thuram", "Pavard", "Jeremie Frimpong", "Grimaldo",
            "Victor Boniface", "Serhou Guirassy", "Loïs Openda", "Dani Olmo", "Mikel Merino",
            "Zubimendi", "Isco", "Savinho", "Artem Dovbyk", "Aleix Garcia",
            "Takefusa Kubo", "Alexander Isak", "Bruno Guimaraes", "Lucas Paqueta", "Jarrod Bowen",
            "James Maddison", "Anthony Gordon", "Dominic Solanke", "Ollie Watkins", "Vicario",
            "William Saliba", "Gabriel Magalhaes", "Vitinha", "Bradley Barcola", "Warren Zaire-Emery",
            "Lisandro Martínez", "Alejandro Garnacho", "Josko Gvardiol", "Eduardo Camavinga", "Aurélien Tchouaméni",
            "Dominik Szoboszlai", "Joshua Kimmich", "Leroy Sané", "Kai Havertz", "Joao Felix"
        ]
    },
    //Dificil
    {
        "name": "Fútbol Internacional (5 grandes ligas)",
        "difficulty": "Dificil",
        "words": [
            "Pervis Estupiñan", "Sandro Tonali", "Manuel Akanji", "Riccardo Calafiori", "Exequiel Palacios",
            "Nico Schlotterbeck", "Gregor Kobel", "Teun Koopmeiners", "Benjamin Sesko", "Piero Hincapie",
            "Edmond Tapsoba", "Ruben Loftus-Cheek", "Tijjani Reijnders", "Gianluca Scamacca", "Matteo Guendouzi",
            "Boubacar Kamara", "Eberechi Eze", "Michael Olise", "Bryan Mbeumo", "Mats Wieffer",
            "Amadou Onana", "Orel Mangala", "Castello Lukeba", "Sacha Boey", "Mathys Tel",
            "Jamie Bynoe-Gittens", "Brajan Gruda", "Assane Diao", "Cristhian Mosquera", "Pepelu",
            "Isaac Romero", "Alex Baena", "Samu Omorodion", "Youssouf Fofana", "Facundo Medina",
            "Lucas Chevalier", "Facundo Buonanotte", "Matias Soulé", "Marcos Senesi", "Taty Castellanos",
            "Enzo Millot", "Omar Marmoush", "Jonathan David", "Edon Zhegrova", "Morgan Gibbs-White",
            "Murillo", "Alessandro Buongiorno", "Yeremy Pino", "Willian Pacho", "Mateo Retegui"
        ]
    },
    //Tenis
    //Facil
    {
        "name": "Tenis",
        "difficulty": "Facil",
        "words": [
            "Roger Federer", "Rafael Nadal", "Novak Djokovic", "Juan Martín del Potro", "Carlos Alcaraz",
            "Jannik Sinner", "Björn Borg", "Andre Agassi", "Pete Sampras", "Serena Williams",
            "Guillermo Vilas", "Gabriela Sabatini", "Andy Murray", "Stan Wawrinka", "John McEnroe",
            "Maria Sharapova", "Daniil Medvedev", "Alexander Zverev", "David Nalbandian", "Gastón Gaudio",
            "Gustavo Kuerten", "Boris Becker", "Rod Laver", "Steffi Graf", "Venus Williams",
            "Dominic Thiem", "Marin Cilic", "Lleyton Hewitt", "Marat Safin", "Andy Roddick",
            "Ivan Lendl", "Jimmy Connors", "Stefan Edberg", "Mats Wilander", "Pat Rafter",
            "Guillermo Coria", "Gael Monfils", "Nick Kyrgios", "Naomi Osaka", "Iga Swiatek",
            "Coco Gauff", "Aryna Sabalenka", "Elena Rybakina", "Ashleigh Barty", "Caroline Wozniacki",
            "Simona Halep", "Victoria Azarenka", "Angelique Kerber", "Justine Henin", "Kim Clijsters"
        ]
    },
    //Medio
    {
        "name": "Tenis",
        "difficulty": "Medio",
        "words": [
            "Stefanos Tsitsipas", "Casper Ruud", "Andrey Rublev", "Taylor Fritz", "Holger Rune",
            "Hubert Hurkacz", "Alex de Minaur", "Grigor Dimitrov", "Diego Schwartzman", "Kei Nishikori",
            "Jo-Wilfried Tsonga", "David Ferrer", "Fernando González", "Nicolás Massú", "Juan Mónaco",
            "Mariano Puerta", "José Acasuso", "Juan Ignacio Chela", "Agustín Calleri", "Tommy Paul",
            "Frances Tiafoe", "Ben Shelton", "Sebastian Korda", "Karen Khachanov", "Félix Auger-Aliassime",
            "Denis Shapovalov", "Matteo Berrettini", "Lorenzo Musetti", "Fabio Fognini", "Richard Gasquet",
            "Gilles Simon", "Milos Raonic", "Kevin Anderson", "John Isner", "Reilly Opelka",
            "Pablo Carreño Busta", "Roberto Bautista Agut", "Francisco Cerúndolo", "Sebastián Báez", "Tomás Etcheverry",
            "Nicolás Jarry", "Alejandro Tabilo", "Cameron Norrie", "Jack Draper", "Daniel Evans",
            "Lucas Pouille", "Jerzy Janowicz", "Ernests Gulbis", "Benoit Paire", "Alexander Bublik"
        ]
    },
    //Dificil
    {
        "name": "Tenis",
        "difficulty": "Dificil",
        "words": [
            "Mariano Navone", "Facundo Díaz Acosta", "Federico Coria", "Camilo Ugo Carabelli", "Román Burruchaga",
            "Francisco Comesaña", "Thiago Tirante", "Genaro Olivieri", "Andrea Collarini", "Juan Manuel Cerúndolo",
            "Ugo Humbert", "Adrian Mannarino", "Arthur Fils", "Giovanni Mpetshi Perricard", "Arthur Rinderknech",
            "Jan-Lennard Struff", "Dominik Koepfer", "Yannick Hanfmann", "Tallon Griekspoor", "Botic van de Zandschulp",
            "Miomir Kecmanovic", "Laslo Djere", "Dusan Lajovic", "Hamad Medjedovic", "Fabian Marozsan",
            "Marton Fucsovics", "Zhizhen Zhang", "Juncheng Shang", "Yoshihito Nishioka", "Taro Daniel",
            "Jordan Thompson", "Alexei Popyrin", "Rinky Hijikata", "Thanasi Kokkinakis", "Max Purcell",
            "Nuno Borges", "Thiago Seyboth Wild", "Thiago Monteiro", "Felipe Meligeni Alves", "Cristian Garín",
            "Hugo Dellien", "Daniel Elahi Galán", "Emilio Nava", "Brandon Nakashima", "Marcos Giron",
            "Mackenzie McDonald", "Christopher Eubanks", "Aleksandar Kovacevic", "Corentin Moutet", "Hugo Gaston"
        ]
    },
    //Básquet
    //Facil
    {
        "name": "Básquet",
        "difficulty": "Facil",
        "words": [
            "Michael Jordan", "LeBron James", "Kobe Bryant", "Shaquille O'Neal", "Stephen Curry",
            "Manu Ginobili", "Magic Johnson", "Larry Bird", "Dennis Rodman", "Scottie Pippen",
            "Kevin Durant", "Giannis Antetokounmpo", "Luka Doncic", "James Harden", "Kyrie Irving",
            "Kareem Abdul-Jabbar", "Yao Ming", "Pau Gasol", "Dirk Nowitzki", "Tony Parker",
            "Tim Duncan", "Allen Iverson", "Vince Carter", "Kawhi Leonard", "Russell Westbrook",
            "Nikola Jokic", "Dwyane Wade", "Carmelo Anthony", "Luis Scola", "Facundo Campazzo",
            "Wilt Chamberlain", "Bill Russell", "Charles Barkley", "Steve Nash", "Dwight Howard",
            "Derrick Rose", "Chris Paul", "Anthony Davis", "Jayson Tatum", "Jimmy Butler",
            "Klay Thompson", "Draymond Green", "Paul George", "Damian Lillard", "Blake Griffin",
            "Ben Simmons", "Victor Wembanyama", "Joel Embiid", "Ja Morant", "Zion Williamson"
        ]
    },
    //Medio
    {
        "name": "Básquet",
        "difficulty": "Medio",
        "words": [
            "Tracy McGrady", "Reggie Miller", "Patrick Ewing", "Hakeem Olajuwon", "David Robinson",
            "John Stockton", "Karl Malone", "Chris Bosh", "Ray Allen", "Kevin Garnett",
            "Andrés Nocioni", "Fabricio Oberto", "Carlos Delfino", "Pablo Prigioni", "Leandro Bolmaro",
            "Arvydas Sabonis", "Drazen Petrovic", "Toni Kukoc", "Vlade Divac", "Peja Stojakovic",
            "Marc Gasol", "Ricky Rubio", "Rudy Gobert", "Donovan Mitchell", "Devin Booker",
            "Trae Young", "DeMar DeRozan", "Zach LaVine", "Bradley Beal", "CJ McCollum",
            "Domantas Sabonis", "Shai Gilgeous-Alexander", "Jamal Murray", "Bam Adebayo", "Jaylen Brown",
            "Karl-Anthony Towns", "Andrew Wiggins", "Aaron Gordon", "Jrue Holiday", "Khris Middleton",
            "Kyle Lowry", "Dearmaron Fox", "Tyrese Haliburton", "LaMelo Ball", "Anthony Edwards",
            "Kristaps Porzingis", "Lauri Markkanen", "Al Horford", "Brook Lopez", "Gordon Hayward"
        ]
    },
    //Dificil
    {
        "name": "Básquet",
        "difficulty": "Dificil",
        "words": [
            "Walter Herrmann", "Nicolás Laprovittola", "Gabriel Deck", "Luca Vildoza", "Pepe Sánchez",
            "Detlef Schrempf", "Rik Smits", "Sarunas Marciulionis", "Dino Radja", "Oscar Schmidt",
            "Juan Carlos Navarro", "Nandos De Colo", "Bogdan Bogdanovic", "Bojan Bogdanovic", "Jonas Valanciunas",
            "Nikola Vucevic", "Jusuf Nurkic", "Clint Capela", "Dennis Schröder", "Evan Fournier",
            "Nicolas Batum", "Patty Mills", "Joe Ingles", "Steven Adams", "Buddy Hield",
            "Fred VanVleet", "Pascal Siakam", "OG Anunoby", "Mikal Bridges", "Jalen Brunson",
            "Tyrese Maxey", "Desmond Bane", "Jaren Jackson Jr.", "Evan Mobley", "Darius Garland",
            "Cade Cunningham", "Paolo Banchero", "Chet Holmgren", "Alperen Sengun", "Franz Wagner",
            "Austin Reaves", "D'Angelo Russell", "Spencer Dinwiddie", "Tobias Harris", "Jerami Grant",
            "Myles Turner", "Jarrett Allen", "Robert Williams III", "Herbert Jones", "Jose Alvarado"
        ]
    }
];

export async function seedDatabase() {
    try {
        await connectToDatabase();

        // Clear existing (optional, but good for reset)
        await Category.deleteMany({});

        // Insert new
        await Category.insertMany(INITIAL_DATA);

        return { success: true, message: 'Database seeded successfully!' };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}
