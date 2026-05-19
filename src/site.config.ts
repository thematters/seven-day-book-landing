export const SITE_TITLE = "Matters 七日書";
export const SITE_SHORT = "七日書";
export const SITE_SUBTITLE = "Seven-Day Book on Matters";
export const SITE_TAGLINE = "七天、七題、一次把私人書寫變成公共記憶。";
export const SITE_DESCRIPTION =
  "七日書是 Matters 的常態書寫活動：以七道題目為序，邀請社群在七天內完成七篇短文，累積 3000+ 參與人次、9000+ 篇作品。";
export const SITE_LANG = "zh-TW";
export const SITE_TIMEZONE = "Asia/Taipei";
export const MAIN_SITE_URL = "https://matters.town";
export const DEFAULT_AUTHOR = "Matters";
export const DEFAULT_OG_IMAGE = "images/og-cover.png";

/**
 * 活動提醒 email 收集 endpoint
 * — Google Apps Script Web App，部署於 mashbean@matters.town 帳號下
 * — 接收 POST { email, source }，append 一列到 Google Sheet
 * — 之後要交接時請更新 Sheet ownership + 重新部署 Web App 取得新 URL
 */
export const EMAIL_REMINDER_ENDPOINT =
  "https://script.google.com/a/macros/matters.town/s/AKfycbxpw-vhlOy921676vypOD0-mB30-cpWvKVFPDWIfawJojy9p97mxiLKk_omkE7FtUJ2og/exec";
