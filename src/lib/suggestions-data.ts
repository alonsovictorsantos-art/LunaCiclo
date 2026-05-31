/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from './i18n';

export interface MealPlan {
  breakfast: string;
  lunch: string;
  snack: string;
  dinner: string;
}

export interface PhaseSuggestion {
  focusName: string;
  details: string;
  checklist: string[];
  recipeTitle: string;
  recipeDesc: string;
  recipePrep: string[];
  trainingFocus: string;
  trainingDetails: string;
  trainingChecklist: string[];
  timerDurationSeconds: number;
  timerExercises: string[];
  meals: MealPlan;
}

export type PhaseType = 'Menstrual' | 'Folliculary' | 'Ovulatory' | 'Luteal';

export const suggestionsData: Record<Language, Record<PhaseType, PhaseSuggestion>> = {
  pt: {
    Menstrual: {
      focusName: "Alimentos Ricos em Ferro & Calmantes",
      details: "Nesta fase, os níveis de progesterona e estrogénio descem. Concentre-se em repor o ferro e hidratar o corpo com chás anti-inflamatórios para reduzir cãibras e cãibras pálidas.",
      checklist: [
        "Infusão de Hortelã ou Gengibre",
        "Chocolate Negro (70%+ cacau - rico em magnésio)",
        "Vegetais de folha escura (espinafres)",
        "Proteínas limpas e fáceis de digerir"
      ],
      recipeTitle: "Chá de Gengibre & Cacau Reconfortante",
      recipeDesc: "Uma bebida quente anti-inflamatória que alivia dores pélvicas e revigora com antioxidantes essenciais.",
      recipePrep: [
        "Ferva 250ml de água com fatias de gengibre fresco por 5 minutos.",
        "Adicione 1 colher de sopa de cacau puro em pó e mexa bem.",
        "Adoce com mel biológico de boa qualidade a gosto.",
        "Beba morno antes de deitar ou em momentos de desconforto de cãibras."
      ],
      trainingFocus: "Alongamento Suave & Mobilidade",
      trainingDetails: "Privilegie o descanso e a recuperação active. Movimentos de baixa intensidade ajudam a aliviar a congestão pélvica sem sobrecarregar o organismo ou elevar o cortisol.",
      trainingChecklist: [
        "Pose de Criança (Balasana) para descompressão lombar",
        "Torções espinhais suaves deitada",
        "Caminhada lenta ao ar livre para oxigenação"
      ],
      timerDurationSeconds: 300,
      timerExercises: [
        "Pose de Criança (Balasana) - 60s",
        "Alongamento do Gato-Vaca (Cat-Cow) - 60s",
        "Torção Espinhal Deitada - 60s (30s de cada lado)",
        "Pinte de Quadril Suave - 60s",
        "Respiração Diafragmática Consciente - 60s"
      ],
      meals: {
        breakfast: "Papas de aveia quentes feitas com bebida vegetal, sementes de abóbora moídas, rodelas de banana e pitada generosa de canela.",
        lunch: "Tiras de peito de frango grelhado ou tofu temperado com ervas, espinafres salteados em alho e azeite com sementes de sésamo escuro, acompanhado de arroz integral vaporizado.",
        snack: "Uma chávena de infusão de hortelã-pimenta morna acompanhada de 3 quadrados de chocolate preto (70% cacau) e 5 amêndoas cruas.",
        dinner: "Salmão selvagem grelhado em crosta de ervas ou sopa rica em lentilhas vermelhas, servido com puré cremoso de batata-doce e brócolos ao vapor aromatizados com limão."
      }
    },
    Folliculary: {
      focusName: "Estrogénio Fluido & Vitalidade Ativa",
      details: "O estrogénio está a subir gradualmente, o que ajuda na energia e humor. Adicione gorduras saudáveis e carboidratos complexos para sustentar a construção saudável do folículo.",
      checklist: [
        "Meio abacate (rico em gordura insaturada)",
        "Pimentos, brócolos e alimentos ricos em Vitamina C",
        "Grãos integrais (Quinoa ou Arroz integral)",
        "Sementes de Linhaça ou Cânhamo"
      ],
      recipeTitle: "Salada de Quinoa e Abacate Vitalidade",
      recipeDesc: "Salada rica em fibras e gorduras essenciais para apoiar o fígado a filtrar e metabolizar os estrogénios saudáveis.",
      recipePrep: [
        "Misture 1 chávena de quinoa cozida com meio abacate aos cubos.",
        "Adicione tomate cherry fatiado, pepino e sementes de abóbora tostadas.",
        "Tempere com sumo de limão fresco e uma colher de azeite extra virgem."
      ],
      trainingFocus: "Força Muscular & HIIT Dinâmico",
      trainingDetails: "A sua energia e tolerância à fadiga estão em franca ascensão. Excelente fase para treinos desafiantes, ganho muscular com pesos livres e circuitos metabólicos.",
      trainingChecklist: [
        "Agachamentos com halteres ou agachamento clássico",
        "Prancha ativa com toques no ombro",
        "Circuito aeróbico ou HIIT moderado"
      ],
      timerDurationSeconds: 480,
      timerExercises: [
        "Agachamentos Livres Controlled - 60s",
        "Prancha com Toques no Ombro - 60s",
        "Polichinelos (Jumping Jacks) - 60s",
        "Flexões de Joelho - 60s",
        "Descanso Ativo e Alongamento - 60s",
        "Repetição do Circuito HIIT - 120s"
      ],
      meals: {
        breakfast: "Taça de iogurte grego natural ou iogurte de coco, com 1 colher de sementes de linhaça moídas, mirtilos biológicos frescos e granola artesanal sem açúcar.",
        lunch: "Salada energética de quinoa real com cubos de abacate maduro, peito de peru ou grão-de-bico, tomate-cereja cortado ao meio, pepino e vinagrete de limão.",
        snack: "Hummus de grão-de-bico com palitos crocantes de cenoura, pepino e azeite extra virgem de oliva.",
        dinner: "Filete de pescada ao forno com ervas finas, brócolos cozidos ao vapor leves e batata-doce cozida temperada com um fio de azeite."
      }
    },
    Ovulatory: {
      focusName: "Desintoxicação Saudável & Fitoquímicos",
      details: "Este é o pico do ciclo (ovulação). A sua digestão está excelente e o seu corpo precisa de suporte antioxidante para metabolizar a libertação rápida de hormonas do fígado.",
      checklist: [
        "Frutos vermelhos frescos (mirtilos, morangos)",
        "Vegetais crucíferos (brócolos cozidos ao vapor)",
        "Amêndoas torradas e Sementes de Sésamo",
        "Aumento da meta de hidratação (+500ml)"
      ],
      recipeTitle: "Batido Verde Antioxidante do Ciclo",
      recipeDesc: "Um banho fitoquímico ultra-rico em antioxidantes e fibras que promovem a digestão ideal e o equilíbrio do pico de estrogénio.",
      recipePrep: [
        "Adicione no liquidificador 1 chávena de espinafres crus bien limpos.",
        "Adicione 1 banana pequena madura congelada e meia chávena de mirtilos.",
        "Coloque 1 colher de sementes de chia e 200ml de água de coco natural.",
        "Bata até ficar cremoso e consuma logo de manhã."
      ],
      trainingFocus: "Potência Total & Cardio de Explosão",
      trainingDetails: "Pico de força e autoconfiança devido aos picos de testosterona e estrogénio. Cuidado apenas com ligamentos e tendões, que podem estar sob efeito relaxante do estrogénio.",
      trainingChecklist: [
        "Sprints curtos ou corrida de intensidade",
        "Treino de musculação de carga com menos repetições",
        "Saltos pliométricos ou burpees"
      ],
      timerDurationSeconds: 600,
      timerExercises: [
        "Burpees com Salto Explodido - 45s",
        "Agachamentos com Salto - 45s",
        "Mountain Climbers em Velocidade - 45s",
        "Flexões Explosivas - 45s",
        "Descanso Recuperativo Completo - 45s",
        "Repetir Sequência com Foco Ideal - 270s"
      ],
      meals: {
        breakfast: "Batido Verde Luminous ultra-antioxidante batido com espinafres, 1 banana pequena congelada, colher de sementes de chia hidratadas, mirtilos e água de coco fresca.",
        lunch: "Saladeira com mix de folhas escuras, salmão selvagem na chapa ou grãos de edamame, ramos de brócolos ao vapor com amêndoas tostadas e molho de tahini.",
        snack: "Fatias de maçã verde refrescante aromatizadas com canela em pó e uma colher de sopa de manteiga de amêndoas 100% pura.",
        dinner: "Omelete leve de claras aromatizada com coentros ou tofu mexido com espargos verdes e quinoa fofa."
      }
    },
    Luteal: {
      focusName: "Estabilização Glicémica & Progesterona",
      details: "A progesterona reina e exige açúcar no sangue super estável. Suba no magnésio, potássio e complexos de digestão lenta para evitar picos de insulina, desejos de doces e TPM.",
      checklist: [
        "Batata-doce assada ou inhame",
        "Sementes de Girassol (excelente para a progesterona)",
        "Chá da casca de Cacau ou Erva-Doce",
        "Bananas para reposição rápida de B6"
      ],
      recipeTitle: "Fatias de Batata-Doce Forno com Canela",
      recipeDesc: "Satisfaz o desejo de doces de forma inteligente, estabilizando e relaxando o sistema digestivo.",
      recipePrep: [
        "Corte meia batata-doce média em fatias finas uniformes.",
        "Pincele com óleo de coco e polvilhe abundantemente com canela em pó.",
        "Asse na Airfryer ou forno a 180°C por 15-20 minutos até dourar.",
        "Polvilhe sementes de girassol por cima antes de consumir."
      ],
      trainingFocus: "Pilates de Resistência ou Ioga Vinyasa",
      trainingDetails: "O seu metabolismo acelera ligeiramente, no entanto a tolerância muscular ao ácido lático decai. Concentre-se em resistência de core e pilates controlado de postura.",
      trainingChecklist: [
        "Prancha estática focando em contração e respiração",
        "Exercícios de pilates no tapete (extensões traseiras)",
        "Natação recreativa ou caminhada rápida regeneradora"
      ],
      timerDurationSeconds: 420,
      timerExercises: [
        "Pilates Roll-Up Controlado - 60s",
        "Elevação de Quadril Unilateral - 60s (30s cada perna)",
        "Prancha Abdominal Isométrica - 60s",
        "Extensões Lombares Superwoman - 60s",
        "Alongamento Profundo de Glúteos - 60s",
        "Respiração Coerente Calmante - 120s"
      ],
      meals: {
        breakfast: "Panquecas rústicas de aveia e banana adoçadas com canela, povilhada com um punhado rico de sementes de girassol e raspas finas de cacau.",
        lunch: "Hambúrguer caseiro de grão-de-bico ou feijão preto ou frango grelhado, acompanhado de fatias de abóbora assada na canela e batata-doce crocante ao forno com couve-galega salteada leve.",
        snack: "Compota cozida de maçã ou pera morna com canela pura e um punhado de sementes de abóbora nutritivas.",
        dinner: "Sopa creme reconfortante de abóbora e um leve toque de gengibre, servida com peito de frango bio desfiado e uma colher de quinoa real."
      }
    }
  },
  en: {
    Menstrual: {
      focusName: "Iron-Rich & Soothing Comfort Foods",
      details: "During this phase, progesterone and estrogen levels drop. Focus on replenishing iron reserves and hydrating your system with anti-inflammatory herbal teas to combat cramping.",
      checklist: [
        "Peppermint or Ginger Infusion",
        "Dark Chocolate (70%+ cacao for magnesium)",
        "Dark leafy greens (spinach, kale)",
        "Clean, easily digestible protein"
      ],
      recipeTitle: "Warm Ginger & Chocolate Brew",
      recipeDesc: "An anti-inflammatory hot beverage designed to ease uterine muscle contractions and deliver antioxidants.",
      recipePrep: [
        "Boil 250ml water with fresh ginger slices for 5 minutes.",
        "Whisk in 1 tbsp of pure organic cacao powder.",
        "Sweeten with raw honey to taste.",
        "Drink warm before sleep or whenever cramps are intense."
      ],
      trainingFocus: "Gentle Stretching & Mobility",
      trainingDetails: "Prioritize rest and active recovery. Light physical motion promotes pelvis relaxation and relief of lumbar congestion without overworking your system or spiking cortisol.",
      trainingChecklist: [
        "Child's pose (Balasana) for lower-back relief",
        "Supine gentle spinal twists",
        "Slow outdoor walk to oxygenate your mind"
      ],
      timerDurationSeconds: 300,
      timerExercises: [
        "Child's Pose (Balasana) - 60s",
        "Cat-Cow Flow - 60s",
        "Supine Spinal Twist - 60s (30s each side)",
        "Gentle Hip Bridge - 60s",
        "Conscious Diaphragmatic Breath - 60s"
      ],
      meals: {
        breakfast: "Warm steel-cut oats porridge cooked in almond milk, customized with organic pumpkin seeds, fresh sliced banana, and a pinch of cinnamon.",
        lunch: "Tender grilled skinless chicken thighs or lemon-marinated tofu served over brown basmati rice with garlic-sautéed spinach.",
        snack: "Relaxing mug of warm peppermint tea served with 3 squares of organic dark chocolate (70%+) and 5 raw almonds.",
        dinner: "Herb-baked wild salmon or a warm lentil stew accompanied by dynamic sweet potato mash and lightly steamed hand-cut broccoli."
      }
    },
    Folliculary: {
      focusName: "Estrogen Support & Active Vitality",
      details: "Estrogen is gradually climbing, boosting your energy and focus. Introduce healthy fats and complex carbs to nourish the building of the follicle.",
      checklist: [
        "Half an avocado (rich in healthy monounsaturated fat)",
        "Bell peppers and Vit-C rich foods",
        "Whole grains (Quinoa, Wild rice)",
        "Flaxseeds or Pumpkin seeds"
      ],
      recipeTitle: "Vitality Quinoa & Avocado Salad",
      recipeDesc: "High-fiber, essential-fat salad designed to naturally aid liver filtration as hormone levels rise.",
      recipePrep: [
        "Mix 1 cup cooked quinoa with half cubed avocado.",
        "Toss in cherry tomatoes, seedless cucumbers, and toasted pumpkin seeds.",
        "Dress with fresh lemon juice and cold-pressed olive oil."
      ],
      trainingFocus: "Strength Workouts & Lively HIIT",
      trainingDetails: "Your physical endurance and recovery capacity are high. This is an optimal phase for lifting weights, challenging bodyweight circuits, and metabolic challenges.",
      trainingChecklist: [
        "Classic barbell or dumbbell squats",
        "Shoulder-tap active plank",
        "Moderate aerobic cardio circuit"
      ],
      timerDurationSeconds: 480,
      timerExercises: [
        "Controlled Bodyweight Squats - 60s",
        "Plank with Shoulder Taps - 60s",
        "Active Jumping Jacks - 60s",
        "Knee Push-Ups - 60s",
        "Active Rest & Quad Stretch - 60s",
        "HIIT Round Repeat - 120s"
      ],
      meals: {
        breakfast: "Organic coconut or Greek yogurt bowl topped with freshly milled organic flaxseeds, hand-picked wild blueberries, and raw fiber-rich granola.",
        lunch: "Bright quinoa salad combined with diced avocado, grilled chicken strips or loaded chickpeas, baby tomatoes, organic cucumber slices, and lemon juice dressing.",
        snack: "Crispy carrot and cucumber stick dip accompanied by 2 generous tablespoons of creamy house-made chickpeas hummus.",
        dinner: "Oven-baked tender cod fillet with a dash of fine herbs, served over steamed organic sweet potato and fresh, peppery leafy arugula."
      }
    },
    Ovulatory: {
      focusName: "Antioxidant Rich Foods & Hormonal Clearance",
      details: "Hormones reach peak thresholds. Your stomach and bowel are highly tolerant. Load up on antioxidants to help liver detox and hormonal metabolism.",
      checklist: [
        "Fresh berries (blueberries, raspberries)",
        "Cruciferous greens (steamed broccoli)",
        "Roasted almonds and Sesame seeds",
        "Hydration booster (extra +500ml of mineral water)"
      ],
      recipeTitle: "Luminous Ovulation Green Smoothie",
      recipeDesc: "An immediate dose of dietary fiber, minerals, and enzymes aiding smooth digestion and peak-hormone clearance.",
      recipePrep: [
        "Blend 1 cup raw fresh, thoroughly washed baby spinach.",
        "Add 1 frozen ripe banana, half cup blueberries and natural coconut water.",
        "Mix in 1 tbsp of ground flaxseed.",
        "Serve immediate."
      ],
      trainingFocus: "Maximum Output & Explosive Cardio",
      trainingDetails: "Enjoy maximum strength and natural focus due to peak testosterone and estrogen levels. Be mindful of tendons and knee joints, as estrogen can temporarily increase joint laxity.",
      trainingChecklist: [
        "High-paced runs, sprints, or rowing",
        "Low-rep, heavier weight strength session",
        "High-energy plyometrics like tuck jumps"
      ],
      timerDurationSeconds: 600,
      timerExercises: [
        "Explosive Jump Burpees - 45s",
        "Squat Jumps - 45s",
        "Rapid Mountain Climbers - 45s",
        "Powerful Push-ups - 45s",
        "Complete Recovery Rest - 45s",
        "Circuit Round Repeat - 270s"
      ],
      meals: {
        breakfast: "Our iconic Luminous Green Smoothie made of baby spinach, frozen banana, chia seeds, wild berries and refreshing organic coconut water.",
        lunch: "Rich dark leafy greens salad bowl filled with pan-seared salmon or fresh edamame, broccoli florets, and raw sliced almonds with a tahini dressing.",
        snack: "Sweet green apple slices dusted with organic Ceylon cinnamon and 1 tablespoon of 100% natural, smooth almond butter.",
        dinner: "Fluffy coriander egg-white omelet or organic tofu scramble seasoned with wild asparagus and warm cooked quinoa."
      }
    },
    Luteal: {
      focusName: "Glucose Control & Progesterone Building",
      details: "Progesterone is high and requires extremely stable blood sugar. Consume sources rich in magnesium and slow-digesting nutrients to prevent stress, sugar cravings, and PMS.",
      checklist: [
        "Baked sweet potato or pumpkin",
        "Sunflower seeds (highly supportive of progesterone)",
        "Mellow cocoa husk or chamomile tea",
        "Bananas for natural vitamin B6 energy"
      ],
      recipeTitle: "Baked Sweet Potato Wedges with Cinnamon",
      recipeDesc: "Calms your sweet tooth efficiently without insulin peaks, providing deep relaxation for your nervous system.",
      recipePrep: [
        "Slice sweet potato into uniform thin wedges.",
        "Lightly coat with raw coconut oil and top with generous organic cinnamon.",
        "Airfry or bake at 180°C/350°F for 15-20 minutes until gold brown.",
        "Garnish with raw sunflower seeds before serving."
      ],
      trainingFocus: "Control Pilates or Steady State Jogging",
      trainingDetails: "Internal energy burn runs faster, but anaerobic resistance decreases. Seek controlled posture movements, muscle toning, or light walking.",
      trainingChecklist: [
        "Core focus isometric hold plank",
        "Mat Pilates (hip lifts, leg circles)",
        "Refreshing outdoor swim or fast-paced steady jog"
      ],
      timerDurationSeconds: 420,
      timerExercises: [
        "Slow Mat Pilates Roll Up - 60s",
        "Single-Leg Bridge - 60s (30s each leg)",
        "Isometric Core Plank - 60s",
        "Superwoman Lumbar Extension - 60s",
        "Deep Glute Piriformis Stretch - 60s",
        "Calming Deep Breathing - 120s"
      ],
      meals: {
        breakfast: "Warm bananarock oat pancakes dusted with cinnamon, garnished with raw progesterone-supporting sunflower seeds and a touch of raw organic honey.",
        lunch: "Oat-crusted healthy chicken breast or dynamic home-baked vegan black bean burger, served over sweet baked pumpkin on a bed of sautéed greens.",
        snack: "Comforting spice-stewed apple slices with Ceylon cinnamon and a handful of zinc-rich pumpkin seeds.",
        dinner: "Velvety puréed warm pumpkin soup with fresh grated elements of immune ginger, organic pulled chicken breast or hemp-seeds quinoa."
      }
    }
  },
  es: {
    Menstrual: {
      focusName: "Alimentos Ricos en Hierro y Relajantes",
      details: "En esta fase, la progesterona y el estrógeno descienden. Dedícate a reponer el hierro y a hidratar el cuerpo con tés naturales que disminuyan la hinchazón menstrual.",
      checklist: [
        "Infusión de Menta o Jengibre",
        "Chocolate negro (70%+ cacao - rico en magnesio)",
        "Vegetales de hoja verde oscura (espinacas)",
        "Proteínas livianas fáciles de digerir"
      ],
      recipeTitle: "Bebida Reconfortante de Jengibre y Cacao",
      recipeDesc: "Un elixir antiinflamatorio para calmar el dolor pélvico y aportar un escudo de antioxidantes en los días difíciles.",
      recipePrep: [
        "Hierve 250ml de agua con rodajas de jengibre fresco durante 5 minutos.",
        "Agrega 1 cucharada de cacao puro y remueve de forma continua.",
        "Endulza con una pizca de miel orgánica a gusto.",
        "Tómalo tibio antes de descansar."
      ],
      trainingFocus: "Estiramiento Suave y Movilidad",
      trainingDetails: "Valora la recuperación activa. Los movimientos suaves alivian la retención en la zona baja de la espalda sin elevar los niveles de estrés corporal.",
      trainingChecklist: [
        "Postura del Niño (Balasana) para aliviar lumbares",
        "Torsiones cervicales y espinales suaves acostada",
        "Caminata tranquila al aire libre"
      ],
      timerDurationSeconds: 300,
      timerExercises: [
        "Postura del Niño (Balasana) - 60s",
        "Secuencia del Gato-Vaca - 60s",
        "Torsión Espinal Acostada - 60s (30s cada lado)",
        "Puente de Glúteos Suave - 60s",
        "Respiración Relajante Abdominal - 60s"
      ],
      meals: {
        breakfast: "Gachas de avena al té caliente preparadas con bebida vegetal, pipas de calabaza, rodajas fina de plátano canario y canela.",
        lunch: "Pechuga de pollo campero o tofu adobado con hierbas silvestres, espinacas salteadas al ajillo con semillas de sésamo y arroz basmati integral.",
        snack: "Taza de infusión digestiva de menta con 3 onzas de chocolate puro negro (70%+) y 5 almendras ligeramente tostadas.",
        dinner: "Salmón del norte asado con romero o estofado denso de lentejas rojas, puré rústico de boniato y flores de brócoli al vapor con limón."
      }
    },
    Folliculary: {
      focusName: "Estrógenos y Vitalidad Física",
      details: "El estrógeno asciende dándote mayor frescura mental. Aporta grasas saludables e hidratos de lenta absorción para favorecer el crecimiento de folículos de buena calidad.",
      checklist: [
        "Medio aguacate maduro en el día",
        "Pimientos y vegetales frescos altos en Vitamina C",
        "Arroz integral o Quinoa con verduras",
        "Semillas de lino o de cáñamo molidas"
      ],
      recipeTitle: "Ensalada de Quinoa y Aguacate de Vitalidad",
      recipeDesc: "Una ensalada rica en fibra limpia y grasas insaturadas que facilita metabolizar óptimamente tus estrógenos.",
      recipePrep: [
        "Mezcla 1 taza de quinoa cocida con medio aguacate picado en cubos.",
        "Suma tomates cherry cortados, pepino y pepitas de calabaza.",
        "Condimenta con zumo de limón fresco y una cucharada de aceite de oliva."
      ],
      trainingFocus: "Fuerza Progresiva y HIIT Dinámico",
      trainingDetails: "La fuerza muscular asciende gracias a los estrógenos altos. Gran momento para usar pesos libres, pesas y entrenamientos HIIT de resistencia sostenida.",
      trainingChecklist: [
        "Sentadillas clásicas con mancuernas",
        "Plancha alta tocando los hombros alternadamente",
        "Circuito metabólico de cardio"
      ],
      timerDurationSeconds: 480,
      timerExercises: [
        "Sentadillas Controladas en el Sitio - 60s",
        "Plancha con Toques de Hombro - 60s",
        "Saltos de Tijera (Jumping Jacks) - 60s",
        "Flexiones con apoyo en rodillas - 60s",
        "Estiramiento Activo de Cuádriceps - 60s",
        "Repeticiones del Circuito HIIT - 120s"
      ],
      meals: {
        breakfast: "Bol fresco de yogur griego ecológico o iogurt de coco con una cucharada de semillas de lino molido, arándanos azules y granola integral sin azúcar.",
        lunch: "Ensalada revitalizante de quinoa real con aguacate maduro troceado, pechuga de pavo asada o garbanzos, tomate cherry y vinagreta suave de limón.",
        snack: "Hummus cremoso de garbanzos servido con bastoncillos crujientes de hortalizas del huerto (zanahoria, apio, pepino).",
        dinner: "Merluza del Cantábrico con hierbas finas al horno, ramilletes de brócoli al vapor y un boniato asado aromático."
      }
    },
    Ovulatory: {
      focusName: "Antioxidantes y Regeneración Hormonal",
      details: "Estás en el pico del ciclo. Tu estómago tiene gran tolerancia digestiva. Toma suficientes fitoquímicos para apoyar al hígado a purificar el excedente de estrógeno.",
      checklist: [
        "Licuados de arándanos o fresas",
        "Brócoli o coliflor cocida brevemente al vapor",
        "Almendras crudas e hidratadas",
        "Aumento en el consumo de agua dulce"
      ],
      recipeTitle: "Batido Verde Antioxidante del Pico Hormonal",
      recipeDesc: "Un licuado vivo rico en vitaminas, minerales y enzimas que asiste al sistema digestivo en su punto más álgido.",
      recipePrep: [
        "Licúa 1 taza de espinacas tiernas bien lavadas.",
        "Suma 1 plátano maduro congelado y media taza de frutos del bosque.",
        "Añade 1 cucharada de chía y 200ml de agua fresca de coco natural.",
        "Disfrútalo de inmediato."
      ],
      trainingFocus: "Potencia Muscular y Cardio de Intensidad",
      trainingDetails: "Tienes energía máxima y alta tolerancia a la fatiga. Cuida tus tendones, dado que la flexibilidad articular aumenta temporalmente con los estrógenos elevados.",
      trainingChecklist: [
        "Carreras con aceleración rápida o sprints",
        "Ejercicios pesados con repeticiones cortas",
        "Saltos de caja o Burpees directos"
      ],
      timerDurationSeconds: 600,
      timerExercises: [
        "Burpees Explosivos con Salto - 45s",
        "Sentadillas con Salto de Potencia - 45s",
        "Escaladores de Montaña a ritmo alto - 45s",
        "Flexiones de brazos veloces - 45s",
        "Descanso Completo Regenerador - 45s",
        "Siguientes Asaltos HIIT - 270s"
      ],
      meals: {
        breakfast: "Nuestra creación premium Batido Verde Luminous con hojas de espinacas baby limpias, plátano tierno maduro helado, chía, frutos del bosque del bosque y coco.",
        lunch: "Bowl de arroz basmati aromático con salmón rojo a la plancha o edamame salteado, ramitas de brócoli, almendras crujientes y un aderezo de tahini.",
        snack: "Manzana fresca de temporada fileteada con canela de Ceilán pura y una cucharada de mantequilla natural de almendras.",
        dinner: "Tortilla suave de claras con espárragos trigueros y champiñones o revuelto de tofu con cilantro fresco y quinoa ligera."
      }
    },
    Luteal: {
      focusName: "Contención Glicémica y Progesterona",
      details: "La progesterona requiere mantener estable la curva de insulina. Aumenta la ingesta de potasio y fibras para no tener dolores de cabeza, antojos de azúcar o bajones.",
      checklist: [
        "Boniato o calabaza dulce al horno",
        "Semillas de Girasol (apoyo directo a la producción de progesterona)",
        "Tés calmantes de manzanilla o valeriana",
        "Frescura de plátanos que aportan B6"
      ],
      recipeTitle: "Rodajas de Boniato Dulce con Canela",
      recipeDesc: "Un snack dulce inteligente que nutre tu sistema digestivo y mantiene estables tus sensaciones sin subidas insulinocélulas.",
      recipePrep: [
        "Rebana medio boniato en círculos delgados regulares.",
        "Pincela con unas gotas de aceite de coco y espolvorea canela abundante.",
        "Ponlo a hornear a 180°C durante 15 minutos.",
        "Decora con un puñado de semillas de girasol antes de servir."
      ],
      trainingFocus: "Pilates del Core o Yoga Dinámico Moderado",
      trainingDetails: "El gasto calórico interno sube, pero baja tu resistencia anaeróbica. Enfócate en resistencia estática de core (abdominales), pilates en esterilla y técnica postural.",
      trainingChecklist: [
        "Plancha abdominal de sostén estático",
        "Pilates en suelo para glúteos y lumbares",
        "Caminata rápida que oxigene el cuerpo sin agitarlo"
      ],
      timerDurationSeconds: 420,
      timerExercises: [
        "Rodillo de Pilates Roll-Up - 60s",
        "Puente unilateral - 60s (30s cada pierna)",
        "Plancha isométrica sólida - 60s",
        "Extensión lumbar Superwoman - 60s",
        "Estiramiento profundo de cadera - 60s",
        "Respiraciones pausadas calmantes - 120s"
      ],
      meals: {
        breakfast: "Panqueques rústicos caseros de avena, plátano maduro y canela pura en polvo con semillas de girasol tostadas por encima.",
        lunch: "Pollo de corral en su jugo o hamburguesa vegana de frijol negro asada a la plancha, con gajos de calabaza dulce horneada y col rizada salteada muy fina en azeite extra de oliva.",
        snack: "Rebanadas calientes de manzana asada con canela de Ceilán y un puñado seleccionado de semillas ricas en zinc de calabaza.",
        dinner: "Sopa o crema reconfortante de calabaza con raíz fresca de jengibre, acompañada de pechuga de pollo ecológica deshilachada y quinoa real asada tierna."
      }
    }
  }
};
