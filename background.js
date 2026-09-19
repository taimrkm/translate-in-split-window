// ペア情報は service worker が停止しても残るよう storage.session に置く
// pairs: { [tabId]: { peer: tabId, role: "source" | "translated" } }

const getPairs = async () => (await chrome.storage.session.get("pairs")).pairs || {};
const setPairs = (pairs) => chrome.storage.session.set({ pairs });

const targetLang = () => chrome.i18n.getUILanguage().split("-")[0] || "ja";

const translateUrl = (url) =>
  `https://translate.google.com/translate?sl=auto&tl=${targetLang()}&u=${encodeURIComponent(url)}`;

const isTranslatable = (url) => /^https?:\/\//.test(url || "") && !/\.translate\.goog\//.test(url);

async function link(sourceId, translatedId) {
  const pairs = await getPairs();
  pairs[sourceId] = { peer: translatedId, role: "source" };
  pairs[translatedId] = { peer: sourceId, role: "translated" };
  await setPairs(pairs);
}

// 左右2ウィンドウに並べる
async function openSideBySide(tab) {
  if (!isTranslatable(tab.url)) return;
  const win = await chrome.windows.get(tab.windowId);
  const { left, top, width, height } = win;
  const half = Math.floor(width / 2);
  if (win.state !== "normal") await chrome.windows.update(win.id, { state: "normal" });
  await chrome.windows.update(win.id, { left, top, width: half, height });
  const created = await chrome.windows.create({
    url: translateUrl(tab.url),
    left: left + half,
    top,
    width: width - half,
    height,
  });
  await link(tab.id, created.tabs[0].id);
}

// 同じウィンドウの隣のタブに開く（Chrome標準の分割ビューで並べる用）
async function openInNextTab(tab) {
  if (!isTranslatable(tab.url)) return;
  const created = await chrome.tabs.create({
    url: translateUrl(tab.url),
    index: tab.index + 1,
    windowId: tab.windowId,
    active: false,
  });
  await link(tab.id, created.id);
}

chrome.action.onClicked.addListener(openSideBySide);

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "side-by-side",
    title: "翻訳を右ウィンドウに並べる",
    contexts: ["page", "action"],
  });
  chrome.contextMenus.create({
    id: "next-tab",
    title: "翻訳を隣のタブに開く（分割ビュー用）",
    contexts: ["page", "action"],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "side-by-side") openSideBySide(tab);
  if (info.menuItemId === "next-tab") openInNextTab(tab);
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  const tabId = sender.tab?.id;
  if (tabId == null) return;
  (async () => {
    const pair = (await getPairs())[tabId];
    if (msg.type === "isPaired") return sendResponse(!!pair);
    if (msg.type === "scroll" && pair) {
      chrome.tabs.sendMessage(pair.peer, msg).catch(() => {});
    }
  })();
  return msg.type === "isPaired";
});

// 原文側でページ遷移したら翻訳側も追従させる
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (!changeInfo.url) return;
  const pair = (await getPairs())[tabId];
  if (pair?.role === "source" && isTranslatable(changeInfo.url)) {
    chrome.tabs.update(pair.peer, { url: translateUrl(changeInfo.url) }).catch(() => {});
  }
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  const pairs = await getPairs();
  const pair = pairs[tabId];
  if (!pair) return;
  delete pairs[pair.peer];
  delete pairs[tabId];
  await setPairs(pairs);
});
