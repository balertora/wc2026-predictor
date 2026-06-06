/* ════════════════════════════════════════════════════════════════════════════
   TEAM DOSSIERS — WC 2026
   Preview-style scouting notes for all 48 teams. Loaded as a global before the
   main client script. Keys MUST match TEAM_DATA / GROUPS team names exactly.

   Fields per team:
     rank        – FIFA men's world ranking (1 April 2026 update)
     coach       – head coach for the tournament
     nickname    – common national-team nickname ('' if none in English use)
     style       – one-line description of playing style
     keyPlayers  – 3–5 players: { name, pos, note }   pos ∈ GK/DF/MF/FW
     strengths   – short bullet list
     weaknesses  – short bullet list
     outlook     – one-line tournament outlook

   Sources: RotoWire/Opta/Sky/MLSsoccer/FOX/Al Jazeera group previews +
   FIFA ranking (Wikipedia / FIFA). Last researched: June 2026.
   ════════════════════════════════════════════════════════════════════════════ */
const TEAM_DOSSIER = {

  // ── GROUP A ────────────────────────────────────────────────────────────────
  'Mexico': {
    rank: 15, coach: 'Javier Aguirre', nickname: 'El Tri',
    style: 'Possession-oriented co-hosts who build patiently and lean on home crowds; can lack a clinical edge.',
    keyPlayers: [
      { name: 'Raúl Jiménez', pos: 'FW', note: '3rd all-time Mexico scorer (44); Fulham target man' },
      { name: 'Edson Álvarez', pos: 'MF', note: 'Defensive midfield anchor and captain figure' },
      { name: 'Santiago Giménez', pos: 'FW', note: 'Modern No.9, movement in the box' },
    ],
    strengths: ['Home advantage', 'Tournament experience', 'Strong spine through midfield'],
    weaknesses: ['Decades of round-of-16 ceiling', 'Finishing droughts', 'Pressure of host expectation'],
    outlook: 'Heavy favorites to top Group A; the real test is finally breaking the last-16 curse.',
  },
  'South Africa': {
    rank: 60, coach: 'Hugo Broos', nickname: 'Bafana Bafana',
    style: 'Energetic, youthful side that presses and attacks through the wide areas.',
    keyPlayers: [
      { name: 'Oswin Appollis', pos: 'FW', note: 'Qualifying talisman — 2 goals, 4 assists' },
      { name: 'Lyle Foster', pos: 'FW', note: 'Burnley striker, pace in behind' },
      { name: 'Ronwen Williams', pos: 'GK', note: 'Captain and shot-stopper' },
    ],
    strengths: ['Pace out wide', 'Veteran coach who wins tournaments', 'No pressure underdogs'],
    weaknesses: ['Thin elite experience', 'Goals can dry up', 'Defensive lapses'],
    outlook: 'Roughly a coin-flip to reach the round of 32; the dark horse of Group A.',
  },
  'South Korea': {
    rank: 25, coach: 'Hong Myung-bo', nickname: 'Taegeuk Warriors',
    style: 'High-tempo, hard-running side built on European-based talent and relentless work rate.',
    keyPlayers: [
      { name: 'Son Heung-min', pos: 'FW', note: 'Captain and talisman; pace and finishing' },
      { name: 'Lee Kang-in', pos: 'MF', note: '2025 KOR Footballer of the Year; UCL winner with PSG' },
      { name: 'Kim Min-jae', pos: 'DF', note: 'Bayern centre-back, defensive rock' },
    ],
    strengths: ['World-class attacking duo', 'Stamina and work rate', 'Big-club defenders'],
    weaknesses: ['Over-reliance on Son', 'Can be opened up in transition', 'Squad depth'],
    outlook: 'Second favorites in Group A and a likely qualifier with their star quality.',
  },
  'Czechia': {
    rank: 41, coach: 'Ivan Hašek', nickname: '',
    style: 'Organized, physical and a genuine set-piece menace — scored more corners than any European side in qualifying.',
    keyPlayers: [
      { name: 'Patrik Schick', pos: 'FW', note: 'Leverkusen striker; top scorer in qualifying (5)' },
      { name: 'Tomáš Souček', pos: 'MF', note: 'Box-to-box presence, aerial threat' },
      { name: 'Lukáš Provod', pos: 'MF', note: 'Creativity and long-range threat' },
    ],
    strengths: ['Elite set-piece execution (7 corner goals)', 'Physicality', 'A proven goalscorer'],
    weaknesses: ['Can be passive in open play', 'Pace in wide defense', 'Reliant on Schick'],
    outlook: 'Live for second place; their dead-ball threat can decide tight games.',
  },

  // ── GROUP B ────────────────────────────────────────────────────────────────
  'Canada': {
    rank: 30, coach: 'Jesse Marsch', nickname: 'Les Rouges',
    style: 'Aggressive high press and fast vertical transitions under Jesse Marsch.',
    keyPlayers: [
      { name: 'Alphonso Davies', pos: 'DF', note: 'Bayern flyer; overlapping pace down the left' },
      { name: 'Jonathan David', pos: 'FW', note: 'Elite movement and finishing' },
      { name: 'Stephen Eustáquio', pos: 'MF', note: 'Midfield metronome' },
    ],
    strengths: ['Two genuinely elite players', 'High-energy press', 'Co-host momentum'],
    weaknesses: ['Never won a men\'s WC game', 'Defensive depth', 'Tournament inexperience'],
    outlook: 'Chasing a first-ever World Cup point and a knockout spot — both within reach.',
  },
  'Bosnia and Herz.': {
    rank: 65, coach: 'Sergej Barbarez', nickname: 'Zmajevi (Dragons)',
    style: 'Pragmatic and structured; resilient, physical and dangerous from set pieces rather than free-flowing.',
    keyPlayers: [
      { name: 'Edin Džeko', pos: 'FW', note: 'Veteran talisman and all-time top scorer' },
      { name: 'Sead Kolašinac', pos: 'DF', note: 'Physical, combative defender' },
      { name: 'Esmir Bajraktarević', pos: 'MF', note: 'Young creative spark' },
    ],
    strengths: ['Knocked out Italy to qualify', 'Set-piece threat', 'Discipline and resilience'],
    weaknesses: ['Aging core', 'Limited control of matches', 'Lacks pace'],
    outlook: 'Tournament returnees who will make every game uncomfortable; outsiders to advance.',
  },
  'Qatar': {
    rank: 55, coach: 'Julen Lopetegui', nickname: 'The Maroon',
    style: 'Technical, patient possession football — a step up in pragmatism under Lopetegui after a chastening 2022.',
    keyPlayers: [
      { name: 'Almoez Ali', pos: 'FW', note: 'Record goalscorer, 2019 Asian Cup top scorer' },
      { name: 'Akram Afif', pos: 'FW', note: 'Creative winger, two-time Asian Player of the Year' },
      { name: 'Abdulaziz Hatem', pos: 'MF', note: 'Midfield engine' },
    ],
    strengths: ['Experienced coach', 'Settled core from Asian Cup wins', 'Technical quality'],
    weaknesses: ['Winless on WC debut as 2022 hosts', 'Limited size/physicality', 'Untested vs elite'],
    outlook: 'Seeking redemption after 2022; needs a major upset to advance.',
  },
  'Switzerland': {
    rank: 19, coach: 'Murat Yakin', nickname: 'Nati',
    style: 'Technically complete, defensively solid tournament side that grinds out results and excels in knockouts.',
    keyPlayers: [
      { name: 'Granit Xhaka', pos: 'MF', note: 'Captain and midfield conductor' },
      { name: 'Manuel Akanji', pos: 'DF', note: 'Composed, ball-playing centre-back' },
      { name: 'Dan Ndoye', pos: 'FW', note: 'Direct wide threat' },
    ],
    strengths: ['Six straight World Cups', 'Knockout pedigree (beat France, Italy, Spain)', 'Defensive structure'],
    weaknesses: ['Lacks a prolific striker', 'Can be too cautious', 'Aging spine'],
    outlook: 'The "big boy" of Group B and clear favorites to top it.',
  },

  // ── GROUP C ────────────────────────────────────────────────────────────────
  'Brazil': {
    rank: 6, coach: 'Carlo Ancelotti', nickname: 'Seleção',
    style: 'More measured and balanced under Ancelotti than past improvisational sides — better structured defensively, still loaded in attack.',
    keyPlayers: [
      { name: 'Vinícius Júnior', pos: 'FW', note: 'Match-winning dribbler on the left' },
      { name: 'Raphinha', pos: 'FW', note: 'Direct, prolific wide forward' },
      { name: 'Alisson', pos: 'GK', note: 'World-class goalkeeper' },
      { name: 'Marquinhos', pos: 'DF', note: 'Defensive leader' },
    ],
    strengths: ['Deepest attacking pool in the field', 'Elite manager', 'Improved defensive shape'],
    weaknesses: ['Questions over a settled No.9', 'Big-game scar tissue', 'Midfield balance'],
    outlook: 'Group C favorites and genuine title contenders under Ancelotti.',
  },
  'Morocco': {
    rank: 8, coach: 'Mohamed Ouahbi', nickname: 'Atlas Lions',
    style: 'Tactically mature, defensively disciplined and lethal in transition — the blueprint from their 2022 semi-final run.',
    keyPlayers: [
      { name: 'Achraf Hakimi', pos: 'DF', note: 'Elite attacking right-back' },
      { name: 'Brahim Díaz', pos: 'MF', note: 'Creative spark between the lines' },
      { name: 'Bilal El Khannouss', pos: 'MF', note: 'Rising playmaker' },
    ],
    strengths: ['Best-ever African WC finish (4th, 2022)', 'AFCON champions', 'Tactical maturity'],
    weaknesses: ['New coach mid-cycle', 'Reliance on transitions', 'Goal threat through the middle'],
    outlook: 'Brazil\'s biggest threat in Group C and a dark horse to go deep again.',
  },
  'Haiti': {
    rank: 83, coach: 'Sébastien Migné', nickname: 'Les Grenadiers',
    style: 'Quick in transition and defensively organized — a spoiler that sits in and counters.',
    keyPlayers: [
      { name: 'Duckens Nazon', pos: 'FW', note: 'All-time top scorer (44); Concacaf qualifying top scorer (6)' },
      { name: 'Frantzdy Pierrot', pos: 'FW', note: 'Physical focal point' },
      { name: 'Johnny Plácide', pos: 'GK', note: 'Experienced last line' },
    ],
    strengths: ['Transition speed', 'Defensive organization', 'Nothing-to-lose freedom'],
    weaknesses: ['Lowest qualifying odds of all 48', 'Limited possession quality', 'Squad depth'],
    outlook: 'First World Cup since 1974; rated the least likely of all 48 to advance.',
  },
  'Scotland': {
    rank: 43, coach: 'Steve Clarke', nickname: 'Tartan Army',
    style: 'Structured, physical and combative — makes every match uncomfortable, strong from set pieces.',
    keyPlayers: [
      { name: 'Scott McTominay', pos: 'MF', note: 'Napoli cult hero; scored a stunning qualifier' },
      { name: 'Andy Robertson', pos: 'DF', note: 'Captain; attacking left-back' },
      { name: 'Billy Gilmour', pos: 'MF', note: 'Tidy midfield controller' },
    ],
    strengths: ['Physical and organized', 'Set-piece threat', 'Ends a 28-year WC wait fired up'],
    weaknesses: ['Never escaped a WC group', 'Limited cutting edge', 'Depth in attack'],
    outlook: 'First World Cup since 1998; will scrap for a historic knockout place.',
  },

  // ── GROUP D ────────────────────────────────────────────────────────────────
  'USA': {
    rank: 16, coach: 'Mauricio Pochettino', nickname: 'USMNT',
    style: 'Athletic, high-pressing co-hosts riding huge home support and a golden generation of Europe-based players.',
    keyPlayers: [
      { name: 'Christian Pulisic', pos: 'FW', note: 'Talisman; thriving at AC Milan' },
      { name: 'Weston McKennie', pos: 'MF', note: 'Energy and goals from midfield' },
      { name: 'Antonee Robinson', pos: 'DF', note: 'Flying overlapping full-back' },
    ],
    strengths: ['Home advantage (two LA group games)', 'European-based core', 'Elite manager'],
    weaknesses: ['Inconsistent results under pressure', 'Center-forward question', 'Big-game nerves'],
    outlook: 'Favorites in an open Group D; a deep run is the national expectation.',
  },
  'Paraguay': {
    rank: 40, coach: 'Gustavo Alfaro', nickname: 'La Albirroja',
    style: 'The most disciplined defensive unit from CONMEBOL — vertical, physical, punishing on the counter.',
    keyPlayers: [
      { name: 'Miguel Almirón', pos: 'MF', note: 'Transition engine; everything runs through him' },
      { name: 'Antonio Sanabria', pos: 'FW', note: 'Experienced focal point' },
      { name: 'Julio Enciso', pos: 'FW', note: 'Spark of individual quality' },
    ],
    strengths: ['Conceded just 10 in 18 qualifiers', 'Counter-attacking threat', 'Defensive discipline'],
    weaknesses: ['Limited creativity in possession', 'Reliance on Almirón', 'Goal threat'],
    outlook: 'Hard to beat and a real shout for a top-two finish in Group D.',
  },
  'Australia': {
    rank: 27, coach: 'Tony Popovic', nickname: 'Socceroos',
    style: 'Organized, hard-working and resilient — defends well and grinds out tournament results.',
    keyPlayers: [
      { name: 'Mathew Ryan', pos: 'GK', note: 'Captain; nine clean sheets in LaLiga last season' },
      { name: 'Jackson Irvine', pos: 'MF', note: 'Midfield leader and runner' },
      { name: 'Martin Boyle', pos: 'FW', note: 'Direct wide threat' },
    ],
    strengths: ['Reached R16 in 2022', 'Defensive organization', 'Tournament know-how'],
    weaknesses: ['Limited attacking firepower', 'Aging in key areas', 'Goals hard to come by'],
    outlook: 'Won\'t just make up the numbers; capable of nicking a knockout spot.',
  },
  'Turkey': {
    rank: 26, coach: 'Vincenzo Montella', nickname: 'Crescent-Stars',
    style: 'Talented, attack-minded side full of big-club technicians — dangerous going forward after a 24-year absence.',
    keyPlayers: [
      { name: 'Arda Güler', pos: 'MF', note: 'Real Madrid playmaker; the creative jewel' },
      { name: 'Hakan Çalhanoğlu', pos: 'MF', note: 'Deep-lying conductor and dead-ball ace' },
      { name: 'Kenan Yıldız', pos: 'FW', note: 'Juventus forward, rising star' },
    ],
    strengths: ['Genuine attacking quality', 'Creative midfield', 'High ceiling'],
    weaknesses: ['Defensive reliability', '24 years of WC rust', 'Consistency'],
    outlook: 'Slight co-favorites with the USA to take a top-two spot in Group D.',
  },

  // ── GROUP E ────────────────────────────────────────────────────────────────
  'Germany': {
    rank: 10, coach: 'Julian Nagelsmann', nickname: 'Die Mannschaft',
    style: 'Possession-based control with aggressive counter-pressing under Nagelsmann; loaded with young creators.',
    keyPlayers: [
      { name: 'Jamal Musiala', pos: 'MF', note: 'Dribbling genius between the lines' },
      { name: 'Florian Wirtz', pos: 'MF', note: 'Elite creator and tempo-setter' },
      { name: 'Joshua Kimmich', pos: 'MF', note: 'Captain and midfield organizer' },
    ],
    strengths: ['World-class young attackers', 'Possession control', 'Quarterfinalists at Euro 2024'],
    weaknesses: ['Defensive fragility at times', 'Settled No.9', 'Recent tournament knockouts'],
    outlook: 'Clear Group E favorites (96% to advance) and dark-horse contenders.',
  },
  'Curaçao': {
    rank: 82, coach: 'Dick Advocaat', nickname: 'Blue Wave',
    style: 'Organized, pragmatic and compact — a defensive block springing forward through Dutch-schooled attackers.',
    keyPlayers: [
      { name: 'Leandro Bacuna', pos: 'MF', note: 'Versatile 34-yr-old captain; 2nd top scorer' },
      { name: 'Tahith Chong', pos: 'FW', note: 'Sheffield United winger, dribbling threat' },
      { name: 'Armando Obispo', pos: 'DF', note: 'PSV-schooled defensive anchor' },
      { name: 'Sontje Hansen', pos: 'FW', note: 'Middlesbrough forward, pace in transition' },
    ],
    strengths: ['Defensive organization', 'Deep pool of Dutch-developed pros', 'Nothing-to-lose freedom'],
    weaknesses: ['Smallest nation ever to qualify', 'No tournament pedigree', 'Managerial turmoil pre-tournament'],
    outlook: 'The tournament\'s great story; a single point would be historic.',
  },
  'Ivory Coast': {
    rank: 34, coach: 'Emerse Faé', nickname: 'Les Éléphants',
    style: '4-3-3 built on a compact midfield block and fast, technically gifted wide attackers.',
    keyPlayers: [
      { name: 'Yan Diomande', pos: 'FW', note: 'Electric 19-yr-old RB Leipzig winger' },
      { name: 'Simon Adingra', pos: 'FW', note: 'Pace and dribbling out wide' },
      { name: 'Franck Kessié', pos: 'MF', note: 'Powerful midfield driver' },
    ],
    strengths: ['Athletic, direct wide play', 'Reigning AFCON champions (2023)', 'Young attacking talent'],
    weaknesses: ['Goal threat through the middle', 'Defensive consistency', 'Tournament-football naivety'],
    outlook: 'In a tight fight with Ecuador for second behind Germany.',
  },
  'Ecuador': {
    rank: 23, coach: 'Sebastián Beccacece', nickname: 'La Tri',
    style: 'High-energy, technically disciplined team that presses hard and defends superbly.',
    keyPlayers: [
      { name: 'Moisés Caicedo', pos: 'MF', note: 'Chelsea engine; elite ball-winner' },
      { name: 'Willian Pacho', pos: 'DF', note: 'PSG centre-back, defensive rock' },
      { name: 'Piero Hincapié', pos: 'DF', note: 'Composed, aggressive defender' },
    ],
    strengths: ['Outstanding defensive core', 'Midfield steel in Caicedo', 'Conceded fewest in qualifying'],
    weaknesses: ['Goalscoring depth', 'Reliance on young spine', 'Final-third creativity'],
    outlook: 'Favored for second in Group E; a stingy defense makes them dangerous.',
  },

  // ── GROUP F ────────────────────────────────────────────────────────────────
  'Netherlands': {
    rank: 7, coach: 'Ronald Koeman', nickname: 'Oranje',
    style: 'Technically excellent and experienced, built on a strong defense and midfield control rather than firepower.',
    keyPlayers: [
      { name: 'Virgil van Dijk', pos: 'DF', note: 'Captain; world-class centre-back' },
      { name: 'Ryan Gravenberch', pos: 'MF', note: 'Liverpool anchor; shields and carries' },
      { name: 'Cody Gakpo', pos: 'FW', note: 'Versatile, goal-scoring forward' },
    ],
    strengths: ['Elite defense and midfield', 'Tournament experience', 'Unbeaten in qualifying (27 GF, 4 GA)'],
    weaknesses: ['Less attacking firepower than past sides', 'Three finals, no title', 'Striker question'],
    outlook: 'Favorites to top a balanced Group F.',
  },
  'Japan': {
    rank: 18, coach: 'Hajime Moriyasu', nickname: 'Samurai Blue',
    style: 'Fluid 3-4-2-1 with slick technical interplay and fearless pressing — beat England at Wembley in build-up.',
    keyPlayers: [
      { name: 'Takefusa Kubo', pos: 'MF', note: 'Real Sociedad dribbler; chaos in the final third' },
      { name: 'Wataru Endō', pos: 'MF', note: 'Liverpool midfield shield' },
      { name: 'Daizen Maeda', pos: 'FW', note: 'Relentless running and pressing' },
    ],
    strengths: ['Deep pool of Europe-based players', 'Cohesive system', 'Beat England & Scotland recently'],
    weaknesses: ['Can be exposed defensively', 'Finishing in big moments', 'Set-piece defending'],
    outlook: 'Strong contender for a top-two finish in Group F.',
  },
  'Sweden': {
    rank: 38, coach: 'Graham Potter', nickname: 'Blågult',
    style: 'Built around two elite strikers; pragmatic under new coach Graham Potter with goals from the front.',
    keyPlayers: [
      { name: 'Viktor Gyökeres', pos: 'FW', note: 'Lethal No.9; fired Sweden to the finals late' },
      { name: 'Alexander Isak', pos: 'FW', note: 'Elite movement and finishing' },
      { name: 'Anton Saletros', pos: 'MF', note: 'Midfield balance' },
    ],
    strengths: ['Two world-class strikers', 'Late-qualifying momentum', 'Genuine goal threat'],
    weaknesses: ['New coach (<6 months)', 'Midfield and defensive depth', 'Cohesion'],
    outlook: 'If the strikers click, capable of taking second; a final-day clash with Japan may decide it.',
  },
  'Tunisia': {
    rank: 44, coach: 'Sabri Lamouchi', nickname: 'Carthage Eagles',
    style: 'Compact, exceptionally well-drilled defensive block that frustrates and counters.',
    keyPlayers: [
      { name: 'Ellyes Skhiri', pos: 'MF', note: 'Controls midfield; Frankfurt regular' },
      { name: 'Hannibal Mejbri', pos: 'MF', note: 'Creative freedom in the final third' },
      { name: 'Aymen Dahmen', pos: 'GK', note: 'Reliable last line' },
    ],
    strengths: ['Best defensive record in African qualifying (9-1-0, 10 clean sheets)', 'Organization', 'Discipline'],
    weaknesses: ['Limited goal threat', 'Struggles to break down deep blocks', 'Final-third quality'],
    outlook: 'Tough to beat but light on goals; outsiders to escape a balanced group.',
  },

  // ── GROUP G ────────────────────────────────────────────────────────────────
  'Belgium': {
    rank: 9, coach: 'Rudi Garcia', nickname: 'Red Devils',
    style: 'Possession and creativity through a golden-generation core, likely making their last big run together.',
    keyPlayers: [
      { name: 'Kevin De Bruyne', pos: 'MF', note: 'Elite playmaker; arguably Belgium\'s greatest' },
      { name: 'Jérémy Doku', pos: 'FW', note: 'Explosive one-on-one winger' },
      { name: 'Romelu Lukaku', pos: 'FW', note: 'Powerful focal point and top scorer' },
    ],
    strengths: ['World-class creativity', 'Experience', 'Top-10 ranked attacking quality'],
    weaknesses: ['Aging core', 'Defensive frailty', 'History of underachieving'],
    outlook: 'Favorites to win Group G in a likely last dance for the golden generation.',
  },
  'Egypt': {
    rank: 29, coach: 'Hossam Hassan', nickname: 'The Pharaohs',
    style: 'Back-five low block designed to spring Salah and Marmoush on the counter.',
    keyPlayers: [
      { name: 'Mohamed Salah', pos: 'FW', note: 'Talisman; 2nd all-time Egypt scorer' },
      { name: 'Omar Marmoush', pos: 'FW', note: 'Pace and finishing alongside Salah' },
      { name: 'Mohamed Elneny', pos: 'MF', note: 'Experienced midfield organizer' },
    ],
    strengths: ['A genuine superstar in Salah', 'Counter-attacking threat', 'Defensive structure'],
    weaknesses: ['Over-reliance on Salah', 'Passive approach can invite pressure', 'Creativity beyond the front two'],
    outlook: 'Belgium\'s main challengers and likely to fight for second.',
  },
  'Iran': {
    rank: 21, coach: 'Amir Ghalenoei', nickname: 'Team Melli',
    style: 'Organized and counter-attacking, built on a solid block and two prolific strikers.',
    keyPlayers: [
      { name: 'Mehdi Taremi', pos: 'FW', note: 'Clinical finisher; qualifying top scorer (5)' },
      { name: 'Sardar Azmoun', pos: 'FW', note: 'Powerful, prolific strike partner' },
      { name: 'Alireza Jahanbakhsh', pos: 'FW', note: 'Experienced wide threat' },
    ],
    strengths: ['Two reliable goalscorers', 'Defensive organization', 'Tournament experience'],
    weaknesses: ['Keeping it solid at the back', 'Squad depth', 'Never past the group stage'],
    outlook: 'Around a two-in-three chance of reaching the knockouts.',
  },
  'New Zealand': {
    rank: 85, coach: 'Darren Bazeley', nickname: 'All Whites',
    style: 'Physical, set-piece-oriented and hard-working — defends deep and uses its aerial presence.',
    keyPlayers: [
      { name: 'Chris Wood', pos: 'FW', note: 'Star man; qualifying top scorer (9)' },
      { name: 'Marko Stamenic', pos: 'MF', note: 'Young midfield driver' },
      { name: 'Tyler Bindon', pos: 'DF', note: 'Promising centre-back' },
    ],
    strengths: ['Aerial and set-piece threat', 'Unbeaten OFC run', 'A proven Premier League scorer'],
    weaknesses: ['Lowest-ranked in the group', 'Limited quality in depth', 'Never past the group stage'],
    outlook: 'Hopes to spring a surprise but faces an uphill task.',
  },

  // ── GROUP H ────────────────────────────────────────────────────────────────
  'Spain': {
    rank: 2, coach: 'Luis de la Fuente', nickname: 'La Roja',
    style: 'The complete modern side — suffocating possession, a brilliant midfield and a generational winger.',
    keyPlayers: [
      { name: 'Lamine Yamal', pos: 'FW', note: 'Generational talent; Euro 2024 winner at 18' },
      { name: 'Rodri', pos: 'MF', note: 'Ballon d\'Or-level midfield controller' },
      { name: 'Pedri', pos: 'MF', note: 'Press-resistant midfield brain' },
    ],
    strengths: ['Best midfield in the world', 'Reigning European champions', 'Highest qualifying odds of any team (98.5%)'],
    weaknesses: ['Reliable No.9', 'Youthful inexperience in moments', 'Target on their back'],
    outlook: 'Top-ranked and among the very favorites to win the whole thing.',
  },
  'Cape Verde': {
    rank: 69, coach: 'Bubista', nickname: 'Blue Sharks',
    style: 'Counter-attacking and well-organized; punches massively above its weight for a nation of ~525,000.',
    keyPlayers: [
      { name: 'Dailon Livramento', pos: 'FW', note: 'Match-winner; scored solo goal to beat Cameroon' },
      { name: 'Ryan Mendes', pos: 'FW', note: 'Experienced captain and creator' },
      { name: 'Roberto Lopes', pos: 'DF', note: 'Defensive leader (Shamrock Rovers)' },
    ],
    strengths: ['Fearless underdog spirit', 'Counter-attacking threat', 'Beat Cameroon to qualify'],
    weaknesses: ['Tiny player pool', 'No tournament pedigree', 'Quality gap vs elite'],
    outlook: 'World Cup debutants from a nation of half a million; aiming to compete and shock.',
  },
  'Saudi Arabia': {
    rank: 61, coach: 'Hervé Renard', nickname: 'The Green Falcons',
    style: 'Aggressive pressing side that can trouble big teams when it clicks — but leaves space behind when it doesn\'t.',
    keyPlayers: [
      { name: 'Salem Al-Dawsari', pos: 'FW', note: 'Captain; scored the 2022 winner vs Argentina' },
      { name: 'Firas Al-Buraikan', pos: 'FW', note: 'Mobile central striker' },
      { name: 'Saud Abdulhamid', pos: 'DF', note: 'Trailblazing right-back (first Saudi in Serie A)' },
    ],
    strengths: ['History of shocking giants (beat Argentina 2022)', 'High press', 'Settled core'],
    weaknesses: ['Space in behind when the press fails', 'Goal threat', 'Defensive depth'],
    outlook: 'Capable of an upset but an outsider to advance from a tough group.',
  },
  'Uruguay': {
    rank: 17, coach: 'Marcelo Bielsa', nickname: 'La Celeste',
    style: 'Intense, aggressive Bielsa pressing — forces more high turnovers than any other CONMEBOL side.',
    keyPlayers: [
      { name: 'Federico Valverde', pos: 'MF', note: 'All-action Real Madrid engine' },
      { name: 'Darwin Núñez', pos: 'FW', note: 'Relentless, direct centre-forward' },
      { name: 'Ronald Araújo', pos: 'DF', note: 'Powerful Barcelona defender' },
    ],
    strengths: ['Elite midfield and defense', 'Bielsa\'s relentless press (147 high turnovers in qualifying)', 'Big-game talent'],
    weaknesses: ['Finishing consistency', 'Bielsa\'s demanding system can tire legs', 'Discipline'],
    outlook: 'Strongly favored to join Spain in the knockouts and a dark horse to go deep.',
  },

  // ── GROUP I ────────────────────────────────────────────────────────────────
  'France': {
    rank: 1, coach: 'Didier Deschamps', nickname: 'Les Bleus',
    style: 'Pragmatic, ruthlessly efficient and absurdly deep — controls games and kills them with elite individuals.',
    keyPlayers: [
      { name: 'Kylian Mbappé', pos: 'FW', note: 'Captain and superstar; pace and goals' },
      { name: 'Aurélien Tchouaméni', pos: 'MF', note: 'Defensive midfield anchor' },
      { name: 'Ousmane Dembélé', pos: 'FW', note: 'Explosive wide threat' },
    ],
    strengths: ['Top-ranked side; tournament pedigree', 'Unmatched squad depth', 'Elite match-winners everywhere'],
    weaknesses: ['Occasional flat spells', 'Deschamps\' caution', 'Pressure as favorites'],
    outlook: 'Among the clear favorites to win it all in Deschamps\' farewell tournament.',
  },
  'Senegal': {
    rank: 14, coach: 'Pape Thiaw', nickname: 'Lions of Teranga',
    style: 'Powerful, athletic and compact — defensive intensity and transition power through an elite midfield.',
    keyPlayers: [
      { name: 'Nicolas Jackson', pos: 'FW', note: 'Pace and movement up top' },
      { name: 'Pape Matar Sarr', pos: 'MF', note: 'Energetic box-to-box midfielder' },
      { name: 'Kalidou Koulibaly', pos: 'DF', note: 'Defensive leader and organizer' },
    ],
    strengths: ['Physical, athletic spine', 'Compact structure and transition power', '2022 AFCON champions'],
    weaknesses: ['Creativity in tight games', 'Settled No.9', 'Converting dominance to goals'],
    outlook: 'Highest-ranked African side; in a straight fight with Norway for second.',
  },
  'Iraq': {
    rank: 57, coach: 'Graham Arnold', nickname: 'Lions of Mesopotamia',
    style: 'Pragmatic and disciplined — compact defending, controlled risk and opportunistic attacking.',
    keyPlayers: [
      { name: 'Aymen Hussein', pos: 'FW', note: 'Physical focal point and goal threat' },
      { name: 'Zidane Iqbal', pos: 'MF', note: 'Technical midfield creator' },
      { name: 'Jalal Hassan', pos: 'GK', note: 'Reliable last line' },
    ],
    strengths: ['Defensive organization and discipline', 'Emotional motivation (first WC since 1986)', 'Resilience'],
    weaknesses: ['Limited possession quality', 'Goal threat', 'Gulf in class vs France'],
    outlook: 'Back after 40 years; widely tipped to finish bottom but will be hard to break down.',
  },
  'Norway': {
    rank: 31, coach: 'Ståle Solbakken', nickname: '',
    style: 'Direct and vertical — get the ball to a world-class striker fast, with Ødegaard controlling tempo.',
    keyPlayers: [
      { name: 'Erling Haaland', pos: 'FW', note: 'All-time top scorer (55); blazing pace and finishing' },
      { name: 'Martin Ødegaard', pos: 'MF', note: 'Creative engine; the vital link to Haaland' },
      { name: 'Antonio Nusa', pos: 'FW', note: 'Direct young wide threat' },
      { name: 'Alexander Sørloth', pos: 'FW', note: 'Powerful second striker' },
    ],
    strengths: ['Elite match-winners in the spine', 'Perfect qualifying (8-0-0, 37 GF)', 'Goal threat vs anyone'],
    weaknesses: ['Heavy reliance on two stars', 'Unproven depth', 'Can be exposed by elite sides'],
    outlook: 'Dark horse back after 28 years; nobody wants to face Haaland.',
  },

  // ── GROUP J ────────────────────────────────────────────────────────────────
  'Argentina': {
    rank: 3, coach: 'Lionel Scaloni', nickname: 'La Albiceleste',
    style: 'Fluid 4-3-3/4-4-2 hybrid — collective pressing, rapid transitions, controls tempo or counters ruthlessly.',
    keyPlayers: [
      { name: 'Lionel Messi', pos: 'FW', note: 'Talisman; vision and clutch delivery in a record 6th WC' },
      { name: 'Lautaro Martínez', pos: 'FW', note: '2024 Copa América top scorer' },
      { name: 'Alexis Mac Allister', pos: 'MF', note: 'Recovery and creativity in midfield' },
      { name: 'Emiliano Martínez', pos: 'GK', note: 'Decisive big-game shot-stopper' },
    ],
    strengths: ['Most tactically disciplined side in the field', 'Elite talent across every line', 'Exceptional chemistry'],
    weaknesses: ['Messi\'s age', 'Centre-back depth', 'Weight of defending the title'],
    outlook: 'Defending champions and co-favorites; tournament know-how is unmatched.',
  },
  'Algeria': {
    rank: 28, coach: 'Vladimir Petković', nickname: 'Les Fennecs (Desert Foxes)',
    style: 'Technically gifted and attack-minded, built around quick, creative forwards.',
    keyPlayers: [
      { name: 'Mohammed Amoura', pos: 'FW', note: 'Top scorer in CAF qualifying (10 in 10)' },
      { name: 'Riyad Mahrez', pos: 'FW', note: 'Experienced match-winner out wide' },
      { name: 'Ismaël Bennacer', pos: 'MF', note: 'Tempo-setting midfielder' },
    ],
    strengths: ['Attacking flair and pace', 'Best-ever qualifying (8 wins)', 'Big-game experience in Mahrez'],
    weaknesses: ['Defensive consistency', 'Failed to escape the group in 2014/last appearance', 'Balance'],
    outlook: 'Best-placed to chase second behind Argentina in Group J.',
  },
  'Austria': {
    rank: 24, coach: 'Ralf Rangnick', nickname: 'Das Team',
    style: 'Rangnick\'s relentless, aggressive pressing system — built specifically for tournament football.',
    keyPlayers: [
      { name: 'David Alaba', pos: 'DF', note: 'Captain and defensive leader; 113+ caps' },
      { name: 'Marko Arnautović', pos: 'FW', note: 'All-time top scorer (47)' },
      { name: 'Konrad Laimer', pos: 'MF', note: 'Energetic pressing midfielder' },
    ],
    strengths: ['Cohesive, intense pressing identity', 'Elite coach', 'Built for tournament demands'],
    weaknesses: ['Aging key players', 'Goal threat depth', 'Stamina across a long tournament'],
    outlook: 'Second favorites in Group J (67% to advance) behind Argentina.',
  },
  'Jordan': {
    rank: 63, coach: 'Jamal Sellami', nickname: 'Al-Nashama',
    style: 'Well-organized and counter-attacking — defensively disciplined with a real threat on the break.',
    keyPlayers: [
      { name: 'Musa Al-Tamari', pos: 'FW', note: 'Counter-attacking spark; the danger man' },
      { name: 'Yazan Al-Naimat', pos: 'FW', note: 'Mobile striker' },
      { name: 'Nour Al-Rawabdeh', pos: 'MF', note: 'Midfield runner' },
    ],
    strengths: ['Defensive organization', 'Counter-attack through Al-Tamari', 'Underdog freedom'],
    weaknesses: ['Lowest-ranked in the group', 'WC debutants', 'Quality gap vs Argentina/Austria'],
    outlook: 'First World Cup; will defend deep and look to spring a surprise.',
  },

  // ── GROUP K ────────────────────────────────────────────────────────────────
  'Portugal': {
    rank: 5, coach: 'Roberto Martínez', nickname: 'A Seleção das Quinas',
    style: 'Talent-laden possession side with elite creativity and depth across every position.',
    keyPlayers: [
      { name: 'Bruno Fernandes', pos: 'MF', note: 'Captain; one of the PL\'s top chance creators' },
      { name: 'Cristiano Ronaldo', pos: 'FW', note: 'All-time great chasing a final WC' },
      { name: 'Vitinha', pos: 'MF', note: 'PSG midfield controller' },
    ],
    strengths: ['Outstanding squad depth', 'Elite creativity', 'Won the 2025 Nations League'],
    weaknesses: ['Balancing veterans and youth', 'Defensive lapses', 'Knockout scar tissue'],
    outlook: 'Clear Group K favorites and genuine contenders to win it all.',
  },
  'DR Congo': {
    rank: 46, coach: 'Sébastien Desabre', nickname: 'Léopards',
    style: 'Aggressive high press that wins the ball in dangerous areas and attacks with pace.',
    keyPlayers: [
      { name: 'Yoane Wissa', pos: 'FW', note: 'Premier League-caliber forward (Newcastle)' },
      { name: 'Chancel Mbemba', pos: 'DF', note: 'Captain and defensive anchor' },
      { name: 'Cédric Bakambu', pos: 'FW', note: 'Experienced goalscorer' },
    ],
    strengths: ['High, aggressive press', 'Pace in attack', 'Physicality'],
    weaknesses: ['Defensive discipline when stretched', 'Tournament inexperience (first since 1974)', 'Consistency'],
    outlook: 'Outsiders in Group K but capable of troubling Colombia for second.',
  },
  'Uzbekistan': {
    rank: 50, coach: 'Fabio Cannavaro', nickname: 'White Wolves',
    style: 'Organized 3-4-2-1 under Cannavaro — defensive discipline, structured transitions, focal-point striker.',
    keyPlayers: [
      { name: 'Eldor Shomurodov', pos: 'FW', note: 'Captain and all-time top scorer (44)' },
      { name: 'Abdukodir Khusanov', pos: 'DF', note: 'Exciting Man City defender at 22' },
      { name: 'Jaloliddin Masharipov', pos: 'MF', note: 'Creative attacking midfielder' },
    ],
    strengths: ['Defensive organization', 'A World Cup-winning coach', 'A proven goalscorer up top'],
    weaknesses: ['First WC — total inexperience', 'Squad depth', 'Final-third quality'],
    outlook: 'World Cup debutants; a knockout place would be a major achievement.',
  },
  'Colombia': {
    rank: 13, coach: 'Néstor Lorenzo', nickname: 'Los Cafeteros',
    style: 'Technical, creative and balanced — controls games through midfield with dangerous wide forwards.',
    keyPlayers: [
      { name: 'Luis Díaz', pos: 'FW', note: 'Dynamic winger; 7 goals in CONMEBOL qualifying' },
      { name: 'James Rodríguez', pos: 'MF', note: 'Captain and chief creator; led qualifying assists (7)' },
      { name: 'Jhon Lucumí', pos: 'DF', note: 'Composed centre-back' },
    ],
    strengths: ['Excellent creativity and balance', 'Match-winners in Díaz and James', 'Strong qualifying campaign'],
    weaknesses: ['Reliance on James\' form/fitness', 'Defensive depth', 'Killer instinct'],
    outlook: 'Strong favorites for second behind Portugal and a dark horse to go further.',
  },

  // ── GROUP L ────────────────────────────────────────────────────────────────
  'England': {
    rank: 4, coach: 'Thomas Tuchel', nickname: 'Three Lions',
    style: 'Defensively elite and pragmatic under Tuchel — built on a watertight base and world-class attackers.',
    keyPlayers: [
      { name: 'Harry Kane', pos: 'FW', note: 'All-time top scorer (78); Ballon d\'Or contender' },
      { name: 'Jude Bellingham', pos: 'MF', note: 'Driving, goal-scoring midfielder' },
      { name: 'Bukayo Saka', pos: 'FW', note: 'Direct, productive wide threat' },
    ],
    strengths: ['Best defensive record in European qualifying (9 clean sheets)', 'Elite attacking talent', 'Squad depth'],
    weaknesses: ['Tournament knockout history', 'Midfield balance', 'Pressure to end 60-year wait'],
    outlook: 'Among the favorites; 3rd most likely of any team to top their group.',
  },
  'Croatia': {
    rank: 11, coach: 'Zlatko Dalić', nickname: 'Vatreni (Blazers)',
    style: 'Midfield-dominant and game-smart — controls tempo and grinds out deep tournament runs.',
    keyPlayers: [
      { name: 'Luka Modrić', pos: 'MF', note: 'Greatest-ever Croatian; nears 200 caps' },
      { name: 'Joško Gvardiol', pos: 'DF', note: 'Man City defender; back-line anchor' },
      { name: 'Mateo Kovačić', pos: 'MF', note: 'Press-resistant midfield partner' },
    ],
    strengths: ['Elite midfield control', 'Serial tournament over-performers (2018 finalists, 2022 3rd)', 'Game management'],
    weaknesses: ['Aging core', 'Lack of a prolific striker', 'Legs over a long tournament'],
    outlook: 'Strongly favored to reach the knockouts again from Group L.',
  },
  'Ghana': {
    rank: 74, coach: 'Otto Addo', nickname: 'Black Stars',
    style: 'Athletic and direct, with pace on the break and a mix of physicality and flair.',
    keyPlayers: [
      { name: 'Antoine Semenyo', pos: 'FW', note: 'In-form forward; 21 G/6 A across clubs this season' },
      { name: 'Mohammed Kudus', pos: 'MF', note: 'Dynamic dribbler and creator' },
      { name: 'Jordan Ayew', pos: 'FW', note: 'Captain and experienced leader (118 caps)' },
    ],
    strengths: ['Pace and directness', 'In-form attacking talent', 'A reaching-knockouts pedigree (2010 QF)'],
    weaknesses: ['Defensive reliability', 'Consistency', 'Lowest-ranked of the contenders here'],
    outlook: 'Underdogs in Group L but with the attacking talent to spring a surprise.',
  },
  'Panama': {
    rank: 33, coach: 'Thomas Christiansen', nickname: 'La Marea Roja',
    style: 'Energetic, high-pressing 3-4-3 that leads its region in turnovers and pressed sequences.',
    keyPlayers: [
      { name: 'Adalberto Carrasquilla', pos: 'MF', note: 'Midfield engine and creator' },
      { name: 'José Fajardo', pos: 'FW', note: 'Mobile central striker' },
      { name: 'César Blackman', pos: 'DF', note: 'Energetic wing-back' },
    ],
    strengths: ['High press (led region in turnovers)', 'Risen from 81st to 33rd in six years', 'Cohesive system'],
    weaknesses: ['Limited elite individual quality', 'Goal threat vs top defenses', 'WC inexperience'],
    outlook: 'A well-drilled, fast-rising side aiming to shock the group\'s big two.',
  },

};

// ── Section icons ────────────────────────────────────────────────────────────
// Monochrome inline SVGs (24×24, stroke = currentColor) so they inherit the
// section's text color and theme automatically. Size them via CSS (width/height).
const DOSSIER_ICONS = {
  // Style of play → top-down football pitch
  style: `<svg class="dsec-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="1.5"/><line x1="12" y1="5" x2="12" y2="19"/><circle cx="12" cy="12" r="2.5"/></svg>`,
  // Key players → star
  players: `<svg class="dsec-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12,3 14.3,8.7 20.5,9.2 15.8,13.2 17.3,19.2 12,15.9 6.7,19.2 8.2,13.2 3.5,9.2 9.7,8.7"/></svg>`,
  // Strengths → check inside circle
  strengths: `<svg class="dsec-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><polyline points="8 12.5 11 15.5 16.5 9"/></svg>`,
  // Weaknesses → alert triangle
  weaknesses: `<svg class="dsec-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4.5 L20.5 19 H3.5 Z"/><line x1="12" y1="10" x2="12" y2="13.5"/><line x1="12" y1="16.5" x2="12" y2="16.6"/></svg>`,
  // Outlook → eye (looking ahead)
  outlook: `<svg class="dsec-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 12 C6 6.5 18 6.5 21.5 12 C18 17.5 6 17.5 2.5 12 Z"/><circle cx="12" cy="12" r="3"/></svg>`,
};

// Expose for the main client script (classic scripts share global lexical scope,
// but attach to window too for safety / console debugging).
if (typeof window !== 'undefined') {
  window.TEAM_DOSSIER = TEAM_DOSSIER;
  window.DOSSIER_ICONS = DOSSIER_ICONS;
}
