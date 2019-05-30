# Tangle Analysis


## 安裝
git clone 完後 , 在終端機輸入以下指令
```
npm install
```

執行程式的指令
```
npm run dev-server
```

## 功能

給定一筆交易
畫出那些交易直接或間接驗證給定的交易

## 使用方法

預設是開在localhost:7000

畫面如下圖

![](https://i.screenshot.net/oqyolu3)

接著到以下網址去選個node的url來用

[網址](https://github.com/DLTcollab/Tangle-DoS-attacker/blob/master/config.py)

上面連結的畫面:

![](https://i.screenshot.net/13q5ece)

選個node的url

![](https://i.screenshot.net/wd6jwf0)

url有分hostname與port , 待會在 tool 要分開輸入

先輸入hostname

![](https://i.screenshot.net/wwl3yi8)

再輸入port

![](https://i.screenshot.net/mqdw2uq)

按下 set node 完成 node 的設置

接著到 [The Tangle](https://thetangle.org/) 去找筆當作起點的交易

找交易的畫面:

![](https://i.screenshot.net/rg6edsv)

任選的一筆交易:

![](https://i.screenshot.net/k8dgot2)

複製交易的 hash :

![](https://i.screenshot.net/k0mg1ax)

貼到 tool subTangle 後的欄位 :

![](https://i.screenshot.net/l2kz5f0)

按下 Graph , 等段時間 , 下面的框框就會出現 subtangle 的圖 :

![](https://i.screenshot.net/1mzw8tm)
