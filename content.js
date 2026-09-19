// ペアになっているタブ同士でスクロール位置（割合）を同期する
if (window.top === window) {
  let muteUntil = 0; // 相手から受けたスクロールを送り返さないための抑止
  let ticking = false;

  const maxScroll = () =>
    Math.max(1, document.documentElement.scrollHeight - window.innerHeight);

  window.addEventListener(
    "scroll",
    () => {
      if (Date.now() < muteUntil || ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        chrome.runtime
          .sendMessage({ type: "scroll", ratio: window.scrollY / maxScroll() })
          .catch(() => {});
      });
    },
    { passive: true }
  );

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type !== "scroll") return;
    muteUntil = Date.now() + 200;
    window.scrollTo(0, msg.ratio * maxScroll());
  });
}
