document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
  const menu = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  if (menu && nav) menu.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", String(open));
  });
});

function showResults(container, title, items) {
  container.style.display = "block";
  container.innerHTML = `<h2>${escapeHtml(title)}</h2><ul>${items.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul><div class="result-actions"><button class="mini-button" type="button" onclick="copyResults(this)">Copy results</button></div>`;
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function copyResults(button) {
  const box = button.closest(".results");
  const text = [...box.querySelectorAll("li")].map(li => li.textContent).join("\n");
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => { button.textContent = "Copied!"; }).catch(() => fallbackCopy(text, button));
  } else fallbackCopy(text, button);
}
function fallbackCopy(text, button) {
  const area = document.createElement("textarea"); area.value = text; document.body.appendChild(area); area.select();
  try { document.execCommand("copy"); button.textContent = "Copied!"; } catch(e) { button.textContent = "Select and copy manually"; }
  area.remove();
}
const titlePatterns = [
  t => `A Beginner's Guide to ${t}`,
  t => `How to Use ${t}: A Practical Step-by-Step Guide`,
  t => `${t}: Tips, Benefits, and Common Mistakes`,
  t => `10 Things to Know About ${t}`,
  t => `The Practical Checklist for ${t}`,
  t => `${t} Explained: What Beginners Need to Know`,
  t => `How to Get Better Results with ${t}`,
  t => `${t} for Beginners: A Simple Guide`
];
document.addEventListener("submit", e => {
  const form = e.target;
  if (!form.matches("[data-tool]")) return;
  e.preventDefault();
  const type = form.dataset.tool;
  const output = form.querySelector(".results");
  const topic = (form.querySelector("[name=topic]")?.value || "").trim();
  if (type !== "audit" && !topic) { alert("Please enter a topic or page subject first."); return; }
  if (type === "titles") {
    showResults(output, "Title ideas", titlePatterns.map(fn => fn(topic)));
  } else if (type === "meta") {
    const audience = (form.querySelector("[name=audience]")?.value || "beginners").trim();
    const benefit = (form.querySelector("[name=benefit]")?.value || "learn the essentials").trim();
    const variants = [
      `Learn about ${topic} with this practical guide for ${audience}. Explore key tips, useful examples, and ways to ${benefit}.`,
      `New to ${topic}? This guide for ${audience} explains the basics, common mistakes, and practical steps to get started.`,
      `Explore ${topic} in a clear, beginner-friendly guide. Get practical tips, examples, and next steps for ${audience}.`
    ];
    showResults(output, "Meta description drafts", variants);
    const note = document.createElement("p"); note.className = "notice"; note.textContent = "Review length and relevance before publishing. Google may generate a different snippet for a query."; output.appendChild(note);
  } else if (type === "keywords") {
    const base = topic.toLowerCase();
    const ideas = [
      `what is ${base}`, `how to use ${base}`, `best ${base} for beginners`, `free ${base}`, `${base} examples`,
      `${base} tips`, `${base} checklist`, `${base} vs alternatives`, `${base} common mistakes`, `${base} for small businesses`,
      `${base} tools`, `${base} step by step guide`
    ];
    showResults(output, "Keyword brainstorming ideas", ideas);
    const note = document.createElement("p"); note.className = "notice"; note.textContent = "These are brainstormed ideas, not measured search volumes or keyword difficulty. Validate demand with a keyword research tool."; output.appendChild(note);
  } else if (type === "outline") {
    const audience = (form.querySelector("[name=audience]")?.value || "beginners").trim();
    const outline = [
      `H1: ${topic}`,
      "Introduction: define the reader's problem and the promised outcome",
      `H2: What is ${topic}?`,
      `H2: Why ${topic} matters for ${audience}`,
      "H2: Step-by-step process",
      "H2: Tools or examples to consider",
      "H2: Common mistakes and how to avoid them",
      "H2: Frequently asked questions",
      "Conclusion: summarise the main points and suggest a useful next step"
    ];
    showResults(output, "Draft content outline", outline);
  } else if (type === "audit") {
    const checks = [...form.querySelectorAll("input[type=checkbox]")];
    const done = checks.filter(c => c.checked).length;
    showResults(output, `Checklist progress: ${done}/${checks.length} reviewed`, checks.map(c => `${c.checked ? "[Done]" : "[Review]"} ${c.value}`));
  }
});