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
            "Toto Salvio", "Walter Bou", "Milton Giménez", "Adam Bareiro", "Lolo Miranda"
        ]
    },
    {
        "name": "Fútbol Argentino",
        "difficulty": "Medio",
        "words": [
            "Cristian Lema", "Agustín Sant'Anna", "Nicolás Fonseca", "Santiago Simón", "Pablo Solari",
            "Agustín Almendra", "Gastón Martirena", "Facundo Mura", "Roger Martínez", "Santiago Sosa",
            "Joaquín Laso", "Lucas González", "Iván Marcone", "Santiago Montiel", "Federico Gattoni",
            "Malcom Braida", "Gastón Hernández", "Nahuel Barrios", "Matías Reali", "Braian Romero",
            "Thiago Fernández", "Valentín Gómez", "Elías Gómez", "Tomás Marchiori", "Federico Girotti",
            "Guido Herrera", "Matías Galarza", "Matías Catalán", "Marcelino Moreno", "Lautaro Acosta",
            "Pepo De la Vega", "Lucas Janson", "Frank Fabra", "Jabes Saralegui", "Nicolás Figal",
            "Leandro González Pírez", "Matías Kranevitter", "Eric Meza", "Javier Altamirano", "Guido Carrillo"
        ]
    },
    {
        "name": "Fútbol Argentino",
        "difficulty": "Dificil",
        "words": [
            "Leandro Brey", "Lautaro Di Lollo", "Juan Ramírez", "Norberto Briasco", "Ramiro Funes Mori",
            "Sebastián Boselli", "Agustín Palavecino", "Nazareno Colombo", "Agustín García Basso", "Germán Conti",
            "Juan Fedorco", "Alex Luna", "Alexis Canelo", "Damián Pérez", "Jhohan Romaña",
            "Gastón Campi", "Facundo Altamirano", "Eryc Castillo", "Francisco Pizzini", "Agustín Bouzat",
            "Juan Portillo", "Lucas Suárez", "Blas Riveros", "Ramiro Carrera", "Nery Domínguez",
            "Felipe Peña Biafore", "José Paradela", "Santiago Silva", "Milton Céliz", "Jonathan Herrera",
            "Lucas Menossi", "Sebastián Prediger", "Alan Lescano", "Luciano Gondou", "Mateo Sanabria",
            "Tobías Cervera", "Juan Pintado", "Saúl Salcedo", "Gastón Benavídez", "Juan Espínola"
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
            "Donnarumma", "Hakimi", "Florian Wirtz", "Xavi Simons", "Alexander Arnold"
        ]
    },
    {
        "name": "Fútbol Internacional (5 grandes ligas)",
        "difficulty": "Medio",
        "words": [
            "Cole Palmer", "Nico Williams", "Alexis Mac Allister", "Douglas Luiz", "Zaniolo",
            "Micky van de Ven", "Gleison Bremer", "Federico Chiesa", "Dusan Vlahovic", "Barella",
            "Hakan Calhanoglu", "Marcus Thuram", "Pavard", "Jeremie Frimpong", "Grimaldo",
            "Victor Boniface", "Serhou Guirassy", "Loïs Openda", "Dani Olmo", "Mikel Merino",
            "Zubimendi", "Isco", "Savinho", "Artem Dovbyk", "Aleix Garcia",
            "Takefusa Kubo", "Alexander Isak", "Bruno Guimaraes", "Lucas Paqueta", "Jarrod Bowen",
            "James Maddison", "Anthony Gordon", "Dominic Solanke", "Ollie Watkins", "Vicario",
            "William Saliba", "Gabriel Magalhaes", "Vitinha", "Bradley Barcola", "Warren Zaire-Emery"
        ]
    },
    {
        "name": "Fútbol Internacional (5 grandes ligas)",
        "difficulty": "Dificil",
        "words": [
            "Pervis Estupiñan", "Sandro Tonali", "Manuel Akanji", "Viktor Gyokeres", "Exequiel Palacios",
            "Nico Schlotterbeck", "Gregor Kobel", "Morten Hjulmand", "Benjamin Sesko", "Piero Hincapie",
            "Edmond Tapsoba", "Ruben Loftus-Cheek", "Tijjani Reijnders", "Gianluca Scamacca", "Matteo Guendouzi",
            "Boubacar Kamara", "Eberechi Eze", "Michael Olise", "Bryan Mbeumo", "Lutsharel Geertruida",
            "Jerdy Schouten", "Mats Wieffer", "Johan Bakayoko", "Arthur Theate", "Amadou Onana",
            "Orel Mangala", "Zeno Debast", "Sacha Boey", "Mathys Tel", "Jamie Bynoe-Gittens",
            "Brajan Gruda", "Assane Diao", "Cristhian Mosquera", "Pepelu", "Isaac Romero",
            "Alex Baena", "Samu Omorodion", "Youssouf Fofana", "Facundo Medina", "Lucas Chevalier"
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
