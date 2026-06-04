import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const players = [
  // ===== ENGLAND =====
  { name: "Jordan Pickford", position: "GK", country: "England", clubTeam: "Everton", value: 6.5, sofifaId: "211117" },
  { name: "Aaron Ramsdale", position: "GK", country: "England", clubTeam: "Southampton", value: 5.0, sofifaId: "236524" },
  { name: "Trent Alexander-Arnold", position: "DEF", country: "England", clubTeam: "Real Madrid", value: 9.0, sofifaId: "232592" },
  { name: "Kieran Trippier", position: "DEF", country: "England", clubTeam: "Newcastle", value: 7.5, sofifaId: "210377" },
  { name: "John Stones", position: "DEF", country: "England", clubTeam: "Man City", value: 7.0, sofifaId: "205447" },
  { name: "Marc Guehi", position: "DEF", country: "England", clubTeam: "Crystal Palace", value: 6.5, sofifaId: "244723" },
  { name: "Luke Shaw", position: "DEF", country: "England", clubTeam: "Man United", value: 6.0, sofifaId: "209966" },
  { name: "Bukayo Saka", position: "MID", country: "England", clubTeam: "Arsenal", value: 11.5, sofifaId: "246669" },
  { name: "Jude Bellingham", position: "MID", country: "England", clubTeam: "Real Madrid", value: 14.0, sofifaId: "237692" },
  { name: "Declan Rice", position: "MID", country: "England", clubTeam: "Arsenal", value: 9.5, sofifaId: "246470" },
  { name: "Phil Foden", position: "MID", country: "England", clubTeam: "Man City", value: 10.5, sofifaId: "237633" },
  { name: "Cole Palmer", position: "MID", country: "England", clubTeam: "Chelsea", value: 10.0, sofifaId: "261130" },
  { name: "Harry Kane", position: "FWD", country: "England", clubTeam: "Bayern Munich", value: 13.0, sofifaId: "202126" },
  { name: "Ollie Watkins", position: "FWD", country: "England", clubTeam: "Aston Villa", value: 8.5, sofifaId: "221566" },
  { name: "Ivan Toney", position: "FWD", country: "England", clubTeam: "Al-Ahli", value: 6.5, sofifaId: "223349" },

  // ===== FRANCE =====
  { name: "Mike Maignan", position: "GK", country: "France", clubTeam: "AC Milan", value: 7.5, sofifaId: "225029" },
  { name: "Alphonse Areola", position: "GK", country: "France", clubTeam: "West Ham", value: 5.0, sofifaId: "214866" },
  { name: "Jules Koundé", position: "DEF", country: "France", clubTeam: "Barcelona", value: 8.5, sofifaId: "245692" },
  { name: "Dayot Upamecano", position: "DEF", country: "France", clubTeam: "Bayern Munich", value: 7.5, sofifaId: "243992" },
  { name: "Theo Hernandez", position: "DEF", country: "France", clubTeam: "AC Milan", value: 8.0, sofifaId: "235243" },
  { name: "Benjamin Pavard", position: "DEF", country: "France", clubTeam: "Inter Milan", value: 7.0, sofifaId: "223750" },
  { name: "Eduardo Camavinga", position: "MID", country: "France", clubTeam: "Real Madrid", value: 8.5, sofifaId: "262749" },
  { name: "Aurélien Tchouaméni", position: "MID", country: "France", clubTeam: "Real Madrid", value: 9.0, sofifaId: "251611" },
  { name: "Antoine Griezmann", position: "MID", country: "France", clubTeam: "Atletico Madrid", value: 9.5, sofifaId: "194765" },
  { name: "Ousmane Dembélé", position: "MID", country: "France", clubTeam: "PSG", value: 10.0, sofifaId: "231443" },
  { name: "Kylian Mbappé", position: "FWD", country: "France", clubTeam: "Real Madrid", value: 15.5, sofifaId: "231747" },
  { name: "Marcus Thuram", position: "FWD", country: "France", clubTeam: "Inter Milan", value: 9.0, sofifaId: "244030" },
  { name: "Olivier Giroud", position: "FWD", country: "France", clubTeam: "LA Galaxy", value: 6.0, sofifaId: "181985" },

  // ===== BRAZIL =====
  { name: "Alisson Becker", position: "GK", country: "Brazil", clubTeam: "Liverpool", value: 8.0, sofifaId: "212831" },
  { name: "Éderson", position: "GK", country: "Brazil", clubTeam: "Man City", value: 7.0, sofifaId: "222665" },
  { name: "Éder Militão", position: "DEF", country: "Brazil", clubTeam: "Real Madrid", value: 9.0, sofifaId: "255088" },
  { name: "Marquinhos", position: "DEF", country: "Brazil", clubTeam: "PSG", value: 8.0, sofifaId: "212651" },
  { name: "Danilo", position: "DEF", country: "Brazil", clubTeam: "Flamengo", value: 6.0, sofifaId: "215451" },
  { name: "Wendell", position: "DEF", country: "Brazil", clubTeam: "Porto", value: 5.5, sofifaId: "207512" },
  { name: "Bruno Guimarães", position: "MID", country: "Brazil", clubTeam: "Newcastle", value: 9.5, sofifaId: "253088" },
  { name: "Lucas Paquetá", position: "MID", country: "Brazil", clubTeam: "West Ham", value: 9.0, sofifaId: "248980" },
  { name: "Raphinha", position: "MID", country: "Brazil", clubTeam: "Barcelona", value: 10.5, sofifaId: "246923" },
  { name: "Rodrygo", position: "FWD", country: "Brazil", clubTeam: "Real Madrid", value: 11.0, sofifaId: "265524" },
  { name: "Vinicius Jr", position: "FWD", country: "Brazil", clubTeam: "Real Madrid", value: 15.5, sofifaId: "238794" },
  { name: "Gabriel Martinelli", position: "FWD", country: "Brazil", clubTeam: "Arsenal", value: 9.5, sofifaId: "264607" },
  { name: "Endrick", position: "FWD", country: "Brazil", clubTeam: "Real Madrid", value: 8.5, sofifaId: "272007" },

  // ===== ARGENTINA =====
  { name: "Emiliano Martínez", position: "GK", country: "Argentina", clubTeam: "Aston Villa", value: 7.5, sofifaId: "198012" },
  { name: "Geronimo Rulli", position: "GK", country: "Argentina", clubTeam: "Ajax", value: 5.0, sofifaId: "213212" },
  { name: "Cristian Romero", position: "DEF", country: "Argentina", clubTeam: "Tottenham", value: 8.5, sofifaId: "239318" },
  { name: "Nicolás Otamendi", position: "DEF", country: "Argentina", clubTeam: "Benfica", value: 6.0, sofifaId: "188081" },
  { name: "Nahuel Molina", position: "DEF", country: "Argentina", clubTeam: "Atletico Madrid", value: 7.5, sofifaId: "252009" },
  { name: "Lisandro Martínez", position: "DEF", country: "Argentina", clubTeam: "Man United", value: 8.0, sofifaId: "247003" },
  { name: "Rodrigo De Paul", position: "MID", country: "Argentina", clubTeam: "Atletico Madrid", value: 8.5, sofifaId: "220502" },
  { name: "Alexis Mac Allister", position: "MID", country: "Argentina", clubTeam: "Liverpool", value: 9.5, sofifaId: "242473" },
  { name: "Enzo Fernández", position: "MID", country: "Argentina", clubTeam: "Chelsea", value: 9.5, sofifaId: "261774" },
  { name: "Ángel Di María", position: "MID", country: "Argentina", clubTeam: "Benfica", value: 7.0, sofifaId: "183853" },
  { name: "Lionel Messi", position: "FWD", country: "Argentina", clubTeam: "Inter Miami", value: 14.0, sofifaId: "158023" },
  { name: "Lautaro Martínez", position: "FWD", country: "Argentina", clubTeam: "Inter Milan", value: 11.0, sofifaId: "245351" },
  { name: "Julián Álvarez", position: "FWD", country: "Argentina", clubTeam: "Atletico Madrid", value: 10.0, sofifaId: "261381" },

  // ===== SPAIN =====
  { name: "Unai Simón", position: "GK", country: "Spain", clubTeam: "Athletic Bilbao", value: 7.0, sofifaId: "241245" },
  { name: "David Raya", position: "GK", country: "Spain", clubTeam: "Arsenal", value: 7.0, sofifaId: "213345" },
  { name: "Dani Carvajal", position: "DEF", country: "Spain", clubTeam: "Real Madrid", value: 7.5, sofifaId: "196082" },
  { name: "Aymeric Laporte", position: "DEF", country: "Spain", clubTeam: "Al-Nassr", value: 6.5, sofifaId: "226322" },
  { name: "Robin Le Normand", position: "DEF", country: "Spain", clubTeam: "Atletico Madrid", value: 7.0, sofifaId: "247131" },
  { name: "Marc Cucurella", position: "DEF", country: "Spain", clubTeam: "Chelsea", value: 6.5, sofifaId: "253658" },
  { name: "Pedri", position: "MID", country: "Spain", clubTeam: "Barcelona", value: 11.5, sofifaId: "251170" },
  { name: "Rodri", position: "MID", country: "Spain", clubTeam: "Man City", value: 11.0, sofifaId: "222665" },
  { name: "Gavi", position: "MID", country: "Spain", clubTeam: "Barcelona", value: 10.5, sofifaId: "262779" },
  { name: "Dani Olmo", position: "MID", country: "Spain", clubTeam: "Barcelona", value: 9.5, sofifaId: "238813" },
  { name: "Lamine Yamal", position: "MID", country: "Spain", clubTeam: "Barcelona", value: 13.0, sofifaId: "261289" },
  { name: "Álvaro Morata", position: "FWD", country: "Spain", clubTeam: "AC Milan", value: 8.0, sofifaId: "200389" },
  { name: "Ferran Torres", position: "FWD", country: "Spain", clubTeam: "Barcelona", value: 7.5, sofifaId: "257244" },

  // ===== GERMANY =====
  { name: "Manuel Neuer", position: "GK", country: "Germany", clubTeam: "Bayern Munich", value: 6.5, sofifaId: "167495" },
  { name: "Marc-André ter Stegen", position: "GK", country: "Germany", clubTeam: "Barcelona", value: 6.5, sofifaId: "189049" },
  { name: "Antonio Rüdiger", position: "DEF", country: "Germany", clubTeam: "Real Madrid", value: 8.5, sofifaId: "208962" },
  { name: "Niklas Süle", position: "DEF", country: "Germany", clubTeam: "Dortmund", value: 6.5, sofifaId: "215941" },
  { name: "Joshua Kimmich", position: "MID", country: "Germany", clubTeam: "Bayern Munich", value: 10.5, sofifaId: "212622" },
  { name: "Thomas Müller", position: "MID", country: "Germany", clubTeam: "Bayern Munich", value: 7.5, sofifaId: "189596" },
  { name: "Florian Wirtz", position: "MID", country: "Germany", clubTeam: "Bayern Munich", value: 13.0, sofifaId: "264683" },
  { name: "Jamal Musiala", position: "MID", country: "Germany", clubTeam: "Bayern Munich", value: 12.0, sofifaId: "253710" },
  { name: "Leroy Sané", position: "MID", country: "Germany", clubTeam: "Bayern Munich", value: 9.5, sofifaId: "226914" },
  { name: "Kai Havertz", position: "FWD", country: "Germany", clubTeam: "Arsenal", value: 9.5, sofifaId: "223585" },
  { name: "Niclas Füllkrug", position: "FWD", country: "Germany", clubTeam: "West Ham", value: 7.5, sofifaId: "207158" },
  { name: "Deniz Undav", position: "FWD", country: "Germany", clubTeam: "Stuttgart", value: 7.0, sofifaId: "234729" },

  // ===== PORTUGAL =====
  { name: "Diogo Costa", position: "GK", country: "Portugal", clubTeam: "Porto", value: 7.0, sofifaId: "253213" },
  { name: "José Sá", position: "GK", country: "Portugal", clubTeam: "Wolves", value: 5.5, sofifaId: "224617" },
  { name: "João Cancelo", position: "DEF", country: "Portugal", clubTeam: "Barcelona", value: 8.5, sofifaId: "211517" },
  { name: "Rúben Dias", position: "DEF", country: "Portugal", clubTeam: "Man City", value: 9.0, sofifaId: "251706" },
  { name: "Raphaël Guerreiro", position: "DEF", country: "Portugal", clubTeam: "Bayern Munich", value: 7.0, sofifaId: "214135" },
  { name: "Nuno Mendes", position: "DEF", country: "Portugal", clubTeam: "PSG", value: 7.5, sofifaId: "264513" },
  { name: "João Palhinha", position: "MID", country: "Portugal", clubTeam: "Bayern Munich", value: 8.5, sofifaId: "241036" },
  { name: "Bruno Fernandes", position: "MID", country: "Portugal", clubTeam: "Man United", value: 10.5, sofifaId: "212831" },
  { name: "Bernardo Silva", position: "MID", country: "Portugal", clubTeam: "Man City", value: 11.0, sofifaId: "222433" },
  { name: "João Félix", position: "MID", country: "Portugal", clubTeam: "Chelsea", value: 9.5, sofifaId: "244747" },
  { name: "Cristiano Ronaldo", position: "FWD", country: "Portugal", clubTeam: "Al-Nassr", value: 10.5, sofifaId: "20801" },
  { name: "Rafael Leão", position: "FWD", country: "Portugal", clubTeam: "AC Milan", value: 11.5, sofifaId: "244696" },
  { name: "Gonçalo Ramos", position: "FWD", country: "Portugal", clubTeam: "PSG", value: 9.0, sofifaId: "263609" },

  // ===== NETHERLANDS =====
  { name: "Bart Verbruggen", position: "GK", country: "Netherlands", clubTeam: "Brighton", value: 5.5, sofifaId: "270030" },
  { name: "Virgil van Dijk", position: "DEF", country: "Netherlands", clubTeam: "Liverpool", value: 9.5, sofifaId: "203376" },
  { name: "Stefan de Vrij", position: "DEF", country: "Netherlands", clubTeam: "Inter Milan", value: 7.0, sofifaId: "194014" },
  { name: "Denzel Dumfries", position: "DEF", country: "Netherlands", clubTeam: "Inter Milan", value: 7.5, sofifaId: "228749" },
  { name: "Frenkie de Jong", position: "MID", country: "Netherlands", clubTeam: "Barcelona", value: 10.5, sofifaId: "240476" },
  { name: "Tijjani Reijnders", position: "MID", country: "Netherlands", clubTeam: "AC Milan", value: 9.0, sofifaId: "255866" },
  { name: "Xavi Simons", position: "MID", country: "Netherlands", clubTeam: "Leipzig", value: 10.0, sofifaId: "273331" },
  { name: "Teun Koopmeiners", position: "MID", country: "Netherlands", clubTeam: "Juventus", value: 9.5, sofifaId: "247440" },
  { name: "Cody Gakpo", position: "FWD", country: "Netherlands", clubTeam: "Liverpool", value: 10.5, sofifaId: "258004" },
  { name: "Memphis Depay", position: "FWD", country: "Netherlands", clubTeam: "Atletico Madrid", value: 8.0, sofifaId: "200563" },
  { name: "Donyell Malen", position: "FWD", country: "Netherlands", clubTeam: "Aston Villa", value: 8.5, sofifaId: "249380" },

  // ===== BELGIUM =====
  { name: "Thibaut Courtois", position: "GK", country: "Belgium", clubTeam: "Real Madrid", value: 8.0, sofifaId: "192448" },
  { name: "Timothy Castagne", position: "DEF", country: "Belgium", clubTeam: "Fulham", value: 6.5, sofifaId: "218218" },
  { name: "Jan Vertonghen", position: "DEF", country: "Belgium", clubTeam: "RSC Anderlecht", value: 5.5, sofifaId: "177092" },
  { name: "Wout Faes", position: "DEF", country: "Belgium", clubTeam: "Leicester", value: 6.0, sofifaId: "247424" },
  { name: "Kevin De Bruyne", position: "MID", country: "Belgium", clubTeam: "Man City", value: 13.5, sofifaId: "192985" },
  { name: "Youri Tielemans", position: "MID", country: "Belgium", clubTeam: "Aston Villa", value: 8.0, sofifaId: "218528" },
  { name: "Leandro Trossard", position: "MID", country: "Belgium", clubTeam: "Arsenal", value: 8.5, sofifaId: "231866" },
  { name: "Jérémy Doku", position: "MID", country: "Belgium", clubTeam: "Man City", value: 9.5, sofifaId: "264768" },
  { name: "Romelu Lukaku", position: "FWD", country: "Belgium", clubTeam: "Napoli", value: 8.5, sofifaId: "192505" },
  { name: "Lois Openda", position: "FWD", country: "Belgium", clubTeam: "Leipzig", value: 9.5, sofifaId: "258123" },
  { name: "Charles De Ketelaere", position: "MID", country: "Belgium", clubTeam: "Atalanta", value: 8.5, sofifaId: "256844" },

  // ===== ITALY =====
  { name: "Gianluigi Donnarumma", position: "GK", country: "Italy", clubTeam: "PSG", value: 8.0, sofifaId: "230666" },
  { name: "Giovanni Di Lorenzo", position: "DEF", country: "Italy", clubTeam: "Napoli", value: 7.5, sofifaId: "220455" },
  { name: "Alessandro Bastoni", position: "DEF", country: "Italy", clubTeam: "Inter Milan", value: 8.5, sofifaId: "244625" },
  { name: "Federico Dimarco", position: "DEF", country: "Italy", clubTeam: "Inter Milan", value: 7.5, sofifaId: "233515" },
  { name: "Nicolò Barella", position: "MID", country: "Italy", clubTeam: "Inter Milan", value: 9.5, sofifaId: "236459" },
  { name: "Sandro Tonali", position: "MID", country: "Italy", clubTeam: "Newcastle", value: 9.5, sofifaId: "248927" },
  { name: "Lorenzo Pellegrini", position: "MID", country: "Italy", clubTeam: "Roma", value: 8.0, sofifaId: "226460" },
  { name: "Federico Chiesa", position: "MID", country: "Italy", clubTeam: "Liverpool", value: 9.0, sofifaId: "233866" },
  { name: "Giacomo Raspadori", position: "FWD", country: "Italy", clubTeam: "Napoli", value: 8.5, sofifaId: "257049" },
  { name: "Gianluca Scamacca", position: "FWD", country: "Italy", clubTeam: "Atalanta", value: 8.5, sofifaId: "254618" },
  { name: "Mateo Retegui", position: "FWD", country: "Italy", clubTeam: "Atalanta", value: 9.0, sofifaId: "253710" },

  // ===== CROATIA =====
  { name: "Dominik Livaković", position: "GK", country: "Croatia", clubTeam: "Fenerbahce", value: 7.0, sofifaId: "222049" },
  { name: "Joško Gvardiol", position: "DEF", country: "Croatia", clubTeam: "Man City", value: 10.0, sofifaId: "261224" },
  { name: "Dejan Lovren", position: "DEF", country: "Croatia", clubTeam: "Lyon", value: 5.5, sofifaId: "188781" },
  { name: "Mateo Kovačić", position: "MID", country: "Croatia", clubTeam: "Man City", value: 8.5, sofifaId: "214613" },
  { name: "Luka Modrić", position: "MID", country: "Croatia", clubTeam: "Real Madrid", value: 9.0, sofifaId: "177003" },
  { name: "Ivan Perišić", position: "MID", country: "Croatia", clubTeam: "Hajduk Split", value: 7.5, sofifaId: "189597" },
  { name: "Nikola Vlašić", position: "MID", country: "Croatia", clubTeam: "Torino", value: 7.5, sofifaId: "241322" },
  { name: "Andrej Kramarić", position: "FWD", country: "Croatia", clubTeam: "Hoffenheim", value: 8.5, sofifaId: "207135" },
  { name: "Bruno Petković", position: "FWD", country: "Croatia", clubTeam: "Dinamo Zagreb", value: 7.0, sofifaId: "208618" },

  // ===== MOROCCO =====
  { name: "Yassine Bounou", position: "GK", country: "Morocco", clubTeam: "Al-Hilal", value: 7.0, sofifaId: "210764" },
  { name: "Achraf Hakimi", position: "DEF", country: "Morocco", clubTeam: "PSG", value: 10.5, sofifaId: "237907" },
  { name: "Romain Saiss", position: "DEF", country: "Morocco", clubTeam: "Besiktas", value: 6.0, sofifaId: "199521" },
  { name: "Nayef Aguerd", position: "DEF", country: "Morocco", clubTeam: "West Ham", value: 7.0, sofifaId: "236572" },
  { name: "Sofyan Amrabat", position: "MID", country: "Morocco", clubTeam: "Fiorentina", value: 8.0, sofifaId: "238793" },
  { name: "Azzedine Ounahi", position: "MID", country: "Morocco", clubTeam: "Marseille", value: 7.5, sofifaId: "265449" },
  { name: "Hakim Ziyech", position: "MID", country: "Morocco", clubTeam: "Galatasaray", value: 8.5, sofifaId: "221028" },
  { name: "Sofiane Boufal", position: "MID", country: "Morocco", clubTeam: "Angers", value: 7.0, sofifaId: "216284" },
  { name: "Youssef En-Nesyri", position: "FWD", country: "Morocco", clubTeam: "Fenerbahce", value: 9.0, sofifaId: "241624" },
  { name: "Abde Ezzalzouli", position: "FWD", country: "Morocco", clubTeam: "Betis", value: 7.5, sofifaId: "271186" },

  // ===== SENEGAL =====
  { name: "Édouard Mendy", position: "GK", country: "Senegal", clubTeam: "Al-Ahli", value: 6.0, sofifaId: "226192" },
  { name: "Kalidou Koulibaly", position: "DEF", country: "Senegal", clubTeam: "Al-Hilal", value: 7.5, sofifaId: "202952" },
  { name: "Ismail Jakobs", position: "DEF", country: "Senegal", clubTeam: "Monaco", value: 6.0, sofifaId: "254234" },
  { name: "Cheikhou Kouyaté", position: "MID", country: "Senegal", clubTeam: "Nottm Forest", value: 6.0, sofifaId: "201596" },
  { name: "Idrissa Gueye", position: "MID", country: "Senegal", clubTeam: "Everton", value: 7.0, sofifaId: "202108" },
  { name: "Ismaïla Sarr", position: "MID", country: "Senegal", clubTeam: "Crystal Palace", value: 8.5, sofifaId: "239553" },
  { name: "Sadio Mané", position: "FWD", country: "Senegal", clubTeam: "Al-Nassr", value: 9.5, sofifaId: "208722" },
  { name: "Boulaye Dia", position: "FWD", country: "Senegal", clubTeam: "Lazio", value: 8.0, sofifaId: "237862" },
  { name: "Nicolas Jackson", position: "FWD", country: "Senegal", clubTeam: "Chelsea", value: 9.0, sofifaId: "263617" },

  // ===== USA =====
  { name: "Matt Turner", position: "GK", country: "USA", clubTeam: "Crystal Palace", value: 5.5, sofifaId: "220487" },
  { name: "Sergiño Dest", position: "DEF", country: "USA", clubTeam: "PSV", value: 6.5, sofifaId: "254618" },
  { name: "Tim Ream", position: "DEF", country: "USA", clubTeam: "Fulham", value: 5.0, sofifaId: "191258" },
  { name: "Tyler Adams", position: "MID", country: "USA", clubTeam: "Bournemouth", value: 8.5, sofifaId: "245839" },
  { name: "Weston McKennie", position: "MID", country: "USA", clubTeam: "Juventus", value: 8.0, sofifaId: "243359" },
  { name: "Giovanni Reyna", position: "MID", country: "USA", clubTeam: "Dortmund", value: 7.5, sofifaId: "265514" },
  { name: "Christian Pulisic", position: "MID", country: "USA", clubTeam: "AC Milan", value: 9.5, sofifaId: "221025" },
  { name: "Folarin Balogun", position: "FWD", country: "USA", clubTeam: "Monaco", value: 8.0, sofifaId: "266955" },
  { name: "Josh Sargent", position: "FWD", country: "USA", clubTeam: "Norwich", value: 7.0, sofifaId: "256014" },
  { name: "Ricardo Pepi", position: "FWD", country: "USA", clubTeam: "PSV", value: 7.5, sofifaId: "263941" },

  // ===== MEXICO =====
  { name: "Guillermo Ochoa", position: "GK", country: "Mexico", clubTeam: "AZ Alkmaar", value: 6.5, sofifaId: "176572" },
  { name: "Jorge Sánchez", position: "DEF", country: "Mexico", clubTeam: "Porto", value: 6.0, sofifaId: "247779" },
  { name: "Héctor Moreno", position: "DEF", country: "Mexico", clubTeam: "Monterrey", value: 5.5, sofifaId: "197476" },
  { name: "Hirving Lozano", position: "MID", country: "Mexico", clubTeam: "PSV", value: 8.5, sofifaId: "228703" },
  { name: "Edson Álvarez", position: "MID", country: "Mexico", clubTeam: "West Ham", value: 8.5, sofifaId: "234549" },
  { name: "Alexis Vega", position: "MID", country: "Mexico", clubTeam: "Guadalajara", value: 7.0, sofifaId: "237476" },
  { name: "Raúl Jiménez", position: "FWD", country: "Mexico", clubTeam: "Fulham", value: 7.5, sofifaId: "201960" },
  { name: "Henry Martín", position: "FWD", country: "Mexico", clubTeam: "Club America", value: 7.0, sofifaId: "200985" },

  // ===== JAPAN =====
  { name: "Shuichi Gonda", position: "GK", country: "Japan", clubTeam: "Shimizu S-Pulse", value: 5.0, sofifaId: "200282" },
  { name: "Yuto Nagatomo", position: "DEF", country: "Japan", clubTeam: "FC Tokyo", value: 5.5, sofifaId: "192714" },
  { name: "Hiroki Sakai", position: "DEF", country: "Japan", clubTeam: "Urawa Reds", value: 5.5, sofifaId: "200281" },
  { name: "Takehiro Tomiyasu", position: "DEF", country: "Japan", clubTeam: "Arsenal", value: 7.0, sofifaId: "248798" },
  { name: "Wataru Endo", position: "MID", country: "Japan", clubTeam: "Liverpool", value: 8.0, sofifaId: "231595" },
  { name: "Ritsu Doan", position: "MID", country: "Japan", clubTeam: "Freiburg", value: 8.0, sofifaId: "238814" },
  { name: "Takumi Minamino", position: "MID", country: "Japan", clubTeam: "Monaco", value: 7.5, sofifaId: "228752" },
  { name: "Keito Nakamura", position: "MID", country: "Japan", clubTeam: "Reims", value: 7.0, sofifaId: "259701" },
  { name: "Takefusa Kubo", position: "MID", country: "Japan", clubTeam: "Real Sociedad", value: 9.5, sofifaId: "257669" },
  { name: "Kaoru Mitoma", position: "FWD", country: "Japan", clubTeam: "Brighton", value: 10.0, sofifaId: "256698" },
  { name: "Daichi Kamada", position: "MID", country: "Japan", clubTeam: "Crystal Palace", value: 8.0, sofifaId: "243354" },
  { name: "Ayase Ueda", position: "FWD", country: "Japan", clubTeam: "Feyenoord", value: 7.0, sofifaId: "246793" },

  // ===== SOUTH KOREA =====
  { name: "Kim Seung-gyu", position: "GK", country: "South Korea", clubTeam: "Vissel Kobe", value: 5.0, sofifaId: "206191" },
  { name: "Kim Min-jae", position: "DEF", country: "South Korea", clubTeam: "Bayern Munich", value: 9.0, sofifaId: "241607" },
  { name: "Lee Young-jun", position: "DEF", country: "South Korea", clubTeam: "Genk", value: 6.0, sofifaId: "260965" },
  { name: "Lee Jae-sung", position: "MID", country: "South Korea", clubTeam: "Mainz", value: 7.0, sofifaId: "241286" },
  { name: "Hwang In-beom", position: "MID", country: "South Korea", clubTeam: "Feyenoord", value: 7.5, sofifaId: "230703" },
  { name: "Kwon Chang-hoon", position: "MID", country: "South Korea", clubTeam: "Suwon", value: 6.5, sofifaId: "216993" },
  { name: "Son Heung-min", position: "FWD", country: "South Korea", clubTeam: "Tottenham", value: 11.0, sofifaId: "200643" },
  { name: "Hwang Hee-chan", position: "FWD", country: "South Korea", clubTeam: "Wolves", value: 8.0, sofifaId: "236313" },
  { name: "Cho Gue-sung", position: "FWD", country: "South Korea", clubTeam: "Jeonbuk", value: 7.0, sofifaId: "249625" },

  // ===== CANADA =====
  { name: "Maxime Crépeau", position: "GK", country: "Canada", clubTeam: "LAFC", value: 5.0, sofifaId: "237025" },
  { name: "Alphonso Davies", position: "DEF", country: "Canada", clubTeam: "Bayern Munich", value: 10.5, sofifaId: "251369" },
  { name: "Alistair Johnston", position: "DEF", country: "Canada", clubTeam: "Celtic", value: 6.5, sofifaId: "252843" },
  { name: "Richie Laryea", position: "DEF", country: "Canada", clubTeam: "Nottm Forest", value: 6.0, sofifaId: "246459" },
  { name: "Stephen Eustáquio", position: "MID", country: "Canada", clubTeam: "Porto", value: 8.0, sofifaId: "247891" },
  { name: "Jonathan Osorio", position: "MID", country: "Canada", clubTeam: "Toronto FC", value: 6.5, sofifaId: "222168" },
  { name: "Tajon Buchanan", position: "MID", country: "Canada", clubTeam: "Inter Milan", value: 8.0, sofifaId: "252009" },
  { name: "Jonathan David", position: "FWD", country: "Canada", clubTeam: "Lille", value: 10.0, sofifaId: "254849" },
  { name: "Cyle Larin", position: "FWD", country: "Canada", clubTeam: "Club Brugge", value: 7.5, sofifaId: "223093" },

  // ===== URUGUAY =====
  { name: "Sergio Rochet", position: "GK", country: "Uruguay", clubTeam: "Nacional", value: 5.5, sofifaId: "233614" },
  { name: "Ronald Araújo", position: "DEF", country: "Uruguay", clubTeam: "Barcelona", value: 9.0, sofifaId: "266959" },
  { name: "José María Giménez", position: "DEF", country: "Uruguay", clubTeam: "Atletico Madrid", value: 7.0, sofifaId: "211147" },
  { name: "Rodrigo Bentancur", position: "MID", country: "Uruguay", clubTeam: "Tottenham", value: 8.5, sofifaId: "238812" },
  { name: "Federico Valverde", position: "MID", country: "Uruguay", clubTeam: "Real Madrid", value: 11.0, sofifaId: "242371" },
  { name: "Giorgian De Arrascaeta", position: "MID", country: "Uruguay", clubTeam: "Flamengo", value: 8.5, sofifaId: "222403" },
  { name: "Darwin Núñez", position: "FWD", country: "Uruguay", clubTeam: "Liverpool", value: 10.0, sofifaId: "264476" },
  { name: "Luis Suárez", position: "FWD", country: "Uruguay", clubTeam: "Nacional", value: 6.5, sofifaId: "176580" },
  { name: "Facundo Torres", position: "FWD", country: "Uruguay", clubTeam: "Orlando City", value: 7.5, sofifaId: "261768" },

  // ===== COLOMBIA =====
  { name: "Camilo Vargas", position: "GK", country: "Colombia", clubTeam: "Atlas", value: 5.5, sofifaId: "215381" },
  { name: "Dávinson Sánchez", position: "DEF", country: "Colombia", clubTeam: "Galatasaray", value: 7.0, sofifaId: "228512" },
  { name: "Santiago Arias", position: "DEF", country: "Colombia", clubTeam: "Bayer Leverkusen", value: 6.0, sofifaId: "206277" },
  { name: "Wilmar Barrios", position: "MID", country: "Colombia", clubTeam: "Zenit", value: 7.0, sofifaId: "236310" },
  { name: "James Rodríguez", position: "MID", country: "Colombia", clubTeam: "Rayo Vallecano", value: 8.5, sofifaId: "193003" },
  { name: "Juan Cuadrado", position: "MID", country: "Colombia", clubTeam: "Inter Miami", value: 7.0, sofifaId: "191680" },
  { name: "Luis Díaz", position: "MID", country: "Colombia", clubTeam: "Liverpool", value: 10.5, sofifaId: "244725" },
  { name: "Rafael Santos Borré", position: "FWD", country: "Colombia", clubTeam: "Eintracht Frankfurt", value: 7.5, sofifaId: "235345" },
  { name: "Jhon Durán", position: "FWD", country: "Colombia", clubTeam: "Aston Villa", value: 9.0, sofifaId: "270428" },

  // ===== NIGERIA =====
  { name: "Stanley Nwabali", position: "GK", country: "Nigeria", clubTeam: "Chippa United", value: 5.0, sofifaId: "265124" },
  { name: "Kenneth Omeruo", position: "DEF", country: "Nigeria", clubTeam: "Kasimpasa", value: 5.5, sofifaId: "215826" },
  { name: "Calvin Bassey", position: "DEF", country: "Nigeria", clubTeam: "Fulham", value: 6.5, sofifaId: "258063" },
  { name: "Wilfred Ndidi", position: "MID", country: "Nigeria", clubTeam: "Leicester", value: 8.5, sofifaId: "236514" },
  { name: "Alex Iwobi", position: "MID", country: "Nigeria", clubTeam: "Fulham", value: 7.5, sofifaId: "225145" },
  { name: "Ademola Lookman", position: "MID", country: "Nigeria", clubTeam: "Atalanta", value: 9.5, sofifaId: "231575" },
  { name: "Samuel Chukwueze", position: "MID", country: "Nigeria", clubTeam: "AC Milan", value: 8.0, sofifaId: "249481" },
  { name: "Victor Osimhen", position: "FWD", country: "Nigeria", clubTeam: "Galatasaray", value: 12.0, sofifaId: "254064" },
  { name: "Taiwo Awoniyi", position: "FWD", country: "Nigeria", clubTeam: "Nottm Forest", value: 7.5, sofifaId: "240576" },

  // ===== ECUADOR =====
  { name: "Hernán Galíndez", position: "GK", country: "Ecuador", clubTeam: "Aucas", value: 5.0, sofifaId: "225476" },
  { name: "Piero Hincapié", position: "DEF", country: "Ecuador", clubTeam: "Bayer Leverkusen", value: 7.5, sofifaId: "263614" },
  { name: "Byron Castillo", position: "DEF", country: "Ecuador", clubTeam: "Liga de Quito", value: 6.0, sofifaId: "261243" },
  { name: "Moisés Caicedo", position: "MID", country: "Ecuador", clubTeam: "Chelsea", value: 11.5, sofifaId: "259757" },
  { name: "Gonzalo Plata", position: "MID", country: "Ecuador", clubTeam: "Valladolid", value: 7.5, sofifaId: "260778" },
  { name: "Ángel Mena", position: "MID", country: "Ecuador", clubTeam: "León", value: 6.5, sofifaId: "208649" },
  { name: "Enner Valencia", position: "FWD", country: "Ecuador", clubTeam: "Fenerbahce", value: 7.0, sofifaId: "202535" },
  { name: "Kevin Rodríguez", position: "FWD", country: "Ecuador", clubTeam: "Ipswich", value: 7.5, sofifaId: "265134" },

  // ===== POLAND =====
  { name: "Wojciech Szczęsny", position: "GK", country: "Poland", clubTeam: "Barcelona", value: 7.0, sofifaId: "189615" },
  { name: "Jan Bednarek", position: "DEF", country: "Poland", clubTeam: "Southampton", value: 6.5, sofifaId: "220906" },
  { name: "Bartosz Bereszyński", position: "DEF", country: "Poland", clubTeam: "Empoli", value: 5.5, sofifaId: "213173" },
  { name: "Piotr Zieliński", position: "MID", country: "Poland", clubTeam: "Inter Milan", value: 8.5, sofifaId: "210573" },
  { name: "Przemysław Frankowski", position: "MID", country: "Poland", clubTeam: "Lens", value: 7.0, sofifaId: "238782" },
  { name: "Sebastian Szymański", position: "MID", country: "Poland", clubTeam: "Fenerbahce", value: 7.5, sofifaId: "246481" },
  { name: "Robert Lewandowski", position: "FWD", country: "Poland", clubTeam: "Barcelona", value: 11.5, sofifaId: "188545" },
  { name: "Arkadiusz Milik", position: "FWD", country: "Poland", clubTeam: "Juventus", value: 7.5, sofifaId: "215042" },
  { name: "Karol Swiderski", position: "FWD", country: "Poland", clubTeam: "Charlotte FC", value: 6.5, sofifaId: "241628" },

  // ===== DENMARK =====
  { name: "Kasper Schmeichel", position: "GK", country: "Denmark", clubTeam: "Anderlecht", value: 6.5, sofifaId: "184832" },
  { name: "Andreas Christensen", position: "DEF", country: "Denmark", clubTeam: "Barcelona", value: 8.0, sofifaId: "214847" },
  { name: "Simon Kjaer", position: "DEF", country: "Denmark", clubTeam: "AC Milan", value: 6.5, sofifaId: "194039" },
  { name: "Christian Eriksen", position: "MID", country: "Denmark", clubTeam: "Man United", value: 9.5, sofifaId: "197589" },
  { name: "Pierre-Emile Höjbjerg", position: "MID", country: "Denmark", clubTeam: "Marseille", value: 7.5, sofifaId: "216945" },
  { name: "Mikkel Damsgaard", position: "MID", country: "Denmark", clubTeam: "Brentford", value: 8.5, sofifaId: "255785" },
  { name: "Rasmus Hojlund", position: "FWD", country: "Denmark", clubTeam: "Man United", value: 10.0, sofifaId: "269971" },
  { name: "Jonas Wind", position: "FWD", country: "Denmark", clubTeam: "Wolfsburg", value: 7.5, sofifaId: "248912" },

  // ===== SWITZERLAND =====
  { name: "Yann Sommer", position: "GK", country: "Switzerland", clubTeam: "Inter Milan", value: 6.5, sofifaId: "196768" },
  { name: "Manuel Akanji", position: "DEF", country: "Switzerland", clubTeam: "Man City", value: 8.0, sofifaId: "222320" },
  { name: "Nico Elvedi", position: "DEF", country: "Switzerland", clubTeam: "Mönchengladbach", value: 6.5, sofifaId: "228682" },
  { name: "Granit Xhaka", position: "MID", country: "Switzerland", clubTeam: "Bayer Leverkusen", value: 8.5, sofifaId: "205658" },
  { name: "Xherdan Shaqiri", position: "MID", country: "Switzerland", clubTeam: "Chicago Fire", value: 7.0, sofifaId: "193677" },
  { name: "Remo Freuler", position: "MID", country: "Switzerland", clubTeam: "Nottm Forest", value: 7.5, sofifaId: "210518" },
  { name: "Ruben Vargas", position: "MID", country: "Switzerland", clubTeam: "Augsburg", value: 7.5, sofifaId: "248888" },
  { name: "Breel Embolo", position: "FWD", country: "Switzerland", clubTeam: "Monaco", value: 8.0, sofifaId: "226398" },
  { name: "Noah Okafor", position: "FWD", country: "Switzerland", clubTeam: "AC Milan", value: 7.5, sofifaId: "258053" },

  // ===== EGYPT =====
  { name: "Mohamed El-Shenawy", position: "GK", country: "Egypt", clubTeam: "Al-Ahly", value: 5.5, sofifaId: "208285" },
  { name: "Ahmed Hegazi", position: "DEF", country: "Egypt", clubTeam: "Al-Ittihad", value: 5.5, sofifaId: "206313" },
  { name: "Mohamed Elneny", position: "MID", country: "Egypt", clubTeam: "Arsenal", value: 7.0, sofifaId: "205807" },
  { name: "Omar Marmoush", position: "FWD", country: "Egypt", clubTeam: "Man City", value: 11.0, sofifaId: "243359" },
  { name: "Mohamed Salah", position: "FWD", country: "Egypt", clubTeam: "Liverpool", value: 13.0, sofifaId: "209331" },
  { name: "Trezeguet", position: "MID", country: "Egypt", clubTeam: "Kasimpasa", value: 6.5, sofifaId: "219722" },

  // ===== CAMEROON =====
  { name: "André Onana", position: "GK", country: "Cameroon", clubTeam: "Man United", value: 7.5, sofifaId: "231488" },
  { name: "Collins Fai", position: "DEF", country: "Cameroon", clubTeam: "Al-Tai", value: 5.5, sofifaId: "209282" },
  { name: "Nicolas Nkoulou", position: "DEF", country: "Cameroon", clubTeam: "Verona", value: 5.5, sofifaId: "193018" },
  { name: "Frank Anguissa", position: "MID", country: "Cameroon", clubTeam: "Napoli", value: 9.0, sofifaId: "230921" },
  { name: "Karl Toko Ekambi", position: "MID", country: "Cameroon", clubTeam: "Al-Qadsiah", value: 7.5, sofifaId: "224367" },
  { name: "Bryan Mbeumo", position: "MID", country: "Cameroon", clubTeam: "Brentford", value: 9.5, sofifaId: "252571" },
  { name: "Eric Maxim Choupo-Moting", position: "FWD", country: "Cameroon", clubTeam: "Eintracht Frankfurt", value: 7.0, sofifaId: "198695" },

  // ===== GHANA =====
  { name: "Lawrence Ati-Zigi", position: "GK", country: "Ghana", clubTeam: "St. Gallen", value: 5.0, sofifaId: "236988" },
  { name: "Daniel Amartey", position: "DEF", country: "Ghana", clubTeam: "Besiktas", value: 5.5, sofifaId: "211027" },
  { name: "Thomas Partey", position: "MID", country: "Ghana", clubTeam: "Arsenal", value: 8.5, sofifaId: "210462" },
  { name: "Mohammed Kudus", position: "MID", country: "Ghana", clubTeam: "West Ham", value: 9.5, sofifaId: "266973" },
  { name: "Jordan Ayew", position: "FWD", country: "Ghana", clubTeam: "Crystal Palace", value: 7.0, sofifaId: "212131" },
  { name: "Inaki Williams", position: "FWD", country: "Ghana", clubTeam: "Athletic Bilbao", value: 8.0, sofifaId: "226161" },
  { name: "Antoine Semenyo", position: "FWD", country: "Ghana", clubTeam: "Bournemouth", value: 7.5, sofifaId: "263479" },

  // ===== SERBIA =====
  { name: "Predrag Rajković", position: "GK", country: "Serbia", clubTeam: "Real Mallorca", value: 6.0, sofifaId: "220906" },
  { name: "Strahinja Milenkovic", position: "DEF", country: "Serbia", clubTeam: "Nottm Forest", value: 7.5, sofifaId: "237929" },
  { name: "Dušan Tadić", position: "MID", country: "Serbia", clubTeam: "Fenerbahce", value: 8.0, sofifaId: "204475" },
  { name: "Sergej Milinković-Savić", position: "MID", country: "Serbia", clubTeam: "Al-Hilal", value: 9.5, sofifaId: "217104" },
  { name: "Sasa Lukic", position: "MID", country: "Serbia", clubTeam: "Fulham", value: 7.0, sofifaId: "233851" },
  { name: "Dušan Vlahović", position: "FWD", country: "Serbia", clubTeam: "Juventus", value: 11.5, sofifaId: "252879" },
  { name: "Luka Jović", position: "FWD", country: "Serbia", clubTeam: "AC Milan", value: 7.5, sofifaId: "236095" },

  // ===== IRAN =====
  { name: "Alireza Beiranvand", position: "GK", country: "Iran", clubTeam: "Persepolis", value: 5.0, sofifaId: "218694" },
  { name: "Milad Mohammadi", position: "DEF", country: "Iran", clubTeam: "AEK Athens", value: 5.5, sofifaId: "214849" },
  { name: "Saman Ghoddos", position: "MID", country: "Iran", clubTeam: "Brentford", value: 7.0, sofifaId: "225060" },
  { name: "Alireza Jahanbakhsh", position: "MID", country: "Iran", clubTeam: "Feyenoord", value: 7.5, sofifaId: "220629" },
  { name: "Sardar Azmoun", position: "FWD", country: "Iran", clubTeam: "Bayer Leverkusen", value: 8.5, sofifaId: "218887" },
  { name: "Mehdi Taremi", position: "FWD", country: "Iran", clubTeam: "Inter Milan", value: 9.0, sofifaId: "219975" },

  // ===== AUSTRALIA =====
  { name: "Mathew Ryan", position: "GK", country: "Australia", clubTeam: "AZ Alkmaar", value: 5.5, sofifaId: "200048" },
  { name: "Aziz Behich", position: "DEF", country: "Australia", clubTeam: "Dundee United", value: 5.5, sofifaId: "203048" },
  { name: "Harry Souttar", position: "DEF", country: "Australia", clubTeam: "Leicester", value: 6.5, sofifaId: "247218" },
  { name: "Aaron Mooy", position: "MID", country: "Australia", clubTeam: "Celtic", value: 7.0, sofifaId: "206617" },
  { name: "Jackson Irvine", position: "MID", country: "Australia", clubTeam: "St. Pauli", value: 6.5, sofifaId: "214640" },
  { name: "Mathew Leckie", position: "MID", country: "Australia", clubTeam: "Melbourne City", value: 6.5, sofifaId: "192930" },
  { name: "Mitchell Duke", position: "FWD", country: "Australia", clubTeam: "Fagiano Okayama", value: 6.5, sofifaId: "214093" },
  { name: "Adam Maclaren", position: "FWD", country: "Australia", clubTeam: "Melbourne City", value: 6.0, sofifaId: "221780" },

  // ===== IVORY COAST =====
  { name: "Yahia Fofana", position: "GK", country: "Ivory Coast", clubTeam: "Chelsea", value: 6.5, sofifaId: "244786" },
  { name: "Eric Bailly", position: "DEF", country: "Ivory Coast", clubTeam: "Besiktas", value: 6.5, sofifaId: "211831" },
  { name: "Franck Kessié", position: "MID", country: "Ivory Coast", clubTeam: "Al-Ahli", value: 8.5, sofifaId: "225326" },
  { name: "Sébastien Haller", position: "FWD", country: "Ivory Coast", clubTeam: "Dortmund", value: 8.5, sofifaId: "217680" },
  { name: "Nicolas Pépé", position: "MID", country: "Ivory Coast", clubTeam: "Trabzonspor", value: 7.5, sofifaId: "225044" },
  { name: "Simon Adingra", position: "MID", country: "Ivory Coast", clubTeam: "Brighton", value: 8.0, sofifaId: "270428" },
  { name: "Wilfried Zaha", position: "MID", country: "Ivory Coast", clubTeam: "Galatasaray", value: 7.5, sofifaId: "201862" },
];

const gameweeks = [
  { number: 1, name: "Group Stage — Round 1", deadline: new Date("2026-06-11T12:00:00Z") },
  { number: 2, name: "Group Stage — Round 2", deadline: new Date("2026-06-17T12:00:00Z") },
  { number: 3, name: "Group Stage — Round 3", deadline: new Date("2026-06-23T12:00:00Z") },
  { number: 4, name: "Round of 32", deadline: new Date("2026-06-29T12:00:00Z") },
  { number: 5, name: "Round of 16", deadline: new Date("2026-07-04T12:00:00Z") },
  { number: 6, name: "Quarter-Finals", deadline: new Date("2026-07-09T12:00:00Z") },
  { number: 7, name: "Semi-Finals", deadline: new Date("2026-07-14T12:00:00Z") },
  { number: 8, name: "Final", deadline: new Date("2026-07-19T12:00:00Z") },
];

async function main() {
  console.log("Seeding database...");

  await prisma.gameweekPlayerStat.deleteMany();
  await prisma.gameweekPoints.deleteMany();
  await prisma.transfer.deleteMany();
  await prisma.userPlayer.deleteMany();
  await prisma.userTeam.deleteMany();
  await prisma.userChip.deleteMany();
  await prisma.leagueMember.deleteMany();
  await prisma.league.deleteMany();
  await prisma.user.deleteMany();
  await prisma.gameWeek.deleteMany();
  await prisma.player.deleteMany();

  for (const p of players) {
    await prisma.player.create({ data: p });
  }
  console.log(`Created ${players.length} players`);

  for (const gw of gameweeks) {
    await prisma.gameWeek.create({ data: { ...gw, isActive: gw.number === 1 } });
  }
  console.log(`Created ${gameweeks.length} gameweeks`);

  console.log("Done!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
