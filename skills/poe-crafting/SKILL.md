---
name: poe-crafting
description: Plan and check budgeted Path of Exile 1 crafts, compare buying against crafting, and explain legal next steps from an item's actual affixes using current prices and verified mechanics.
---

# PoE crafting

把預算轉成可执行的製裝路線，保留失敗分支；不把平均成本當保證。

## 工作順序

1. 確認 PoE 1、聯盟／模式、總預算、用途／技能、必需詞與可讓步詞。已由使用者明確提供的條件直接採用，不再列成缺資料。缺資料時標明假設；沒有精確詞綴時不能宣稱達成成品。
2. 讀 [製裝規則](references/rules.md)。千智攻擊杖再讀 [20D 案例](references/int-wand.md)。案例是有日期的研究，不是永久即時行情。
3. 先確認基底與詞綴在目標聯盟仍能取得；模擬器收錄舊物品不代表當季可買。從 ALT-CTRL-C 裝備文字或可靠資料列出基底、物等、稀有度、勢力、前／後綴數、詞綴 family、工藝／破裂／合成／污染狀態。混合詞算一個詞綴，不按顯示行數計數。
4. 比較成品、已洗好素材、自洗素材。價格附聯盟、時間、來源、可交易狀態。未取得底材／成品報價就留未知，不填零，不宣稱整條路線最便宜。
5. 每個操作先檢查合法性，寫出「目前物品 → 操作 → 成功／失敗狀態 → 下一步／停損」。先完成核心可用版，再考慮昂貴優化。遊戲內點擊、購買與交易仍由使用者決定。

## 工具分工

- PoEDB 查當季詞綴與限制；CoE 驗證支援的方法與成功率。PoB 只驗證成品對指定 build 的效益，不能代替製裝概率。
- 使用 CoE 後讀回匯入詞綴、物等、勢力、稀有度與計算結果；不能只看輸入欄已填。看到 unsupported／no handler／upcoming 就不能聲稱模擬成功。
- CoE 沒有公開 API；使用網頁或其公開匯入格式，不杜撰 API。缺支援時提供機制證據與未驗證部分。
- `python3 scripts/cost.py <plan.json>` 計算已報價支出、缺價項、預算餘額及已知單次成功率的有限嘗試概率。JSON 格式見案例。此程式不會查價或模擬 PoE，也不驗證 recipe。

## 交付

先說推荐路線及達到的詞綴；接著列步驟、成本上限與停損；最後分開列已驗證、模型估算、缺資料。只在機制與報價足以支持時稱為可在預算內完成。涉及隨機結果時說成功機率與失敗後保留什麼，不承諾必成。

測試與已知限制供審閱：[Luna 測試紀錄](tests/results.md)。歷史測試輸出含已修正錯誤，不用作製作指南。
