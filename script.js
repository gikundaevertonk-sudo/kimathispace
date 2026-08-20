const articles = [
  {
    id: 1,
    title: "How I learned to bloom in the middle of a busy season",
    category: "growth",
    date: "August 14, 2026",
    readTime: "5 min read",
    accent: "thumb-rose",
    excerpt:
      "There is a kind of quiet courage in continuing to grow even when life feels loud and full.",
    body: [
      "Some seasons do not ask for dramatic change. They ask for gentleness, consistency, and the willingness to notice what still lives inside you when the world is moving quickly.",
      "I used to think I had to be endlessly productive to be worthy of my own attention. I measured my day by what I could produce, what I could fix, and how many tasks I could cross off before the evening arrived. But then I began noticing a softer rhythm in the middle of the noise — a small opening that did not feel like a performance, but a return to myself.",
      "I started protecting tiny pockets of stillness. A cup of coffee before the day began. A walk with no agenda. A notebook page where I did not need to explain myself. Those rituals did not dramatically change my life overnight, but they changed the direction of my attention.",
      "And that is where growth often begins: not in a grand transformation, but in a sincere willingness to be present with the life that is already unfolding."
    ]
  },
  {
    id: 2,
    title: "The joy of slow mornings and soft plans",
    category: "life",
    date: "August 10, 2026",
    readTime: "4 min read",
    accent: "thumb-mint",
    excerpt:
      "Mornings became kinder when I stopped trying to rush the day into existence.",
    body: [
      "Slow mornings are not about being lazy. They are about making room for your own inner weather before the outer world starts asking things of you.",
      "For a long time, I believed that a good day needed a full to-do list and a tidy start. But I was chronically arriving at noon already behind my own expectations. I would begin the day in motion and end it in friction.",
      "When I finally changed my rhythm, I noticed the difference immediately. I sat longer with my tea. I looked out the window a little more. I wrote before I checked my phone. These moments did not feel especially dramatic, yet they carried a kind of deep calm that my previous schedule could never hold.",
      "A softer start does not mean less ambition. It means that you are building a life that can hold your dreams without burning you out in the process."
    ]
  },
  {
    id: 3,
    title: "Travel notes from a city that taught me to listen",
    category: "travel",
    date: "August 02, 2026",
    readTime: "6 min read",
    accent: "thumb-gold",
    excerpt:
      "The best part of traveling is not the scenery, but the way it quiets the noise inside you.",
    body: [
      "I traveled to a city I had never seen before, and the first thing it taught me was how much my life had become accustomed to speed. Everyone was moving with purpose, but no one seemed to be in a hurry to impress anyone else.",
      "I spent my afternoons wandering with no plan, letting the streets become my teacher. A bakery with warm bread. A small bookshop filled with paper dust. An old café where the walls seemed to hold years of conversations.",
      "Travel can be transformative because it strips you of your normal scripts. You stop performing your usual self and begin noticing what is actually here. That noticing is often the real gift.",
      "I came home with a different relationship to time, and a deeper respect for spaces that invite people to slow down and be present."
    ]
  },
  {
    id: 4,
    title: "The little rituals that make a home feel like a refuge",
    category: "life",
    date: "July 25, 2026",
    readTime: "3 min read",
    accent: "thumb-lavender",
    excerpt:
      "Home becomes sacred when it holds the rhythms that help us feel safe and rested.",
    body: 
      [
      "A home is not only a place where you sleep and store things. It is a feeling that settles around you when the world gets loud. Sometimes that feeling is created by the smallest rituals: a candle lit in the evening, a playlist for dinner, fresh flowers on the table, or the habit of putting your phone away before bed.",
      "I have come to believe that our environments affect our inner lives more than we realize. The objects around us hold memory, mood, and intention. They can either support our peace or quietly drain it.",
      "The most beautiful homes are not the ones that appear perfect. They are the ones that feel considered. That is what I want my space to become: not a performance of brightness, but a place where rest, honesty, and possibility can all live together."
    ]
  }
];

const articleGrid = document.getElementById("articleGrid");
const filterButtons = document.querySelectorAll(".filter-btn");
const modal = document.getElementById("articleModal");
const modalCategory = document.getElementById("modalCategory");
const modalMeta = document.getElementById("modalMeta");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const closeButton = document.querySelector(".close-btn");

function renderArticles(filter = "all") {
  const visibleArticles = [];

  articleGrid.innerHTML = visibleArticles
    .map(
      (article) => `
        <article class="article-card" data-id="${article.id}" tabindex="0">
          <div class="article-thumb ${article.accent}"></div>
          <div class="article-meta">
            <span>${article.category}</span>
            <span>${article.readTime}</span>
          </div>
          <h3>${article.title}</h3>
          <p>${article.excerpt}</p>
        </article>
      `
    )
    .join("");

  articleGrid.querySelectorAll(".article-card").forEach((card) => {
    card.addEventListener("click", () => openArticle(Number(card.dataset.id)));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openArticle(Number(card.dataset.id));
      }
    });
  });
}

function openArticle(articleId) {
  const article = articles.find((entry) => entry.id === articleId);
  if (!article) return;

  modalCategory.textContent = article.category;
  modalMeta.textContent = `${article.date} • ${article.readTime}`;
  modalTitle.textContent = article.title;
  modalBody.innerHTML = article.body.map((paragraph) => `<p>${paragraph}</p>`).join("");

  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden", "false");
}

function closeArticle() {
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    renderArticles(button.dataset.filter);
  });
});

closeButton.addEventListener("click", closeArticle);
modal.addEventListener("click", (event) => {
  if (event.target.dataset.close === "true") {
    closeArticle();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.classList.contains("hidden")) {
    closeArticle();
  }
});

renderArticles();

const interactionTargets = document.querySelectorAll(
  ".nav-cta, .primary-btn, .secondary-btn, .newsletter-form button, .filter-btn"
);

interactionTargets.forEach((target) => {
  target.addEventListener("pointerdown", () => {
    target.classList.remove("pop");
    void target.offsetWidth;
    target.classList.add("pop");

    target.addEventListener(
      "animationend",
      () => target.classList.remove("pop"),
      { once: true }
    );
  });
});

const heroImageInput = document.getElementById("heroImageInput");
const heroImage = document.getElementById("heroImage");

heroImageInput?.addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (!file) return;

  heroImage.src = URL.createObjectURL(file);
  heroImage.classList.add("visible");
});
