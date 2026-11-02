let page;

const TEST_TIMEOUT = 30000;

async function openPage(url) {
  await page.goto(url, { waitUntil: "domcontentloaded" });
}

async function closePage() {
  if (page) {
    await page.close();
    page = undefined;
  }
}

async function expectPageHeading(url) {
  await openPage(url);
  await page.waitForSelector("h1", { visible: true });
  const heading = await page.$eval("h1", (element) =>
    element.textContent.trim()
  );

  expect(heading).not.toBe("");
}

describe("GitHub team page tests", () => {
  beforeEach(async () => {
    page = await browser.newPage();
    await openPage("https://github.com/team");
  });

  afterEach(async () => {
    await closePage();
  });

  test(
    "The first link opens the GitHub homepage",
    async () => {
      const firstLink = await page.$("header div div a");
      expect(firstLink).not.toBeNull();

      await firstLink.click();
      await page.waitForSelector("h1", { visible: true });

      const title = await page.title();
      expect(title).toContain("GitHub");
    },
    TEST_TIMEOUT
  );

  test(
    "The first link has the expected href attribute",
    async () => {
      const actual = await page.$eval("a", (link) =>
        link.getAttribute("href")
      );

      expect(actual).toBe("#start-of-content");
    },
    TEST_TIMEOUT
  );

  test(
    "The page contains the Sign up for free button",
    async () => {
      const buttonSelector = ".btn-large-mktg.btn-mktg";

      await page.waitForSelector(buttonSelector, { visible: true });
      const actual = await page.$eval(
        buttonSelector,
        (button) => button.textContent
      );

      expect(actual).toContain("Sign up for free");
    },
    TEST_TIMEOUT
  );
});

// Отдельный describe имеет собственные хуки и не зависит от стартовой страницы выше.
describe("Other GitHub pages", () => {
  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await closePage();
  });

  test(
    "Features page has an h1 heading",
    async () => {
      await expectPageHeading("https://github.com/features");
    },
    TEST_TIMEOUT
  );

  test(
    "Enterprise page has an h1 heading",
    async () => {
      await expectPageHeading("https://github.com/enterprise");
    },
    TEST_TIMEOUT
  );

  test(
    "Topics page has an h1 heading",
    async () => {
      await expectPageHeading("https://github.com/topics");
    },
    TEST_TIMEOUT
  );
});
