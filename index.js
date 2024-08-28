const USER_DATA_URL = "./data/user.json";
const ACTIVITIES_DATA_URL = "./data/activities.json";

const userDetailsTemplate = document.getElementById("user-details-template");
const activityCardTemplate = document.getElementById("activity-card-template");
const dashboard = document.getElementById("dashboard");

function init() {
  dashboard.append(userDetailsTemplate.content.cloneNode(true));

  for (let i = 0; i < 6; i++) {
    dashboard.append(activityCardTemplate.content.cloneNode(true));
  }
}

async function fakeNetwork() {
  const delay = Math.random() * 2000;
  return new Promise((resolve, _) => {
    setTimeout(resolve, delay);
  });
}

async function fetchData(url) {
  await fakeNetwork();
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

function renderUser(user) {
  const content = userDetailsTemplate.content.cloneNode(true);
  const avatar = content.querySelector(".user-details__avatar");
  avatar.classList.remove("skeleton");
  avatar.setAttribute("src", user.avatar);
  const name = content.querySelector(".user-details__name");
  name.classList.remove("skeleton", "skeleton-text");
  name.textContent = `${user.firstname} ${user.lastname}`;
  dashboard.append(content);
}

function activityToClassName(activity) {
  return activity.toLowerCase().split(" ").join("-");
}

function formatTimeframe(timeframe) {
  switch (timeframe) {
    case "daily":
      return "Day";
    case "weekly":
      return "Week";
    case "monthly":
      return "Month";
  }
}

function renderActivities(activities, timeframe) {
  activities.forEach((activity) => {
    const content = activityCardTemplate.content.cloneNode(true);
    const card = content.querySelector(".activity-card");
    card.classList.remove("skeleton");
    card.classList.add(
      `activity-card_theme_${activityToClassName(activity.title)}`
    );
    const title = content.querySelector(".activity-card__title");
    title.classList.remove("skeleton", "skeleton-text");
    title.textContent = activity.title;
    const current = content.querySelector(".activity-card__current");
    current.classList.remove("skeleton", "skeleton-text");
    current.textContent = `${activity.timeframes[timeframe].current}hrs`;
    const previous = content.querySelector(".activity-card__previous");
    previous.classList.remove("skeleton", "skeleton-text");
    previous.textContent = `Last ${formatTimeframe(timeframe)} - ${
      activity.timeframes[timeframe].previous
    }hrs`;
    dashboard.append(content);
  });
}

function clearDashboardFromActivities() {
  const firstChild = dashboard.firstElementChild;
  while (firstChild.nextElementSibling) {
    firstChild.nextElementSibling.remove();
  }
}

async function main() {
  const [user, activities] = await Promise.all([
    fetchData(USER_DATA_URL),
    fetchData(ACTIVITIES_DATA_URL),
  ]);
  dashboard.innerHTML = "";
  renderUser(user);
  renderActivities(activities, "weekly");
  const timeframeButtons = document.querySelectorAll(
    ".timeframe-picker button"
  );
  timeframeButtons[0].id = "daily";
  timeframeButtons[1].id = "weekly";
  timeframeButtons[1].classList.add("active");
  timeframeButtons[2].id = "monthly";
  const handleTimeframePickerClick = (event) => {
    const target = event.currentTarget;
    if (target.classList.contains("active")) return;
    timeframeButtons.forEach((button) => {
      if (button === target) {
        button.classList.add("active");
      } else {
        button.classList.remove("active");
      }
    });
    clearDashboardFromActivities();
    renderActivities(activities, target.id);
  };
  timeframeButtons.forEach((button) =>
    button.addEventListener("click", handleTimeframePickerClick)
  );
}

init();
main();
