/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PhaseSuggestion, PhaseType, MealPlan } from './suggestions-data';

export type DietType = 'standard' | 'vegetarian' | 'vegan';

export function getAdaptedSuggestion(
  base: PhaseSuggestion,
  diet: DietType,
  phase: PhaseType,
  lang: 'pt' | 'en' | 'es'
): PhaseSuggestion {
  if (diet === 'standard') {
    return base;
  }

  // Create a copy of the base suggestion
  const adapted = {
    ...base,
    checklist: [...base.checklist],
    recipePrep: [...base.recipePrep],
    meals: { ...base.meals }
  };

  if (lang === 'pt') {
    // PT Adaptations
    if (phase === 'Menstrual') {
      if (diet === 'vegetarian') {
        adapted.meals.lunch = "Tiras de tofu dourado ou queijo fresco de cabra temperado com ervas, espinafres salteados em alho e azeite com sementes de sésamo escuro, acompanhado de arroz integral vaporizado.";
        adapted.meals.dinner = "Creme leve de lentilhas vermelhas de digestão fáceis ou queijo grelhado com sementes, servido com puré cremoso de batata-doce e brócolos ao vapor aromatizados com limão.";
        adapted.checklist = adapted.checklist.map(item => item.includes("Proteínas limpas") ? "Proteínas limpas veg (tofu/lentilhas)" : item);
      } else if (diet === 'vegan') {
        adapted.meals.lunch = "Tiras de tofu grelhado com gengibre e tamari, espinafres salteados em alho e azeite com sementes de sésamo escuro, acompanhado de arroz integral vaporizado.";
        adapted.meals.dinner = "Sopa rica em lentilhas vermelhas de digestão lenta ou tofu grelhado em crosta de sementes, servido com puré de batata-doce ao leite de coco e brócolos ao vapor.";
        adapted.checklist = adapted.checklist.map(item => item.includes("Proteínas limpas") ? "Proteínas limpas 100% vegetais" : item);
      }
    } else if (phase === 'Folliculary') {
      if (diet === 'vegetarian') {
        adapted.meals.breakfast = "Taça de iogurte grego natural ou iogurte de coco, com 1 colher de sementes de linhaça moídas, mirtilos frescos e granola artesanal sem açúcar.";
        adapted.meals.lunch = "Salada energética de quinoa real com cubos de abacate maduro, grão-de-bico, queijo feta, tomate-cereja cortado ao meio, pepino e vinagrete de limão.";
        adapted.meals.dinner = "Tofu ao forno temperado com ervas finas, brócolos cozidos ao vapor leves e batata-doce cozida temperada com um fio de azeite.";
        adapted.recipeTitle = "Salada de Quinoa, Abacate & Feta";
      } else if (diet === 'vegan') {
        adapted.meals.breakfast = "Taça de iogurte de coco natural com mirtilos, granola artesanal e sementes de linhaça moídas.";
        adapted.meals.lunch = "Salada energética de quinoa real com cubos de abacate, grão-de-bico bio, tomate-cereja cortado ao meio, pepino e vinagrete de limão fresco.";
        adapted.meals.dinner = "Tofu crocante ao forno com ervas finas, brócolos cozidos ao vapor leves e batata-doce assada no forno com alecrim.";
        adapted.recipeTitle = "Salada de Quinoa e Abacate Vitalidade (Vegan)";
      }
    } else if (phase === 'Ovulatory') {
      if (diet === 'vegetarian') {
        adapted.meals.lunch = "Saladeira com mix de folhas escuras, ovos biológicos cozidos ou grãos de edamame, ramos de brócolos ao vapor com amêndoas tostadas e molho de tahini.";
        adapted.meals.dinner = "Omelete de ovos orgânicos com coentros, espargos verdes e quinoa fofa.";
      } else if (diet === 'vegan') {
        adapted.meals.lunch = "Saladeira com mix de folhas escuras, grãos de edamame crocantes, cogumelos salteados, ramos de brócolos ao vapor com amêndoas tostadas e molho de tahini.";
        adapted.meals.dinner = "Tofu mexido cremoso com curcuma e coentros, servido com espargos verdes grelhados e quinoa fofa.";
        adapted.recipeTitle = "Batido Verde Antioxidante (100% Vegan)";
      }
    } else if (phase === 'Luteal') {
      if (diet === 'vegetarian') {
        adapted.meals.lunch = "Hambúrguer caseiro de grão-de-bico ou lentilhas, acompanhado de fatias de abóbora assada na canela e batata-doce crocante ao forno com couve-galega salteada leve.";
        adapted.meals.dinner = "Sopa creme reconfortante de abóbora e um leve toque de gengibre, servida com ovo cozido ralado por cima e uma colher de quinoa real.";
      } else if (diet === 'vegan') {
        adapted.meals.lunch = "Hambúrguer caseiro de grão-de-bico de base vegetal, acompanhado de fatias de abóbora assada na canela e batata-doce assada com couve-galega salteada leve.";
        adapted.meals.dinner = "Sopa creme reconfortante de abóbora e gengibre, servida com sementes de cânhamo ricas em magnésio e uma colher de quinoa real.";
      }
    }
  } else if (lang === 'en') {
    // EN Adaptations
    if (phase === 'Menstrual') {
      if (diet === 'vegetarian') {
        adapted.meals.lunch = "Tender lemon-marinated skillet tofu served over brown basmati rice with garlic-sautéed spinach.";
        adapted.meals.dinner = "A warm protein-rich lentil stew or baked seasoned tofu accompanied by sweet potato mash and lightly steamed broccoli.";
        adapted.checklist = adapted.checklist.map(item => item.includes("Clean, easily digestible") ? "Plant-based proteins (tofu or lentils)" : item);
      } else if (diet === 'vegan') {
        adapted.meals.lunch = "Tender organic tofu crisps with tamari and ginger, served over brown basmati rice with garlic-sautéed spinach.";
        adapted.meals.dinner = "A hearty iron-rich lentil stew served with organic sweet potato mash and warm broccoli florets.";
        adapted.checklist = adapted.checklist.map(item => item.includes("Clean, easily digestible") ? "Vegan clean proteins (tempeh/beans)" : item);
      }
    } else if (phase === 'Folliculary') {
      if (diet === 'vegetarian') {
        adapted.meals.breakfast = "Organic Greek yogurt bowl topped with freshly milled organic flaxseeds, wild blueberries, and gluten-free granola.";
        adapted.meals.lunch = "Bright quinoa salad combined with diced avocado, crumbled feta cheese, organic chickpeas, cucumber, and lemon dressing.";
        adapted.meals.dinner = "Oven-baked savory seasoned tofu with fine herbs, served over steamed organic sweet potato and fresh leafy arugula.";
      } else if (diet === 'vegan') {
        adapted.meals.breakfast = "Organic coconut yogurt bowl topped with freshly milled organic flaxseeds, wild blueberries, and high-fiber vegan granola.";
        adapted.meals.lunch = "Bright quinoa salad combined with diced avocado, crispy loaded chickpeas, cucumber, and cold-pressed lemon juice dressing.";
        adapted.meals.dinner = "Oven-baked crispy organic tofu with herbs, served over sweet potato mash and fresh leafy arugula.";
      }
    } else if (phase === 'Ovulatory') {
      if (diet === 'vegetarian') {
        adapted.meals.lunch = "Rich dark leafy greens salad bowl filled with organic hardboiled eggs, broccoli florets, and raw sliced almonds with a tahini dressing.";
        adapted.meals.dinner = "Fluffy organic egg omelet with fresh herbs, seasoned with wild asparagus and warm cooked quinoa.";
      } else if (diet === 'vegan') {
        adapted.meals.lunch = "Rich dark leafy greens salad bowl filled with fresh edamame, sautéed button mushrooms, broccoli, and raw sliced almonds with a tahini dressing.";
        adapted.meals.dinner = "Fluffy organic tofu scramble seasoned with wild asparagus, turmeric, and warm cooked quinoa.";
      }
    } else if (phase === 'Luteal') {
      if (diet === 'vegetarian') {
        adapted.meals.lunch = "Dynamic home-baked vegetarian black bean burger, served over sweet baked pumpkin on a bed of sautéed greens.";
        adapted.meals.dinner = "Velvety puréed warm pumpkin soup with fresh grated elements of immune ginger, organic boiled egg halves or hemp-seeds quinoa.";
      } else if (diet === 'vegan') {
        adapted.meals.lunch = "Dynamic home-baked vegan black bean burger, served over sweet baked pumpkin on a bed of high-fiber sautéed greens.";
        adapted.meals.dinner = "Velvety puréed warm pumpkin soup with fresh ginger, loaded with mineral-rich hemp seeds and warm cooked quinoa.";
      }
    }
  } else if (lang === 'es') {
    // ES Adaptations
    if (phase === 'Menstrual') {
      if (diet === 'vegetarian') {
        adapted.meals.lunch = "Tofu ahumado adobado con hierbas silvestres, espinacas salteadas al ajillo con semillas de sésamo y arroz basmati integral.";
        adapted.meals.dinner = "Estofado denso de lentejas rojas, puré rústico de boniato y flores de brócoli al vapor con limón.";
        adapted.checklist = adapted.checklist.map(item => item.includes("Proteínas livianas") ? "Proteínas de origen vegetal (tofu/lentejas)" : item);
      } else if (diet === 'vegan') {
        adapted.meals.lunch = "Tofu orgánico marinado con tamari y jengibre, espinacas salteadas al ajillo y arroz basmati integral de absorción lenta.";
        adapted.meals.dinner = "Guiso reconfortante de lentejas rojas rico en hierro, puré de boniato elaborado con leche de coco y brócoli al vapor.";
        adapted.checklist = adapted.checklist.map(item => item.includes("Proteínas livianas") ? "Proteínas veganas de fácil digestión" : item);
      }
    } else if (phase === 'Folliculary') {
      if (diet === 'vegetarian') {
        adapted.meals.breakfast = "Bol de yogur griego ecológico con una cucharada de semillas de lino molido, arándanos azules y granola integral.";
        adapted.meals.lunch = "Ensalada de quinoa con trozos de aguacate maduro, queso feta, garbanzos cocidos, tomate cherry y vinagreta suave de limón.";
        adapted.meals.dinner = "Tofu al horno sazonado con finas hierbas, ramilletes de brócoli al vapor y un boniato asado.";
      } else if (diet === 'vegan') {
        adapted.meals.breakfast = "Bol de yogur de coco natural con una cucharada de semillas de lino molido, arándanos de temporada y granola vegana libre de azúcares.";
        adapted.meals.lunch = "Ensalada fresca de quinoa real con aguacate maduro troceado, garbanzos cocidos, tomate cherry y vinagreta ecológica de limón.";
        adapted.meals.dinner = "Tofu crocante al horno con finas hierbas, ramitas de brócoli cocido al vapor y boniato asado al romero.";
      }
    } else if (phase === 'Ovulatory') {
      if (diet === 'vegetarian') {
        adapted.meals.lunch = "Bowl de arroz basmati aromático con huevos duros o edamame salteado, ramitas de brócoli, almendras crujientes y un aderezo de tahini.";
        adapted.meals.dinner = "Tortilla de huevos ecológicos con espárragos trigueros, cilantro fresco y quinoa ligera.";
      } else if (diet === 'vegan') {
        adapted.meals.lunch = "Bowl de arroz basmati aromático con abundante edamame salteado, champiñones, ramitas de brócoli, almendras crujientes y un aderezo de tahini.";
        adapted.meals.dinner = "Revuelto de tofu orgánico con espárragos trigueros, cúrcuma de Ceilán, cilantro fresco y quinoa ligera.";
      }
    } else if (phase === 'Luteal') {
      if (diet === 'vegetarian') {
        adapted.meals.lunch = "Hamburguesa artesanal de frijol negro o lentejas, con gajos de calabaza dulce horneada y col rizada salteada muy fina.";
        adapted.meals.dinner = "Crema reconfortante de calabaza al jengibre, acompañada de huevo cocido desmenuzado y quinoa real asada tierna.";
      } else if (diet === 'vegan') {
        adapted.meals.lunch = "Hamburguesa vegana de frijol negro, gajos de calabaza dulce horneada con un toque de canela y col romana salteada súper fina.";
        adapted.meals.dinner = "Sopa o crema reconfortante de calabaza con raíz fresca de jengibre, semillas de cáñamo ricas en magnesio y quinoa real.";
      }
    }
  }

  return adapted;
}
