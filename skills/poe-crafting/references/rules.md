# 製裝隱藏規則與工具邊界

查核日：2026-09-27；PoE 1。跨版本須重新查核與保留來源。

## 先驗證當季能取得基底

模擬器收錄歷史物品，不代表當季可取得。先查官方版本紀錄與當季市場，再選底材。3.27 起 Carved／Engraved／Imbued Wand 不再能新取得；不能推薦在 Allflame 從零買 Imbued。Kinetic／Blasting／Somatic 新底材有 Cannot roll Caster Modifiers，不可只換名字就沿用智慧法傷自洗路線。需驗證每種操作是否遵守該限制；本案例以可骰施法詞的 Omen Wand 避免此未驗證分支。

來源：[GGG 3.27 官方更新](https://www.pathofexile.com/forum/view-thread/3869068)、[Omen Wand](https://poedb.tw/us/Omen_Wand)。

## 每一步先看物品狀態

- 一般法杖：魔法最多 1 前＋1 後；稀有最多 3 前＋3 後。詞綴互斥由 family/group 決定，不是字面看起來不同就能共存。
- 物等門檻不等於角色需求等級。底材與勢力會改變詞池／權重，不能把另一把杖的改造石成功率搬過來。
- 改造石只作用於魔法物品；白裝先蛻變，稀有裝若要洗白重來會失去原词，不能寫「白／魔法直接改造」。富豪把魔法升為稀有；先讀回稀有度再選通貨。
- 工藝「前綴無法被變更」本身佔後綴，沒有空後綴不能上。它保護已有前綴，不等於封鎖新增前綴；不同製作方式不一定遵守 metamod。
- 「前綴鎖 → 洗白」會連同作為後綴的前綴鎖一起洗掉；洗白後保留前綴、沒有後綴，不要再列一個移除前綴鎖的操作或費用。若只剩一前綴，洗白還可能變魔法；本案例有兩個以上前綴，所以仍是稀有。
- 多工藝本身佔一條後綴與三條工藝額度之一，通常只能再加兩條工藝。先數空位，不能說「多工藝再加三詞」。
- 工藝台移除工藝與直接洗白不同。沒有保護時洗白會失去原詞。

狀態轉換參考：[Metamod 與洗白](https://www.poewiki.net/wiki/Metamod)。

## 覺醒者之玉：適合兩個不同勢力核心詞

先點供體（消耗），再點接收底材（保留基底與物等）；兩者須同物品類別、可相容且不同勢力。各自只留一個目標勢力詞最容易控制；多個勢力詞會讓保留對象隨機。其他詞重新生成，不能預期原攻速或工藝鎖保留。完成後重新數前後綴，不能假設永遠有空後綴。各一個可相容勢力詞的保留是此操作的規則，不因 CoE calculator 不支援就變成未知命中率；隨機的是其他詞及後續收尾，不能把「核心保留」和「整把成品達標」混為一談。

來源：[PoEDB 覺醒者之玉](https://poedb.tw/us/Awakeners_Orb)。

## 救後綴：先看還有沒有空前綴

Farric Wolf Alpha「加前綴、移除隨機後綴」適用稀有物，需有可加的前綴空間。可用來為兩個核心前綴＋滿後綴的物品騰出後綴；新增前綴仍是隨機。三前綴三後綴時不能沿用這步。

滿六詞時：不要直接指示上鎖、工藝攻速或野獸加前。先比較保留現狀與冒險無效石；無效石可能移除核心，必須揭露並計入重做。不要用「鎖了前綴後再無效」解釋無法放入鎖的滿六詞狀態。

來源：[Farric Wolf Alpha](https://poedb.tw/us/Farric_Wolf_Alpha)；[前綴鎖資料](https://poedb.tw/cache1/us/Poe_Data_Mods_hover/5169807c7c3afb6186ecf61ddf312df2ed3c40f1522c42451fbca16c349f3c54)。

## 合成器：野獸祝福不是必上公式

- 先分可選詞的 predictable 與隨機 unpredictable 模式。前者失敗可摧毀物品，必須讀當次遊戲顯示成功率；後者的 base 選擇、勢力、詞綴可轉移性仍要檢查。
- 合成器不能當作覺醒者之玉，把不同勢力底材自動合成雙勢力。選中的 base 不支援的勢力詞不能任意移植。
- 3.26 已改動大量非自然生成詞的填充收益。3.25「多工艺／精髓／揭露填滿就固定高成功率」不能直接沿用。
- 野獸 Aspect（貓／蛛／鳥／蟹）與 Brinehook's Ducat 的 Pantheon Aspect 是不同來源，不能混成同一規則。後者給隨機萬神殿祝福；「可用作不可轉移填充」是需確認的當季技巧，不是官方成功率保證。
- 2026-09-27 的 poeregex 合成器模型明示 Beast Aspect 機制尚未量測；不拿其數字證明含該詞的路線。工具拒算也是結果，不能補造百分比。
- 填充前要算額外野獸／工藝費、佔位與失敗損失，確認目標詞是否互斥；核心成品可能不值得為填充再花錢。
- 合成後是新物品；不能假設原物品拓印能救回合成結果。先驗證復原機制再把拓印列為保險。

來源：[GGG 3.26 patch notes](https://www.pathofexile.com/forum/view-thread/3787013)、[Brinehook's Ducat](https://poedb.tw/us/Brinehooks_Ducat)、[當季合成器模型及限制](https://poeregex.cz/recombinator)、[Recombination](https://www.poewiki.net/wiki/Recombination)。

## 機率、預算與時間

機率必須標明成功事件：命中目標前綴、取得可用素材、最終成品是三種不同事件。若CoE沒有排除其他勢力詞，只能稱「前綴出現率」，不能稱「合格素材率」。沒有測合格條件就輸出未知，不把兩個前綴率相乘後改名。

平均嘗試數不代表保證。固定成功率 p 的獨立重試，n 次內成功率是 1-(1-p)^n；若失敗會改變物品、機率或成本，不能直接套同一 p。用上限管理支出，不以無限重試承諾 20D 成品。多階段概率不能把各階段 p95 相加就稱為整體 p95。

報價要分材料市場估價與實際可買清單；同時保留底材、工藝、失敗、金幣／粉塵等成本。缺價不是免費。裝備售價不是保證賣出金額，不預設靠出售失敗品回本。

## CoE 已知限制（當次實測，不是永久狀態）

2026-09-27 beta 3.29.3.1.2：改造石 calculator 可回傳概率；Weapon Recombinator 顯示 Upcoming；Awakener calculator 匯入供體後顯示 No handler for crafting this method（[實測文字](coe-awakener-calculator.txt)）。這不證明網站所有其他模組都不支援，需實測指定模組。普通 Ctrl-C 匯入可能只得到白底材，使用 ALT-CTRL-C 並讀回詞綴；自動 fill 物等欄可能沒觸發重新計算，必須檢查計算狀態與匯出物品。

來源：[CoE developers](https://beta.craftofexile.com/developpers)、[changelog](https://beta.craftofexile.com/changelog?game=poe1)。
