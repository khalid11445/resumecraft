import { Lang } from "./labels";
import { categories as categoriesEn } from "./categories";
import type { Category } from "./categories";
import { categoriesFr } from "./categories-fr";
import { getSuggestions as ideasEn, bulletsFor as bulletsEn } from "./suggestions";
import { suggestionsFr, bulletsForFr } from "./suggestions-fr";
import { summariesFor as summariesEn } from "./summaries";
import { summariesForFr } from "./summaries-fr";
import { stageCategory, stageIdeas, stageBullets, stageSummaries } from "./stage";

export function getCategories(lang: Lang = "en"): Category[] {
  const base = lang === "fr" ? categoriesFr : categoriesEn;
  return [...base, stageCategory(lang)];
}

export function getCategory(id: string, lang: Lang = "en"): Category {
  const list = getCategories(lang);
  return list.find((c) => c.id === id) ?? list[0];
}

export function getIdeas(categoryId: string, lang: Lang = "en") {
  if (categoryId === "stage") return stageIdeas(lang);
  return lang === "fr"
    ? suggestionsFr[categoryId] ?? suggestionsFr.student
    : ideasEn(categoryId);
}

export function bulletIdeas(categoryId: string, text: string, lang: Lang = "en") {
  if (categoryId === "stage") return stageBullets(lang, text);
  return lang === "fr" ? bulletsForFr(categoryId, text) : bulletsEn(categoryId, text);
}

export function summaryIdeas(categoryId: string, title: string, lang: Lang = "en") {
  if (categoryId === "stage") return stageSummaries(lang, title);
  return lang === "fr"
    ? summariesForFr(categoryId, title)
    : summariesEn(categoryId, title);
}