'use server';

import connectToDatabase from '@/lib/mongodb';
import Category from '@/models/Category';

const INITIAL_DATA = [
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
